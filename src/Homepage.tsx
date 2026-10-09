import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { byId } from './data'
import { heroReveal } from './heroReveal'
import './homepage.css'

const BuddhaModel = lazy(() => import('./BuddhaModel').then((module) => ({ default: module.BuddhaModel })))
const chapters = ['见微', '观像', '有信']

export function Entrance() {
  const sequence = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const currentPhase = useRef(0)
  const [phase, setPhase] = useState(0)
  const [modelState, setModelState] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const item = byId.buddha

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      if (!sequence.current || !stage.current) return
      const distance = sequence.current.offsetHeight - stage.current.offsetHeight
      const p = preference.matches ? 1 : Math.max(0, Math.min(1, -sequence.current.getBoundingClientRect().top / Math.max(1, distance)))
      const camera = 1 - Math.pow(1 - p, 2.1)
      stage.current.style.setProperty('--p', String(p))
      stage.current.style.setProperty('--camera', String(camera))
      const reveal = heroReveal(p)
      stage.current.style.setProperty('--reveal', String(reveal))
      stage.current.style.setProperty('--hero-shade', String(.68 * (1 - reveal)))
      stage.current.dispatchEvent(new Event('camera-progress'))
      const nextPhase = p < .25 ? 0 : p < .64 ? 1 : 2
      if (currentPhase.current !== nextPhase) { currentPhase.current = nextPhase; setPhase(nextPhase) }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    preference.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      preference.removeEventListener('change', schedule)
    }
  }, [])

  const jumpToChapter = (index: number) => {
    if (!sequence.current || !stage.current) return
    const distance = Math.max(0, sequence.current.offsetHeight - stage.current.offsetHeight)
    const offset = sequence.current.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: offset + distance * [0, .43, 1][index], behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const startJourney = () => {
    document.getElementById('journey')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <section className="dh-sequence" id="top" ref={sequence} aria-label="敦煌有信序章，向下滚动展开">
    <div className={'dh-stage ' + (modelState === 'ready' ? 'dh-has-model' : '')} ref={stage}>
      <div className="dh-light" aria-hidden="true" />
      <div className="dh-paper" aria-hidden="true"><img src="/assets/diamond-text.jpg" alt="" /></div>
      <div className="dh-artwork">
        <img className="dh-buddha" src={item.image} alt="" aria-hidden="true" fetchPriority="high" />
        {item.modelUrl && modelState !== 'fallback' && <Suspense fallback={null}>
          <BuddhaModel url={item.modelUrl} mode="hero" rotationY={item.modelRotationY} onState={setModelState} />
        </Suspense>}
      </div>
      <div className="dh-reveal-shade" aria-hidden="true" />
      <div className="dh-vignette" aria-hidden="true" />

      <div className="dh-opening" aria-hidden={phase !== 0}>
        <p className="dh-overline">丝路遗珍 · 数字相逢</p>
        <h1>一眼，<em>千年。</em></h1>
        <p className="dh-opening-caption">循着微光，与千年相逢。</p>
      </div>
      <div className="dh-observe" aria-hidden={phase !== 1}>
        <span className="dh-small-number">02 / 观像</span>
        <h2>光落在木上，<br /><em>时间有了形状。</em></h2>
        <p>在一寸纹理里，<br />与遥远的岁月相遇。</p>
      </div>
      <div className="dh-arrival" inert={phase !== 2} aria-hidden={phase !== 2}>
        <p className="dh-overline">A LETTER FROM DUNHUANG</p>
        <p className="dh-arrival-prelude">越过山海，终于相逢。</p>
        <h2>敦煌<span>有信</span><i>。</i></h2>
        <p className="dh-arrival-copy">一卷经文，一页乐谱，一尊坐佛。<br />从敦煌出发，在伦敦与巴黎走近遗珍。</p>
        <div className="dh-arrival-actions">
          <button className="dh-primary" onClick={startJourney}>从敦煌出发 <span aria-hidden="true">→</span></button>
          <a className="dh-text-button" href="#collection">走近伦敦馆藏 <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <span className="dh-vertical" aria-hidden="true">见 微 · 知 远</span>
      <div className="dh-stage-bottom">
        <div className="dh-chapters" aria-label="开场章节">{chapters.map((label, index) => <button key={label} aria-current={phase === index ? 'step' : undefined} onClick={() => jumpToChapter(index)}><small>0{index + 1}</small><span>{label}</span><i aria-hidden="true" /></button>)}</div>
        <button className="dh-scroll-cue" onClick={() => phase < 2 ? jumpToChapter(phase + 1) : startJourney()}>{phase < 2 ? '向下滚动，展开故事' : '向下，从敦煌出发'}<span aria-hidden="true">↓</span></button>
        <span className="dh-image-note">{modelState === 'ready' ? '木雕坐佛 · ' + item.modelDescription : '木雕坐佛 · 馆藏照片'}</span>
      </div>
      <div className="dh-edge-progress" aria-hidden="true"><i /></div>
    </div>
  </section>
}
