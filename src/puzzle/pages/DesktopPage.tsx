import { useEffect, useRef, useState } from "react"
import { gameStore } from "../stores/gameStore"
import MeChatPage from "./MeChatPage"
import TMailPage from "./TMailPage"
import QingXiaoDaPage from "./QingXiaoDaPage"
import SafeBoxPage from "./SafeBoxPage"
import DiskPage from "./DiskPage"
import "../styles/desktop.css"

type AppId = "mechat" | "tmail" | "qingxiaoda" | "notepad"

type WindowMeta = {
  id: AppId
  x: number
  y: number
  z: number
  minimized: boolean
}

const APPS: { id: AppId; name: string; icon: string }[] = [
  { id: "mechat", name: "MeChat", icon: "💬" },
  { id: "tmail", name: "TMail", icon: "✉️" },
  { id: "qingxiaoda", name: "青小搭", icon: "🐸" },
  { id: "notepad", name: "记事本", icon: "📝" },
]

const WINDOW_SIZE: Record<AppId, { width: number; height: number }> = {
  mechat: { width: 380, height: 540 },
  tmail: { width: 600, height: 460 },
  qingxiaoda: { width: 460, height: 560 },
  notepad: { width: 540, height: 440 },
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function DesktopPage({ onBack }: { onBack: () => void }) {
  const [windows, setWindows] = useState<WindowMeta[]>([])
  const [activeId, setActiveId] = useState<AppId | null>(null)
  const [note, setNote] = useState("")
  const [mechatOpen, setMechatOpen] = useState(false)
  const [tmailOpen, setTmailOpen] = useState(false)
  const [qingxiaodaOpen, setQingXiaoDaOpen] = useState(false)
  const [safeBoxOpen, setSafeBoxOpen] = useState(false)
  const [diskOpen, setDiskOpen] = useState(false)
  const zCounter = useRef(10)
  const dragRef = useRef<{ id: AppId; offsetX: number; offsetY: number } | null>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNote(gameStore.get().noteContent)
  }, [])

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash
      if (hash === "#safeBox") {
        setSafeBoxOpen(true)
        setDiskOpen(false)
      }
      if (hash === "#disk") {
        setDiskOpen(true)
        setSafeBoxOpen(false)
      }
      if (hash === "") {
        setSafeBoxOpen(false)
        setDiskOpen(false)
      }
    }
    onHash()
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  useEffect(() => {
    const move = (event: MouseEvent) => {
      const drag = dragRef.current
      if (!drag || !desktopRef.current) return
      const rect = desktopRef.current.getBoundingClientRect()
      const x = clamp(event.clientX - rect.left - drag.offsetX, 0, Math.max(0, rect.width - 140))
      const y = clamp(event.clientY - rect.top - drag.offsetY, 0, Math.max(0, rect.height - 70))
      setWindows((list) => list.map((win) => (win.id === drag.id ? { ...win, x, y } : win)))
    }
    const up = () => { dragRef.current = null }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [])

  const bringToFront = (id: AppId) => {
    setActiveId(id)
    zCounter.current += 1
    setWindows((list) => list.map((win) => (win.id === id ? { ...win, z: zCounter.current } : win)))
  }

  const openApp = (id: AppId) => {
    const exists = windows.some((win) => win.id === id)
    if (exists) {
      setWindows((list) => list.map((win) => (win.id === id ? { ...win, minimized: false } : win)))
      bringToFront(id)
      return
    }
    setWindows((list) => {
      const base = 70 + list.length * 26
      return [...list, { id, x: base, y: base + 20, z: 1, minimized: false }]
    })
    bringToFront(id)
  }

  const minimize = (id: AppId) => setWindows((list) => list.map((win) => (win.id === id ? { ...win, minimized: true } : win)))
  const close = (id: AppId) => {
    setWindows((list) => list.filter((win) => win.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const onNoteChange = (value: string) => {
    setNote(value)
    gameStore.set({ noteContent: value })
  }

  const closeSafeBox = () => {
    setSafeBoxOpen(false)
    if (window.location.hash === "#safeBox") window.location.hash = ""
  }

  const closeDisk = () => {
    setDiskOpen(false)
    if (window.location.hash === "#disk") window.location.hash = ""
  }

  // safeBox/disk from MeChat hash navigation take priority over app views
  if (safeBoxOpen) return <SafeBoxPage onBack={closeSafeBox} />
  if (diskOpen) return <DiskPage onBack={closeDisk} />
  if (mechatOpen) return <MeChatPage onBack={() => setMechatOpen(false)} />
  if (tmailOpen) return <TMailPage onBack={() => setTmailOpen(false)} />
  if (qingxiaodaOpen) return <QingXiaoDaPage onBack={() => setQingXiaoDaOpen(false)} />

  return (
    <div className="desktop-page" ref={desktopRef}>
      <div className="desktop-topbar">
        <span className="desktop-logo">iDUNHUANG · 网页解密</span>
        <button className="desktop-back" type="button" onClick={onBack}>返回主站 ←</button>
      </div>

      <div className="desktop-icons">
        {APPS.map((app) => (
          <button
            key={app.id}
            className={`desktop-icon ${activeId === app.id ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveId(app.id)}
            onDoubleClick={() => openApp(app.id)}
          >
            <span className="desktop-icon-symbol" aria-hidden="true">{app.icon}</span>
            <span className="desktop-icon-name">{app.name}</span>
          </button>
        ))}
      </div>

      {windows.map((win) => {
        const app = APPS.find((item) => item.id === win.id)!
        const size = WINDOW_SIZE[win.id]
        return (
          <section
            key={win.id}
            className={`desktop-window ${win.minimized ? "is-minimized" : ""} ${activeId === win.id ? "is-active" : ""}`}
            style={{ left: win.x, top: win.y, width: size.width, height: size.height, zIndex: win.z }}
            onMouseDown={() => bringToFront(win.id)}
          >
            <header
              className="desktop-window-bar"
              onMouseDown={(event) => {
                if ((event.target as HTMLElement).closest("button")) return
                dragRef.current = { id: win.id, offsetX: event.clientX - win.x, offsetY: event.clientY - win.y }
              }}
            >
              <span className="desktop-window-title">{app.icon} {app.name}</span>
              <span className="desktop-window-controls">
                <button type="button" aria-label="最小化" onClick={() => minimize(win.id)}>—</button>
                <button type="button" aria-label="关闭" onClick={() => close(win.id)}>×</button>
              </span>
            </header>
            <div className="desktop-window-body">
              {win.id === "mechat" ? (
                <button className="desktop-app-entry" type="button" onClick={() => setMechatOpen(true)}>打开 MeChat</button>
              ) : win.id === "tmail" ? (
                <button className="desktop-app-entry" type="button" onClick={() => setTmailOpen(true)}>打开 TMail</button>
              ) : win.id === "qingxiaoda" ? (
                <button className="desktop-app-entry" type="button" onClick={() => setQingXiaoDaOpen(true)}>打开 青小搭</button>
              ) : win.id === "notepad" ? (
                <textarea
                  className="desktop-notepad"
                  value={note}
                  onChange={(event) => onNoteChange(event.target.value)}
                  placeholder="在这里记点什么…"
                  spellCheck={false}
                />
              ) : (
                <div className="desktop-locked">
                  <span className="desktop-locked-icon">{app.icon}</span>
                  <strong>{app.name}</strong>
                  <p>功能待解锁</p>
                </div>
              )}
            </div>
          </section>
        )
      })}

      <div className="desktop-taskbar">
        {windows.filter((win) => win.minimized).map((win) => {
          const app = APPS.find((item) => item.id === win.id)!
          return (
            <button key={win.id} type="button" onClick={() => { openApp(win.id); bringToFront(win.id) }}>
              {app.icon} {app.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
