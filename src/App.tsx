import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react'
import { byId, conversations, type ExhibitId } from './data'
import { Entrance } from './Homepage'
import { BuddhaViewer } from './BuddhaViewer'
import { PuzzleIntro } from './puzzle/components/PuzzleIntro'
import DesktopPage from './puzzle/pages/DesktopPage'
import EndingPage from './puzzle/pages/EndingPage'
import './journey.css'

const ScrollScene = lazy(() => import('./ScrollScene').then((module) => ({ default: module.ScrollScene })))

const readerPages = [
  { label: '卷首版画', path: '/assets/diamond-frontispiece.jpg', alt: '《金刚经》卷首雕版画' },
  { label: '经文细节', path: '/assets/diamond-text.jpg', alt: '《金刚经》雕版印刷的经文细节' },
  { label: '卷末题记', path: '/assets/diamond-colophon.jpg', alt: '《金刚经》卷末写有咸通九年纪年的题记' },
  { label: '全卷概览', path: '/assets/diamond-overview.jpg', alt: '《金刚经》全卷拼接概览' },
]

function Reader({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  const [page, setPage] = useState(0)
  const [zoom, setZoom] = useState(1)
  const currentPage = readerPages[page]

  return (
    <dialog className="reader-dialog" ref={dialogRef} onClose={() => setZoom(1)} aria-label="展开《金刚经》图像">
      <div className="reader-shell">
        <div className="reader-heading">
          <div>
            <span className="eyebrow">OR.8210/P.2 · 数字图像</span>
            <h2>展开《金刚经》</h2>
            <p>图像来自 IDP 所收录的英国图书馆馆藏。选择卷页，放大观察雕版线条与文字。</p>
          </div>
          <button className="icon-close" type="button" aria-label="关闭阅读视图" onClick={() => dialogRef.current?.close()}>×</button>
        </div>
        <div className="reader-controls">
          <div className="reader-tabs" role="tablist" aria-label="选择卷页">
            {readerPages.map((item, index) => (
              <button key={item.label} type="button" role="tab" aria-selected={page === index} className={page === index ? 'selected' : ''} onClick={() => { setPage(index); setZoom(1) }}>
                {item.label}
              </button>
            ))}
          </div>
          <label className="zoom-control">
            <span>放大 {Math.round(zoom * 100)}%</span>
            <input aria-label="图像放大比例" type="range" min="1" max="2.5" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
          </label>
        </div>
        <div className={`reader-image ${page === 3 ? 'overview' : ''}`} role="tabpanel">
          <img src={currentPage.path} alt={currentPage.alt} style={{ width: `${zoom * 100}%` }} />
        </div>
        <div className="reader-foot">
          <span>© British Library Board / International Dunhuang Programme · 非商业展示</span>
          <a href={byId.diamond.sourceUrl} target="_blank" rel="noreferrer">查看 IDP 馆藏记录 ↗</a>
        </div>
      </div>
    </dialog>
  )
}


const navigation = [
  { id: 'top', label: '序章' },
  { id: 'journey', label: '敦煌' },
  { id: 'collection', label: '伦敦' },
  { id: 'paris', label: '巴黎' },
  { id: 'sources', label: '来源' },
]
const exhibitOrder: ExhibitId[] = ['diamond', 'buddha', 'pipa']
const exhibitHeadings = {
  diamond: { number: '01', kind: '卷 / 遗书', line: '纸上，留下千年。' },
  buddha: { number: '02', kind: '像 / 器物', line: '静默中，自有万象。' },
  pipa: { number: '03', kind: '声 / 音乐', line: '无声处，仍有回响。' },
}

function JourneyNavigation({ onOpenPuzzle }: { onOpenPuzzle: () => void }) {
  const [active, setActive] = useState('top')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = 'top'
      for (const entry of navigation) {
        if ((document.getElementById(entry.id)?.getBoundingClientRect().top ?? Infinity) <= window.innerHeight * .4) current = entry.id
      }
      setActive(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
  return <header className="dh-header">
    <a className="dh-brand" href="#top" aria-label="敦煌有信，回到序章"><img className="dh-emblem" src="/assets/team-emblem.svg" alt="iD 飘带支队队徽" width="44" height="44" /><span>敦煌有信<small>iDUNHUANG</small></span></a>
    <nav aria-label="展览路线">{navigation.map((entry) => <a key={entry.id} href={'#' + entry.id} aria-current={active === entry.id ? 'location' : undefined}>{entry.label}</a>)}</nav>
    <div className="dh-header-actions">
      <span className="journey-edition">数字文化遗产 · 2026</span>
      <button className="dh-puzzle-entry" type="button" onClick={onOpenPuzzle} aria-label="微信新消息，进入网页解密">
        <span className="dh-puzzle-dot" aria-hidden="true" />
        微信新消息
        <span className="dh-puzzle-badge" aria-hidden="true">1</span>
      </button>
    </div>
  </header>
}

function ExhibitQuestions({ id }: { id: ExhibitId }) {
  const questions = conversations.filter((entry) => entry.exhibit === id)
  const [activeId, setActiveId] = useState(questions[0]?.id)
  const active = questions.find((entry) => entry.id === activeId) ?? questions[0]
  if (!active) return null
  return <section className="artifact-dialogue" id={id === 'diamond' ? 'dialogue' : 'dialogue-' + id} aria-labelledby={'questions-title-' + id}>
    <div className="artifact-dialogue-heading"><span>问 / 答</span><h4 id={'questions-title-' + id}>与{byId[id].name}对话</h4><small>馆藏资料整理</small></div>
    <div className="artifact-questions" aria-label={byId[id].name + '的可选问题'}>
      {questions.map((entry) => <button type="button" key={entry.id} aria-pressed={active.id === entry.id} onClick={() => setActiveId(entry.id)}>{entry.question}</button>)}
    </div>
    <div className="artifact-answer" aria-live="polite"><p>{active.answer}</p><a href={active.sourceUrl} target="_blank" rel="noreferrer">查证来源 · {active.sourceLabel} ↗</a></div>
    <p className="artifact-dialogue-note">从已核对的馆藏资料出发，更多问题可沿来源继续探索。</p>
  </section>
}

function Artifact({ id, onOpenReader }: { id: ExhibitId; onOpenReader?: () => void }) {
  const item = byId[id]
  const heading = exhibitHeadings[id]
  return <article className={'journey-artifact artifact-' + id} id={'exhibit-' + id} aria-labelledby={'artifact-title-' + id}>
    <div className="artifact-topline"><span>{heading.number} / {heading.kind}</span><span>{item.institution} · {item.shelfmark}</span></div>
    <div className="artifact-layout">
      <div className={'artifact-media media-' + id}>
        {id === 'diamond' ? <div className="scroll-display">
          <Suspense fallback={<img className="scroll-placeholder" src={item.image} alt={item.imageAlt} />}>
            <ScrollScene onOpenReader={onOpenReader!} />
          </Suspense>
        </div> : id === 'buddha' ? <BuddhaViewer /> : <figure className="score-image"><img src={item.image} alt={item.imageAlt} loading="lazy" /><figcaption>Pelliot chinois 3808 · f.16 / 背面乐谱页</figcaption></figure>}
      </div>
      <div className="artifact-copy">
        <span className="artifact-type">{item.city} / {heading.kind}</span>
        <h3 id={'artifact-title-' + id}>{item.name}</h3>
        <p className="artifact-english">{item.english}</p>
        <p className="artifact-poem">{heading.line}</p>
        <p className="artifact-summary">{item.summary}</p>
        <p className="artifact-detail">{item.detail}</p>
        <dl className="artifact-facts"><div><dt>年代</dt><dd>{item.period}</dd></div><div><dt>材质</dt><dd>{item.material}</dd></div><div><dt>馆藏编号</dt><dd>{item.shelfmark}</dd></div></dl>
        <div className="artifact-actions">
          {id === 'diamond' && <button type="button" onClick={onOpenReader}>展开经卷 <span aria-hidden="true">↗</span></button>}
          <a href={item.sourceUrl} target="_blank" rel="noreferrer">查看馆藏记录 ↗</a>
        </div>
      </div>
    </div>
    <ExhibitQuestions id={id} />
  </article>
}

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [puzzleStage, setPuzzleStage] = useState<'idle' | 'intro' | 'desktop' | 'ending'>(() => {
    const hash = window.location.hash
    if (hash === '#ending') return 'ending'
    if (hash === '#puzzle') return 'intro'
    return 'idle'
  })

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash
      if (hash === '#ending') setPuzzleStage('ending')
      else if (hash === '#puzzle') setPuzzleStage('intro')
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    let frame = 0
    const visitHash = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let id = ''
        try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
        if (!id) return
        const target = document.getElementById(id)
        target?.scrollIntoView({ behavior: 'instant', block: 'start' })
        target?.focus({ preventScroll: true })
      })
    }
    visitHash()
    return () => cancelAnimationFrame(frame)
  }, [])

  const openPuzzle = () => {
    setPuzzleStage('intro')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const closePuzzle = () => {
    setPuzzleStage('idle')
    if (window.location.hash === '#puzzle' || window.location.hash === '#ending') window.location.hash = ''
  }

  if (puzzleStage === 'intro') return <PuzzleIntro onEnter={() => setPuzzleStage('desktop')} />

  if (puzzleStage === 'desktop') return <DesktopPage onBack={closePuzzle} />

  if (puzzleStage === 'ending') return <EndingPage onHome={closePuzzle} />

  return <div className="dh-home journey-site">
    <a className="skip-link" href="#journey">跳过序章，开始数字旅程</a>
    <JourneyNavigation onOpenPuzzle={openPuzzle} />
    <main>
      <Entrance />
      <section className="city-origin" id="journey" tabIndex={-1} aria-labelledby="dunhuang-title">
        <div className="journey-width">
          <div className="city-intro"><span className="city-number">01 / DUNHUANG</span><div><p className="city-label">敦煌 · 莫高窟第 17 窟</p><h2 id="dunhuang-title">故事的起点，<br /><em>在敦煌。</em></h2></div></div>
          <div className="origin-copy"><p>从一卷经文、一页乐谱到一尊坐佛，藏经洞让我们得以走近敦煌的文字、声音与信仰。今天，它们分藏于不同机构，数字图像和馆藏记录为我们提供了重新观看的入口。</p><p>这次数字旅程从敦煌出发，先走近伦敦，再来到巴黎。三座城市连接的是本展览的阅读顺序；每件文物的流转与现藏信息，都以各自的馆藏记录为线索。</p></div>
          <ol className="city-route" aria-label="本展览阅读路线">
            <li><a href="#journey"><small>起点 / 01</small><strong>敦煌</strong><span>共同的文化源头</span></a></li>
            <li><a href="#collection"><small>馆藏 / 02</small><strong>伦敦</strong><span>英国图书馆 · 大英博物馆</span></a></li>
            <li><a href="#paris"><small>馆藏 / 03</small><strong>巴黎</strong><span>法国国家图书馆</span></a></li>
          </ol>
          <a className="chapter-next" href="#collection">下一站 · 伦敦 <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="city-collection city-london" id="collection" tabIndex={-1} aria-labelledby="london-title">
        <div className="journey-width">
          <div className="city-intro"><span className="city-number">02 / LONDON</span><div><p className="city-label">伦敦 · 两处馆藏，两种凝视</p><h2 id="london-title">纸上的千年，<br /><em>木上的时间。</em></h2></div><p className="city-description">在英国图书馆读一卷经文，<br />在大英博物馆看一尊坐佛。<br />从文字的线条，走向器物的肌理。</p></div>
          <Artifact id="diamond" onOpenReader={() => dialogRef.current?.showModal()} />
          <Artifact id="buddha" />
          <a className="chapter-next" href="#paris">下一站 · 巴黎 <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="city-collection city-paris" id="paris" tabIndex={-1} aria-labelledby="paris-title">
        <div className="journey-width">
          <div className="city-intro"><span className="city-number">03 / PARIS</span><div><p className="city-label">巴黎 · 法国国家图书馆</p><h2 id="paris-title">无声的纸页，<br /><em>留住声音的线索。</em></h2></div><p className="city-description">文字之外，还有关于音乐的记忆。<br />在遗书背面，<br />一页乐谱等待新的阅读。</p></div>
          <Artifact id="pipa" />
        </div>
      </section>

      <section className="journey-bridge" aria-labelledby="bridge-title">
        <div className="journey-width"><p className="dh-overline">DIGITAL REUNION / 数字相逢</p><h2 id="bridge-title">散藏于远方，<br /><em>重逢于眼前。</em></h2><p>数字图像让纸张、笔迹与雕刻细节被反复观看；清楚的馆藏记录，让一次凝视成为继续追问的起点。沿着来源，我们也能继续理解文物与遗书的保存、研究和数字化。</p><a className="chapter-next" href="#sources">沿着来源，继续探索 <span aria-hidden="true">↓</span></a></div>
      </section>
    </main>

    <footer className="journey-sources" id="sources" tabIndex={-1}>
      <div className="journey-width">
        <div className="sources-heading"><div><p className="dh-overline">SOURCES & CREDITS</p><h2>每一次观看，<br />都有来处。</h2></div><p>聚焦海外敦煌文物与遗书的数字化传播。<br />为支队宣传制作的非商业教育展示。</p></div>
        <div className="sources-list">{exhibitOrder.map((id) => {
          const item = byId[id]
          return <div key={id}><h3>{item.name}</h3><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.institution} · {item.shelfmark} ↗</a><p>{item.imageCredit}</p><a className="rights-link" href={item.imageRightsUrl} target="_blank" rel="noreferrer">{item.imageRights} ↗</a>{item.modelUrl && <p>{item.modelDescription}。{item.modelCredit}</p>}</div>
        })}</div>
        <p className="sources-note">3D 卷轴用于解释形制；{byId.buddha.modelUrl ? '坐佛数字重建依据馆藏照片制作。' : '坐佛当前展示馆藏照片。'}诗性文案为展览创作，文物资料以收藏机构记录为准。</p>
        <div className="sources-bottom"><span>敦煌有信 · iDUNHUANG · 2026</span><a href="#top">回到序章 ↑</a></div>
      </div>
    </footer>
    <Reader dialogRef={dialogRef} />
  </div>
}

export default App
