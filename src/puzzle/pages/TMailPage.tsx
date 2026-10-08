import { useEffect, useState } from "react"
import { PUZZLE_ANSWER } from "../data/puzzleAnswer"
import { MAIL_DATA } from "../data/mailData"
import { GAME_TEXT } from "../data/gameText"
import { gameStore } from "../stores/gameStore"
import SearchPage from "./SearchPage"
import "./tmail.css"

const TM_LOGIN_KEY = "puzzle_tmail_loggedin"

type MailId = "mail1" | "mail2" | "mail3"

const META: Record<MailId, { subject: string; from: string; content: string }> = MAIL_DATA

export default function TMailPage({ onBack }: { onBack: () => void }) {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem(TM_LOGIN_KEY) === "1")
  const [activeMail, setActiveMail] = useState<MailId | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [flash, setFlash] = useState("")
  const [mailVersion, setMailVersion] = useState(0)

  const state = gameStore.get()

  const unlockedMails: MailId[] = ["mail1"]
  if (state.hasMail2) unlockedMails.push("mail2")
  if (state.hasMail3) unlockedMails.push("mail3")

  useEffect(() => {
    const handle = () => setMailVersion((value) => value + 1)
    window.addEventListener("puzzle-mail-refresh", handle)
    return () => window.removeEventListener("puzzle-mail-refresh", handle)
  }, [])

  void mailVersion

  const login = () => {
    if (account.trim().toLowerCase() === PUZZLE_ANSWER.wuliuMailAccount.toLowerCase() && password === PUZZLE_ANSWER.wuliuMailPwd) {
      setError("")
      localStorage.setItem(TM_LOGIN_KEY, "1")
      setLoggedIn(true)
    } else {
      setError("账号或密码错误")
    }
  }

  const openMail = (id: MailId) => {
    setActiveMail(id)
    setSearchOpen(false)
  }

  const openSearch = () => {
    setSearchOpen(true)
    setActiveMail(null)
  }

  const handleSolved = () => {
    gameStore.set({ hasMail2: true })
    setSearchOpen(false)
    setActiveMail(null)
    setMailVersion((value) => value + 1)
    showFlash(GAME_TEXT.redAlertStage2)
  }

  const showFlash = (text: string) => {
    setFlash(text)
    window.setTimeout(() => setFlash(""), 1800)
  }

  if (!loggedIn) {
    return (
      <div className="tmail-page">
        <header className="tmail-topbar">
          <button className="tmail-back" type="button" onClick={onBack}>← 桌面</button>
          <span className="tmail-title">TMail</span>
          <span className="tmail-avatar">✉️</span>
        </header>
        <div className="tmail-login">
          <div className="tmail-login-card">
            <div className="tmail-login-logo">✉️</div>
            <h1>TMail</h1>
            <p className="tmail-login-hint">青蛙大学邮箱登录</p>
            <label>
              <span>账号</span>
              <input type="text" value={account} onChange={(event) => setAccount(event.target.value)} placeholder="邮箱账号" />
            </label>
            <label>
              <span>密码</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="密码" />
            </label>
            {error && <p className="tmail-error">{error}</p>}
            <button className="tmail-login-btn" type="button" onClick={login}>登录</button>
          </div>
        </div>
      </div>
    )
  }

  if (searchOpen) {
    return <SearchPage onBack={() => { setSearchOpen(false); setActiveMail(null) }} onSolved={handleSolved} />
  }

  const active = activeMail ? META[activeMail] : null

  return (
    <div className="tmail-page">
      <header className="tmail-topbar">
        <button className="tmail-back" type="button" onClick={onBack}>← 桌面</button>
        <span className="tmail-title">TMail · 收件箱</span>
        <button className="tmail-logout" type="button" onClick={() => { localStorage.removeItem(TM_LOGIN_KEY); setLoggedIn(false) }}>退出</button>
      </header>
      <div className="tmail-layout">
        <aside className="tmail-inbox">
          <div className="tmail-inbox-title">收件箱</div>
          {unlockedMails.map((id) => (
            <button key={id} type="button" className={`tmail-mail-item ${activeMail === id ? "is-active" : ""}`} onClick={() => openMail(id)}>
              <span className="tmail-mail-dot" aria-hidden="true" />
              <span className="tmail-mail-main">
                <strong>{META[id].from}</strong>
                <small>{META[id].subject}</small>
              </span>
            </button>
          ))}
        </aside>
        <main className="tmail-reader">
          {active ? (
            <article className="tmail-mail">
              <div className="tmail-mail-head">
                <h2>{active.subject}</h2>
                <span>发件人：{active.from}</span>
              </div>
              <div className="tmail-mail-body" dangerouslySetInnerHTML={{ __html: active.content.replace(/\n/g, "<br />") }} />
              {activeMail === "mail1" && (
                <button className="tmail-search-link" type="button" onClick={openSearch}>检索页面 ↗</button>
              )}
              {activeMail === "mail3" && (
                <button className="tmail-attachment" type="button" aria-label="附件">
                  <span className="tmail-attachment-mark" aria-hidden="true">📎</span>
                  <span>{"Youdon'tneedtounderstandFrenchatall.docx"}</span>
                </button>
              )}
            </article>
          ) : (
            <div className="tmail-empty">选择一封邮件查看</div>
          )}
        </main>
      </div>

      {flash && <div className="tmail-flash" role="alert">{flash}</div>}
    </div>
  )
}
