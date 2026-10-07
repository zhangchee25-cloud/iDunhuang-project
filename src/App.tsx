import { lazy, Suspense, useMemo, useRef, useState, type RefObject } from 'react'
import { byId, conversations, exhibits, type ExhibitId } from './data'
import { Entrance } from './Homepage'

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

function ExhibitCard({ id, onDialogue }: { id: ExhibitId; onDialogue: (id: ExhibitId) => void }) {
  const item = byId[id]
  return (
    <article className={`exhibit-card exhibit-${id}`} id={`exhibit-${id}`}>
      <div className="exhibit-visual">
        <img src={item.image} alt={item.imageAlt} loading="lazy" />
        <span className="visual-index">{item.index} / {item.city}</span>
        {item.imageIsInterpretation && <span className="visual-caveat">艺术示意 · 非原件照片</span>}
      </div>
      <div className="exhibit-copy">
        <div className="card-overline"><span>{item.city}</span><span>{item.shelfmark}</span></div>
        <h3>{item.name}</h3>
        <p className="latin-name">{item.english}</p>
        <p className="exhibit-summary">{item.summary}</p>
        <p className="exhibit-detail">{item.detail}</p>
        <div className="exhibit-facts"><span>{item.period}</span><span>{item.material}</span><span>{item.institution}</span></div>
        <div className="card-actions">
          <button type="button" onClick={() => onDialogue(id)}>与它对话 <span aria-hidden="true">↗</span></button>
          <a href={item.sourceUrl} target="_blank" rel="noreferrer">馆藏原页 ↗</a>
        </div>
      </div>
    </article>
  )
}

