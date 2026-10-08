import { useEffect, useRef, useState } from "react"
import { PUZZLE_ANSWER } from "../data/puzzleAnswer"
import { RELIC_DATA } from "../data/relicData"
import { GAME_TEXT } from "../data/gameText"
import { gameStore } from "../stores/gameStore"
import "./qingxiaoda.css"

const XIAODA_UK_KEY = "puzzle_xiaoda_uk"
const XIAODA_FR_KEY = "puzzle_xiaoda_france"

const UK_INTRO = `你好，我是「英国现藏敦煌文物」智能体。\
我代表的是收藏于英国各机构的敦煌文物与遗书。\
英国图书馆、大英博物馆等机构保存了大量敦煌藏经洞出土文献与器物。\
经过数字化整理，这些文物可以在线查看高清图像和馆藏记录。\
请直接选择下方文物中文名 / 英文名来问我吧。`

const FR_INTRO = `你好，我是「法国现藏敦煌文物」智能体。\
我代表的是收藏于法国各机构的敦煌文物与遗书。\
法国国家图书馆保存了大量敦煌写卷与文献。\
数字化让这些文物可以在线查看高清图像和馆藏记录。\
<strong>我最了解敦煌琵琶谱了</strong>`

const replaceHide = (text: string) =>
  text.replace(/【HIDE([^】]+)】/g, "<span class=\"hide-text\">$1</span>")

type Phase = "login" | "chat" | "france"

export default function QingXiaoDaPage({ onBack }: { onBack: () => void }) {
  const initPhase = (): Phase => {
    const s = gameStore.get()
    if (localStorage.getItem(XIAODA_FR_KEY)) return "france"
    if (s.hasMail3) return "login"
    if (s.hasMail2) return "chat"
    return "login"
  }
  const [phase, setPhase] = useState<Phase>(initPhase)
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [messages, setMessages] = useState<{ role: "bot" | "user"; html: string }[]>([])
  const [candidates, setCandidates] = useState<string[]>(["《金刚经》卷轴", "唐代胡羊焖饼"])
  const [franceInput, setFranceInput] = useState("")
  const permitTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const pushBot = (html: string) => setMessages((list) => [...list, { role: "bot", html }])

  useEffect(() => {
    if (phase === "chat" && messages.length === 0) pushBot(UK_INTRO.replace(/\n/g, "<br />"))
    if (phase === "france" && messages.length === 0) pushBot(FR_INTRO.replace(/\n/g, "<br />"))
  }, [phase])

  useEffect(() => {
    return () => { if (permitTimer.current) clearTimeout(permitTimer.current) }
  }, [])

  const { lat, lng } = PUZZLE_ANSWER.franceIdpLngLat
  const latStr = String(lat)
  const lngStr = String(lng)

  const login = () => {
    const s = gameStore.get()
    const canPermit = s.canOpenSafeLink && s.hasMail3
    if (canPermit) {
      const a = account.trim()
      const p = password.trim()
      if (
        (a === latStr && p === lngStr) ||
        (a === lngStr && p === latStr)
      ) {
        setError("")
        localStorage.setItem(XIAODA_FR_KEY, "1")
        setPhase("france")
        return
      }
      setError("账号或密码错误")
      return
    }
    const normalized = password.trim().toLowerCase()
    if (normalized === PUZZLE_ANSWER.wuliuMailPwd.toLowerCase()) {
      setError("密码错误")
      return
    }
    if (normalized === PUZZLE_ANSWER.stageTwoPassword) {
      setError("")
      localStorage.setItem(XIAODA_UK_KEY, "1")
      gameStore.set({ hasMail2: true })
      setPhase("chat")
      return
    }
    setError("密码错误")
  }

  const submitFrance = () => {
    const value = franceInput.trim()
    if (value === "敦煌琵琶谱") {
      pushBot(RELIC_DATA["敦煌琵琶谱"].showText.replace(/\n/g, "<br />"))
    } else {
      pushBot("请直接问我「敦煌琵琶谱」吧。")
    }
    setFranceInput("")
  }

  const clickCandidate = (name: string) => {
    if (name === "唐代胡羊焖饼") {
      pushBot(GAME_TEXT.easterEggFakeRelic)
      return
    }
    if (name === "《金刚经》卷轴") {
      pushBot(replaceHide(RELIC_DATA["金刚经卷轴"].showText.replace(/\n/g, "<br />")))
      setCandidates(["木雕坐佛"])
      return
    }
    if (name === "木雕坐佛") {
      pushBot(replaceHide(RELIC_DATA["木雕坐佛"].showText.replace(/\n/g, "<br />")))
      pushBot(GAME_TEXT.xiaoDaNoPermit)
      setCandidates([])
      gameStore.set({ canOpenSafeLink: true })
      permitTimer.current = setTimeout(() => {
        setPhase("login")
      }, 2500)
      return
    }
  }

  const s = gameStore.get()
  const needPermit = s.canOpenSafeLink && s.hasMail3

  return (
    <div className="qingxiaoda-page">
      <header className="qingxiaoda-topbar">
        <button className="qingxiaoda-back" type="button" onClick={onBack}>← 桌面</button>
        <span className="qingxiaoda-title">青小搭</span>
        <span className="qingxiaoda-avatar" aria-hidden="true">{phase === "france" ? "🧘" : "🐸"}</span>
      </header>

      {phase === "login" ? (
        <div className="qingxiaoda-login">
          <div className="qingxiaoda-login-card">
            <div className="qingxiaoda-login-logo" aria-hidden="true">{needPermit ? "🧘" : "🐸"}</div>
            <h1>青小搭</h1>
            <p className="qingxiaoda-hint">{needPermit ? "账号密码为数字 + 小数点" : GAME_TEXT.xiaoDaLoginHint}</p>
            {needPermit && (
              <label>
                <span>账号</span>
                <input type="text" value={account} onChange={(event) => setAccount(event.target.value)} placeholder="数字 + 小数点" />
              </label>
            )}
            <label>
              <span>密码</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={needPermit ? "数字 + 小数点" : "纯字母"} />
            </label>
            {error && <p className="qingxiaoda-error">{error}</p>}
            <button className="qingxiaoda-login-btn" type="button" onClick={login}>登录</button>
          </div>
        </div>
      ) : (
        <div className="qingxiaoda-chat">
          <div className="qingxiaoda-chat-head">
            <span className="qingxiaoda-avatar" aria-hidden="true">{phase === "france" ? "🧘" : "🇬🇧"}</span>
            <span>{phase === "france" ? "法国现藏敦煌文物" : "英国现藏敦煌文物"}</span>
          </div>
          <div className="qingxiaoda-messages">
            {messages.map((message, index) => (
              <div key={index} className={`qingxiaoda-message ${message.role}`} dangerouslySetInnerHTML={{ __html: message.html }} />
            ))}
          </div>
          {phase !== "france" && (
            <div className="qingxiaoda-candidates">
              {candidates.map((name) => (
                <button key={name} type="button" onClick={() => clickCandidate(name)}>{name}</button>
              ))}
            </div>
          )}
          {phase === "france" && (
            <div className="qingxiaoda-france-input">
              <input type="text" value={franceInput} onChange={(event) => setFranceInput(event.target.value)} placeholder="问我文物名称" />
              <button type="button" onClick={submitFrance}>发送</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
