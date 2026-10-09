import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

// Keep one parsed asset; each canvas receives its own scene transforms.
const assets = new Map<string, Promise<THREE.Group>>()

function loadModel(url: string) {
  let pending = assets.get(url)
  if (!pending) {
    pending = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(url).then(({ scene }) => scene)
    assets.set(url, pending)
    pending.catch(() => assets.delete(url))
  }
  return pending
}

type Props = {
  url: string
  mode: 'hero' | 'viewer'
  resetToken?: number
  rotationY?: number
  onState: (state: 'ready' | 'fallback') => void
}

export function BuddhaModel({ url, mode, resetToken = 0, rotationY = 0, onState }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const resetRef = useRef<(() => void) | null>(null)
  const stateRef = useRef(onState)
  stateRef.current = onState

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      stateRef.current('fallback')
      return
    }
    let cancelled = false
    let ready = false
    let reportedReady = false
    let visible = false
    let frame = 0
    let failed = false
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, .01, 100)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    mount.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('role', 'img')
    renderer.domElement.setAttribute('aria-label', mode === 'hero' ? '随滚动从特写拉远的木雕坐佛数字重建' : '可旋转与缩放的木雕坐佛数字重建')
    scene.add(new THREE.HemisphereLight(0xffedcf, 0x30241c, 2))
    const light = new THREE.DirectionalLight(0xffe2b7, 2.4)
    light.position.set(-3, 4, 5)
    scene.add(light)
    const fill = new THREE.DirectionalLight(0xb9c8cf, .75)
    fill.position.set(3, 1, -2)
    scene.add(fill)

    const controls = mode === 'viewer' ? new OrbitControls(camera, renderer.domElement) : null
    if (controls) {
      controls.enablePan = false
      controls.minDistance = 1.8
      controls.maxDistance = 8
      controls.minPolarAngle = .2
      controls.maxPolarAngle = Math.PI * .85
    }
    const stage = mount.closest<HTMLElement>('.dh-stage')
    let depth = .5
    const render = () => {
      frame = 0
      if (!ready || !visible || failed || cancelled) return
      if (mode === 'hero' && stage) {
        const style = getComputedStyle(stage)
        const ease = Number(style.getPropertyValue('--camera')) || 0
        const mobile = mount.clientWidth <= 680
        const scale = 5.4 - ease * 4.4
        // Narrow screens need extra room in the final shot for the full lotus
        // base; keep the opening close-up unchanged.
        const fraction = (mobile ? .77 - .18 * ease : .97) * scale
        // Account for the object's front-to-back depth so the final pose fits
        // the same photo framing instead of clipping the crown and lotus base.
        const distance = Math.max(depth + .12, 1 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * fraction)) + depth * ease
        const viewHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
        const x = mobile ? .50 + ease * .05 : .51 + ease * .24
        const y = mobile ? .3225 + .1925 * scale : .2875 + .2425 * scale
        camera.position.set(-viewHeight * camera.aspect * (x - .5), viewHeight * (y - .5), distance)
        camera.lookAt(camera.position.x, camera.position.y, 0)
      }
      renderer.render(scene, camera)
      // The photo remains visible until the actual first frame is drawn.
      if (!reportedReady) {
        reportedReady = true
        stateRef.current('ready')
      }
    }
    const schedule = () => { if (!frame && !cancelled) frame = requestAnimationFrame(render) }
    const reset = () => {
      camera.position.set(0, .08, 4.1)
      controls?.target.set(0, 0, 0)
      controls?.update()
      schedule()
    }
    resetRef.current = reset
    reset()
    controls?.addEventListener('change', schedule)
    stage?.addEventListener('camera-progress', schedule)
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      schedule()
    }
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(mount)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
    })
    visibilityObserver.observe(mount)
    const fail = () => {
      failed = true
      stateRef.current('fallback')
    }
    const onContextLost = (event: Event) => { event.preventDefault(); fail() }
    renderer.domElement.addEventListener('webglcontextlost', onContextLost)
    resize()
    loadModel(url).then((asset) => {
      if (cancelled || failed) return
      const object = clone(asset)
      const bounds = new THREE.Box3().setFromObject(object)
      const size = bounds.getSize(new THREE.Vector3())
      if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('模型没有可显示的几何体')
      const center = bounds.getCenter(new THREE.Vector3())
      const normalised = new THREE.Group()
      object.position.sub(center)
      normalised.add(object)
      normalised.scale.setScalar(2 / size.y)
      normalised.rotation.y = rotationY
      depth = new THREE.Box3().setFromObject(normalised).getSize(new THREE.Vector3()).z / 2
      scene.add(normalised)
      ready = true
      schedule()
    }).catch(() => { if (!cancelled) fail() })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      sizeObserver.disconnect()
      visibilityObserver.disconnect()
      stage?.removeEventListener('camera-progress', schedule)
      controls?.removeEventListener('change', schedule)
      controls?.dispose()
      resetRef.current = null
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      renderer.dispose()
      renderer.domElement.remove()
      // Geometry and textures belong to the shared asset cache, not this canvas.
    }
  }, [url, mode, rotationY])

  useEffect(() => { resetRef.current?.() }, [resetToken])
  return <div className={`buddha-model buddha-model-${mode}`} ref={mountRef} />
}