function ConversationSection({ selected, onSelect }: { selected: ExhibitId; onSelect: (id: ExhibitId) => void }) {
  const questions = useMemo(() => conversations.filter((item) => item.exhibit === selected), [selected])
  const [activeIds, setActiveIds] = useState<Record<ExhibitId, string>>({
    diamond: 'diamond-date',
    pipa: 'pipa-location',
    buddha: 'buddha-origin',
  })
  const active = questions.find((item) => item.id === activeIds[selected]) ?? questions[0]

  return (
    <section className="dialogue-section" id="dialogue" aria-labelledby="dialogue-title">
      <div className="dialogue-inner page-width">
        <div className="section-kicker light">04 / 策展式对话</div>
        <div className="dialogue-head">
          <div>
            <h2 id="dialogue-title">如果文物会回答</h2>
            <p>从馆藏资料出发，选一个问题，听它讲述可查证的故事。</p>
          </div>
          <span className="dialogue-ornament" aria-hidden="true">“</span>
        </div>
        <div className="dialogue-layout">
          <div className="dialogue-selector">
            <span className="small-label">选择展品</span>
            <div className="artifact-options">
              {exhibits.map((item) => (
                <button type="button" key={item.id} className={selected === item.id ? 'selected' : ''} aria-pressed={selected === item.id} onClick={() => onSelect(item.id)}>
                  <span>{item.index}</span><strong>{item.name}</strong><small>{item.city}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="dialogue-card">
            <div className="answer-topline"><span>与 {byId[selected].name} 对话</span><span>馆藏资料整理</span></div>
            <div className="question-list" aria-label="可提的问题">
              {questions.map((item) => (
                <button type="button" key={item.id} className={active.id === item.id ? 'selected' : ''} aria-pressed={active.id === item.id} onClick={() => setActiveIds((previous) => ({ ...previous, [selected]: item.id }))}>
                  {item.question}
                </button>
              ))}
            </div>
            <div className="answer-box" aria-live="polite">
              <span className="answer-mark">答 /</span>
              <p>{active.answer}</p>
              <a href={active.sourceUrl} target="_blank" rel="noreferrer">查证来源 · {active.sourceLabel} ↗</a>
            </div>
            <div className="dialogue-boundary">这里展示的是经核对的固定问答。若有更多疑问，请打开 <a href={byId[selected].sourceUrl} target="_blank" rel="noreferrer">馆藏原页</a> 继续探索。</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selectedExhibit, setSelectedExhibit] = useState<ExhibitId>('diamond')
  const [entered, setEntered] = useState(() => window.location.hash.length > 1)

  const enterExhibition = (target = 'top') => {
    setEntered(true)
    window.requestAnimationFrame(() => {
      const destination = document.getElementById(target)
      if (target === 'top') window.scrollTo({ top: 0, behavior: 'instant' })
      else destination?.scrollIntoView({ behavior: 'instant', block: 'start' })
      if (destination) {
        destination.setAttribute('tabindex', '-1')
        destination.focus({ preventScroll: true })
      }
    })
  }

  const openDialogue = (id: ExhibitId) => {
    setSelectedExhibit(id)
    document.getElementById('dialogue')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!entered) return <Entrance onEnter={enterExhibition} />

  return (
    <>
      <header className="site-header">
        <div className="page-width header-inner">
          <a className="brand" href="#top" aria-label="敦煌有信，返回顶部"><span className="brand-mark">敦</span><span>敦煌有信<small>iDUNHUANG</small></span></a>
          <nav aria-label="主导航">
            <a href="#journey">数字旅程</a>
            <a href="#collection">三件展品</a>
            <a href="#dialogue">与文物对话</a>
            <a href="#sources">资料来源</a>
          </nav>
          <span className="header-edition">数字文化遗产 · 2026</span>
        </div>
      </header>

      <main id="top" tabIndex={-1}>
        <section className="hero">
          <div className="hero-grain" aria-hidden="true" />
          <div className="page-width hero-grid">
            <div className="hero-copy">
              <span className="hero-eyebrow"><i /> FROM DUNHUANG TO THE WORLD</span>
              <h1>纵横欧亚，<br /><em>寻脉敦煌。</em></h1>
              <div className="hero-rule" />
              <p>一卷经文、一页乐谱、一尊木雕。沿着敦煌、伦敦与巴黎之间的线索，重新走近文物与遗书。</p>
              <div className="hero-actions">
                <a className="primary-link" href="#collection">走近展品 <span aria-hidden="true">↗</span></a>
                <a className="quiet-link" href="#journey">查看数字旅程 <span aria-hidden="true">↓</span></a>
              </div>
              <div className="hero-footnote"><span>01 / 03</span><span>敦煌文物与遗书数字展</span></div>
            </div>
            <div className="hero-art">
              <div className="art-topline"><span>馆藏聚焦 / OR.8210/P.2</span><span>3D 数字展示</span></div>
              <Suspense fallback={<div className="scene-loading">正在展开卷轴…</div>}>
                <ScrollScene onOpenReader={() => dialogRef.current?.showModal()} />
              </Suspense>
            </div>
          </div>
          <div className="hero-bottomline page-width"><span>丝路遗珍 · 数字相逢</span><span>向下继续探索 <span aria-hidden="true">↓</span></span></div>
        </section>

        <section className="journey-section" id="journey" aria-labelledby="journey-title">
          <div className="page-width">
            <div className="section-kicker">01 / 跨越山海</div>
            <div className="section-heading"><h2 id="journey-title">从敦煌出发，<br />在数字空间重逢。</h2><p>这些文物现藏于不同机构。数字化让我们能够并置观看它们，也让每一件展品的来源与现状更加清晰。</p></div>
            <div className="route" aria-label="敦煌、伦敦、巴黎三地路线">
              <div className="route-line" aria-hidden="true" />
              <div className="route-stop origin"><span className="route-dot" /><span className="route-number">01</span><strong>敦煌</strong><small>莫高窟 · 第 17 窟</small></div>
              <div className="route-stop"><span className="route-dot" /><span className="route-number">02</span><strong>伦敦</strong><small>《金刚经》 / 木雕坐佛</small></div>
              <div className="route-stop"><span className="route-dot" /><span className="route-number">03</span><strong>巴黎</strong><small>敦煌琵琶谱 P.3808</small></div>
            </div>
          </div>
        </section>

        <section className="collection-section" id="collection" aria-labelledby="collection-title">
          <div className="page-width">
            <div className="section-kicker">02 / 馆藏精选</div>
            <div className="collection-heading"><h2 id="collection-title">三件展品，<br />三种观看方式。</h2><p>图像、文字与可交互模型相互补充。每一件展品都标明馆藏编号，方便回到原始资料。</p></div>
            <div className="collection-list">
              <ExhibitCard id="diamond" onDialogue={openDialogue} />
              <ExhibitCard id="pipa" onDialogue={openDialogue} />
              <ExhibitCard id="buddha" onDialogue={openDialogue} />
            </div>
          </div>
        </section>

        <section className="bridge-section" aria-labelledby="bridge-title">
          <div className="page-width bridge-inner">
            <span className="section-kicker">03 / 数字化的意义</span>
            <h2 id="bridge-title">看得见的细节，<br /><em>才有继续追问的可能。</em></h2>
            <p>高分辨率图像让纸张、笔迹与雕版线条得以被反复观察；清楚的馆藏记录，让一次浏览成为进一步研究的起点。</p>
            <a href="#dialogue">向展品提问 <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <ConversationSection selected={selectedExhibit} onSelect={setSelectedExhibit} />
      </main>

      <footer className="site-footer" id="sources">
        <div className="page-width">
          <div className="footer-top"><div><span className="footer-brand">敦煌有信</span><p>聚焦海外敦煌文物与遗书的数字化传播。<br />为支队宣传展示制作的非商业教育演示。</p></div><a href="#top">回到顶部 ↑</a></div>
          <div className="footer-columns">
            <div><h3>馆藏与资料</h3>{exhibits.map((item) => <a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer">{item.institution} · {item.shelfmark} ↗</a>)}</div>
            <div><h3>图像与使用说明</h3>{exhibits.map((item) => <p key={item.id}><strong>{item.name}</strong>：{item.imageCredit}。<a href={item.imageRightsUrl} target="_blank" rel="noreferrer">{item.imageRights} ↗</a></p>)}</div>
          </div>
          <div className="footer-bottom"><span>iDUNHUANG · 2026</span><span>文物信息以原收藏机构最新记录为准。</span></div>
        </div>
      </footer>

      <Reader dialogRef={dialogRef} />
    </>
  )
}

export default App
