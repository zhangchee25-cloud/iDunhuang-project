import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

type Hotspot = {
  title: string
  detail: string
  position: [number, number, number]
}

const hotspots: Hotspot[] = [
  {
    title: '卷首版画',
    detail: '卷首先以雕版印出的画面展开。点击下方“展开细看”可查看馆藏原图。',
    position: [0.78, 0.55, 0.1],
  },
  {
    title: '雕版经文',
    detail: '图像之后连接经文。整件卷轴由多张纸接成，原件长度接近五米。',
    position: [-0.92, -0.24, 0.1],
  },
  {
    title: '卷轴装裱',
    detail: '两端卷杆帮助横卷收放。眼前模型只用于解释卷轴形制，并非原件三维扫描。',
    position: [2.18, 0.12, 0.2],
  },
]

function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = path
  })
}

function createPaperTexture(): { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const context = canvas.getContext('2d')!
  context.fillStyle = '#cbb58d'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // A restrained paper texture, drawn locally so the model works offline.
  for (let i = 0; i < 2400; i += 1) {
    const x = (i * 1193) % canvas.width
    const y = (i * 659) % canvas.height
    context.fillStyle = i % 3 === 0 ? 'rgba(73, 46, 23, .055)' : 'rgba(255, 243, 211, .10)'
    context.fillRect(x, y, 2 + (i % 6), 1 + (i % 3))
  }
  context.strokeStyle = 'rgba(99, 68, 37, .16)'
  context.lineWidth = 4
  context.strokeRect(44, 45, 1960, 934)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { canvas, texture }
}

export function ScrollScene({ onOpenReader }: { onOpenReader: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [mode, setMode] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      setMode('fallback')
      return
    }

    let cancelled = false
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0.38, 0.26, 6.4)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    mount.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-label', '可旋转和缩放的《金刚经》卷轴数字展示示意')
    const onContextLost = (event: Event) => {
      event.preventDefault()
      setMode('fallback')
    }
    renderer.domElement.addEventListener('webglcontextlost', onContextLost)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 4.8
    controls.maxDistance = 8.7
    controls.minPolarAngle = Math.PI * 0.28
    controls.maxPolarAngle = Math.PI * 0.72
    controls.minAzimuthAngle = -Math.PI * 0.33
    controls.maxAzimuthAngle = Math.PI * 0.33

    scene.add(new THREE.AmbientLight(0xf3e1c5, 2.2))
    const warmLight = new THREE.DirectionalLight(0xffe6b9, 3.2)
    warmLight.position.set(-2, 4, 5)
    scene.add(warmLight)
    const coolLight = new THREE.DirectionalLight(0x829db5, 1.2)
    coolLight.position.set(3, -1, -2)
    scene.add(coolLight)

    const scroll = new THREE.Group()
    scroll.rotation.y = -0.08
    scroll.rotation.x = -0.04
    scene.add(scroll)

    const paper = createPaperTexture()
    const geometry = new THREE.PlaneGeometry(4.2, 2.2, 40, 4)
    const positions = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i)
      const edge = Math.pow(Math.abs(x) / 2.1, 6)
      positions.setZ(i, -0.035 + edge * 0.19)
    }
    geometry.computeVertexNormals()
    const sheet = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ map: paper.texture, side: THREE.DoubleSide, roughness: 0.94 }),
    )
    scroll.add(sheet)

    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x795b3c, roughness: 0.82 })
    const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x4c3025, roughness: 0.5, metalness: 0.08 })
    const capMaterial = new THREE.MeshStandardMaterial({ color: 0xb39156, roughness: 0.42, metalness: 0.38 })
    for (const x of [-2.12, 2.12]) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 2.58, 32), rodMaterial)
      rod.position.set(x, 0, 0.1)
      scroll.add(rod)
      for (const y of [-1.33, 1.33]) {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.11, 32), capMaterial)
        cap.position.set(x, y, 0.1)
        scroll.add(cap)
      }
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.22, 10), edgeMaterial)
      rim.position.set(x > 0 ? 2.02 : -2.02, 0, 0.17)
      scroll.add(rim)
    }

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    Promise.all([
      loadImage('/assets/diamond-frontispiece.jpg'),
      loadImage('/assets/diamond-text.jpg'),
    ]).then(([frontispiece, text]) => {
      if (cancelled) return
      const context = paper.canvas.getContext('2d')!
      // Remove the black photographic borders while preserving the real printed details.
      context.drawImage(text, 45, 175, text.width - 120, text.height - 330, 85, 95, 950, 834)
      context.drawImage(frontispiece, 165, 165, frontispiece.width - 310, frontispiece.height - 300, 1074, 95, 890, 834)
      paper.texture.needsUpdate = true
      setMode('ready')
    }).catch(() => {
      if (!cancelled) setMode('ready')
    })

    let frame = 0
    const worldPosition = new THREE.Vector3()
    const animate = () => {
      frame = requestAnimationFrame(animate)
      controls.update()
      scroll.updateWorldMatrix(true, false)
      for (let i = 0; i < hotspots.length; i += 1) {
        const element = hotspotRefs.current[i]
        if (!element) continue
        worldPosition.set(...hotspots[i].position)
        scroll.localToWorld(worldPosition)
        worldPosition.project(camera)
        element.style.left = `${(worldPosition.x * 0.5 + 0.5) * 100}%`
        element.style.top = `${(-worldPosition.y * 0.5 + 0.5) * 100}%`
        element.style.visibility = worldPosition.z < 1 ? 'visible' : 'hidden'
      }
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      geometry.dispose()
      paper.texture.dispose()
      edgeMaterial.dispose()
      rodMaterial.dispose()
      capMaterial.dispose()
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div className="scroll-experience">
      <div className="scroll-stage">
        {mode === 'fallback' ? (
          <div className="scroll-fallback">
            <img src="/assets/diamond-frontispiece.jpg" alt="《金刚经》卷首版画" />
            <span>当前设备显示平面图像</span>
          </div>
        ) : (
          <>
            <div className="webgl-mount" ref={mountRef} />
            {mode === 'loading' && <div className="scene-loading">正在展开卷轴…</div>}
            {mode === 'ready' && hotspots.map((hotspot, index) => (
              <button
                className={`hotspot ${active === index ? 'is-active' : ''}`}
                key={hotspot.title}
                ref={(element) => { hotspotRefs.current[index] = element }}
                type="button"
                aria-label={`查看热点：${hotspot.title}`}
                onClick={() => setActive(active === index ? null : index)}
              >
                {index + 1}
              </button>
            ))}
          </>
        )}
        {active !== null && mode === 'ready' && (
          <div className="hotspot-note" role="status">
            <button type="button" aria-label="关闭热点说明" onClick={() => setActive(null)}>×</button>
            <strong>{hotspots[active].title}</strong>
            <p>{hotspots[active].detail}</p>
          </div>
        )}
      </div>
      <div className="scene-toolbar">
        <span className="scene-hint">拖动旋转 · 滚轮缩放 · 点击光点</span>
        <button type="button" onClick={onOpenReader}>展开细看 <span aria-hidden="true">↗</span></button>
      </div>
      <p className="scene-disclaimer">3D 卷轴为数字展示示意；画面使用《金刚经》馆藏图像局部，并非原件三维扫描。</p>
    </div>
  )
}
