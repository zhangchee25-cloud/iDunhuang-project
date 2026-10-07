import { useEffect, useRef, useState } from 'react'
import { byId, type ExhibitId } from './data'
import './homepage.css'

// Supply the finished AI camera shot here. The page maps scrolling to its timeline.
const CAMERA_FILM: string | null = null
const chapters = ['见微', '观像', '有信']
const gallery: { id: ExhibitId; word: string; title: string; copy: string; action: string }[] = [
  { id: 'diamond', word: '卷', title: '纸上，留下千年。', copy: '循着雕版的线条与卷末的题记，读一卷经文走过的时间。', action: '展开经卷' },
  { id: 'pipa', word: '声', title: '无声处，仍有回响。', copy: '一页古老的乐谱，留下关于声音的线索，也留下等待追问的空白。', action: '走近乐谱' },
  { id: 'buddha', word: '像', title: '静默中，自有万象。', copy: '从衣褶到莲座，凝视木雕的细节，走近一尊坐佛的馆藏故事。', action: '静观坐佛' },
]

export function Entrance({ onEnter }: { onEnter: (target?: string) => void }) {
  const sequence = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const film = useRef<HTMLVideoElement>(null)
  const about = useRef<HTMLDialogElement>(null)
  const progress = useRef(0)
  const currentPhase = useRef(0)
  const [phase, setPhase] = useState(0)
  const [filmReady, setFilmReady] = useState(false)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      if (!sequence.current || !stage.current) return
      const distance = sequence.current.offsetHeight - stage.current.offsetHeight
      const p = preference.matches ? 1 : Math.max(0, Math.min(1, -sequence.current.getBoundingClientRect().top / Math.max(1, distance)))
      progress.current = p
      const camera = 1 - Math.pow(1 - p, 2.1)
      stage.current.style.setProperty('--p', String(p))
      stage.current.style.setProperty('--camera', String(camera))
      const nextPhase = p < .25 ? 0 : p < .64 ? 1 : 2
      if (currentPhase.current !== nextPhase) { currentPhase.current = nextPhase; setPhase(nextPhase) }
      const video = film.current
      if (video && !video.seeking && Number.isFinite(video.duration) && video.duration > 0) {
        const target = p * Math.max(0, video.duration - .05)
        if (Math.abs(video.currentTime - target) > .035) video.currentTime = target
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    preference.addEventListener('change', schedule)
    const video = film.current
    video?.addEventListener('loadedmetadata', schedule)
    video?.addEventListener('seeked', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      preference.removeEventListener('change', schedule)
      video?.removeEventListener('loadedmetadata', schedule)
      video?.removeEventListener('seeked', schedule)
    }
  }, [])

  const jumpToChapter = (index: number) => {
    if (!sequence.current || !stage.current) return
    const distance = Math.max(0, sequence.current.offsetHeight - stage.current.offsetHeight)
    const offset = sequence.current.getBoundingClientRect().top + window.scrollY
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: offset + distance * [0, .43, 1][index], behavior: reduced ? 'instant' : 'smooth' })
  }
  const jumpToGallery = () => {
    const heading = document.getElementById('home-gallery-title')
    document.getElementById('home-gallery')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    heading?.focus({ preventScroll: true })
  }

  return (
    <main className="dh-home">
      <header className="dh-header">
        <button className="dh-brand" onClick={() => jumpToChapter(0)} aria-label="敦煌有信，回到序章"><span className="dh-seal">敦</span><span>敦煌有信<small>iDUNHUANG</small></span></button>
        <nav aria-label="首页导航"><button onClick={() => jumpToChapter(0)}>序章</button><button onClick={jumpToGallery}>三件遗珍</button><button onClick={() => about.current?.showModal()}>关于此展</button></nav>
        <button className="dh-nav-enter" onClick={() => onEnter()}>进入展览 <span aria-hidden="true">↗</span></button>
      </header>

      <section className="dh-sequence" ref={sequence} aria-label="敦煌有信序章，向下滚动展开">
        <div className={`dh-stage ${filmReady ? 'dh-has-film' : ''}`} ref={stage}>
          <div className="dh-light" aria-hidden="true" />
          <div className="dh-paper" aria-hidden="true"><img src="/assets/diamond-text.jpg" alt="" /></div>
          <img className="dh-buddha" src="/assets/buddha-interpretation.png" alt="" aria-hidden="true" />
          {CAMERA_FILM && <video className="dh-camera-film" ref={film} src={CAMERA_FILM} muted playsInline preload="auto" aria-hidden="true" onLoadedData={() => setFilmReady(true)} onError={() => setFilmReady(false)} />}
          <div className="dh-vignette" aria-hidden="true" />

          <div className="dh-opening" aria-hidden={phase !== 0}>
            <p className="dh-overline">丝路遗珍 · 数字相逢</p>
            <h1>一眼，<em>千年。</em></h1>
            <p className="dh-opening-caption">走近一点，时间自有回声。</p>
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
            <p className="dh-arrival-copy">一卷经文，一页乐谱，一尊坐佛。<br />散落远方的敦煌，在此相逢。</p>
            <div className="dh-arrival-actions"><button className="dh-primary" onClick={() => onEnter()}>进入敦煌 <span aria-hidden="true">→</span></button><button className="dh-text-button" onClick={jumpToGallery}>先看三件遗珍 <span aria-hidden="true">↓</span></button></div>
          </div>
          <span className="dh-vertical" aria-hidden="true">见 微 · 知 远</span>
          <div className="dh-stage-bottom">
            <div className="dh-chapters" aria-label="开场章节">{chapters.map((label, index) => <button key={label} aria-current={phase === index ? 'step' : undefined} onClick={() => jumpToChapter(index)}><small>0{index + 1}</small><span>{label}</span><i aria-hidden="true" /></button>)}</div>
            <button className="dh-scroll-cue" onClick={() => phase < 2 ? jumpToChapter(phase + 1) : jumpToGallery()}>{phase < 2 ? '向下滚动，展开故事' : '向下，走近三件遗珍'}<span aria-hidden="true">↓</span></button>
            <span className="dh-image-note">木雕坐佛 · AI 辅助艺术示意</span>
          </div>
          <div className="dh-edge-progress" aria-hidden="true"><i /></div>
        </div>
      </section>

      <section className="dh-gallery" id="home-gallery" aria-labelledby="home-gallery-title">
        <div className="dh-gallery-heading"><div><p className="dh-overline">THE COLLECTION / 馆藏线索</p><h2 id="home-gallery-title" tabIndex={-1}>三件遗珍，<br /><em>三种回响。</em></h2></div><p>文物散藏于不同的地方，故事仍从敦煌出发。<br />从一处细节开始，沿着图像与馆藏记录，<br />读懂它们走过的路。</p></div>
        <div className="dh-gallery-grid">{gallery.map((entry, index) => <article className={`dh-artifact dh-artifact-${entry.id}`} key={entry.id}>
          <div className="dh-artifact-top"><span>0{index + 1}</span><span>{byId[entry.id].city} / {byId[entry.id].shelfmark}</span></div>
          <button className="dh-artifact-image" onClick={() => onEnter(`exhibit-${entry.id}`)} aria-label={`查看${byId[entry.id].name}`}><img src={byId[entry.id].image} alt={byId[entry.id].imageAlt} loading="lazy" /><span aria-hidden="true">{entry.word}</span></button>
          <p className="dh-artifact-name">{byId[entry.id].name}</p><h3>{entry.title}</h3><p className="dh-artifact-copy">{entry.copy}</p><button className="dh-artifact-link" onClick={() => onEnter(`exhibit-${entry.id}`)}>{entry.action}<span aria-hidden="true">↗</span></button>
        </article>)}</div>
        <div className="dh-gallery-end"><span>让一次凝视，成为一次相逢。</span><button onClick={() => onEnter()}>开启完整数字旅程 <span aria-hidden="true">↗</span></button></div>
      </section>
      <footer className="dh-footer"><div><strong>敦煌有信</strong><span>iDUNHUANG · 2026</span></div><p>敦煌文物与遗书数字展<br />非商业教育展示</p><button onClick={() => about.current?.showModal()}>图像来源与说明 ↗</button><button onClick={() => jumpToChapter(0)}>回到序章 ↑</button></footer>

      <dialog className="dh-about" ref={about} onClick={(event) => { if (event.target === event.currentTarget) about.current?.close() }} aria-labelledby="dh-about-title"><div><button className="dh-about-close" onClick={() => about.current?.close()} aria-label="关闭展览说明">×</button><p className="dh-overline">ABOUT THE EXHIBITION</p><h2 id="dh-about-title">关于「敦煌有信」</h2><p>以图像、文字与交互展示，走近敦煌文物与遗书。页面中的坐佛是 AI 辅助艺术示意，非原件照片；文物信息以收藏机构的记录为准。</p>{gallery.map(({ id }) => <p key={id}><strong>{byId[id].name}</strong><br />{byId[id].imageCredit}。<br /><a href={byId[id].sourceUrl} target="_blank" rel="noreferrer">查看馆藏记录 ↗</a></p>)}<p>页面中的诗性文案为展览创作文案，非经文或历史文献引文。</p></div></dialog>
    </main>
  )
}
