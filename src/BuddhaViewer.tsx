import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { byId } from './data'

const BuddhaModel = lazy(() => import('./BuddhaModel').then((module) => ({ default: module.BuddhaModel })))

export function BuddhaViewer() {
  const item = byId.buddha
  const container = useRef<HTMLDivElement>(null)
  const [nearby, setNearby] = useState(false)
  const [view, setView] = useState<'model' | 'photo'>(item.modelUrl ? 'model' : 'photo')
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [resetToken, setResetToken] = useState(0)
  useEffect(() => {
    if (!container.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '300px' })
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  return <div className="buddha-viewer" ref={container}>
    <div className="buddha-viewer-stage">
      <img src={item.image} alt={item.imageAlt} loading="lazy" className={view === 'model' && state === 'ready' ? 'is-hidden' : ''} />
      {item.modelUrl && nearby && view === 'model' && state !== 'fallback' && <Suspense fallback={null}>
        <BuddhaModel url={item.modelUrl} mode="viewer" rotationY={item.modelRotationY} resetToken={resetToken} onState={setState} />
      </Suspense>}
      {item.modelUrl && nearby && view === 'model' && state === 'loading' && <span className="model-status" role="status">正在载入数字重建…</span>}
    </div>
    <div className="buddha-viewer-controls">
      <span>{view === 'model' && state === 'ready' ? '拖动旋转 · 滚轮或双指缩放' : '馆藏照片 · MAS.853'}</span>
      {item.modelUrl && state !== 'fallback' && <div>
        <button type="button" aria-pressed={view === 'model'} onClick={() => { if (view !== 'model') { setState('loading'); setView('model') } }}>3D 重建</button>
        <button type="button" aria-pressed={view === 'photo'} onClick={() => setView('photo')}>查看原图</button>
        <button type="button" disabled={view !== 'model' || state !== 'ready'} onClick={() => setResetToken((previous) => previous + 1)}>复位</button>
      </div>}
    </div>
    {item.modelUrl && view === 'model' && state === 'ready' && <p className="media-note">{item.modelDescription}。{item.modelNote}</p>}
    {item.modelUrl && state === 'fallback' && <p className="media-note" role="status">当前显示馆藏照片，仍可阅读展品资料。</p>}
  </div>
}
