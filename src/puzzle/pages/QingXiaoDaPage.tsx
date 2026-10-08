import { useEffect, useState } from 'react'
import { PUZZLE_ANSWER } from '../data/puzzleAnswer'
import { RELIC_DATA } from '../data/relicData'
import { GAME_TEXT } from '../data/gameText'
import { gameStore } from '../stores/gameStore'
import './qingxiaoda.css'

const UK_INTRO = `你好，我是「英国现藏敦煌文物」智能体。\
我代表的是收藏于英国各机构的敦煌文物与遗书。\
英国图书馆、大英博物馆等机构保存了大量敦煌藏经洞出土文献与器物。\
经过数字化整理，这些文物可以在线查看高清图像和馆藏记录。\
请直接选择下方文物中文名 / 英文名来问我吧。`

const replaceHide = (text: string) =>
  text.replace(/【HIDE([^】]+)】/g, '<span class="hide-text">$1</span>')

type Phase = 'login' | 'chat'

export default function QingXiaoDaPage({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>(() => (gameStore.get().hasMail2 ? 'chat' : 'login'))
  const [account] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; html: string }[]>([])
  const [candidates, setCandidates] = useState<string[]>(['《金刚经》卷轴', '唐代胡羊焖饼'])
  const [permitDone] = useState(false)
  const [permitPassword, setPermitPassword] = useState('')

  const pushBot = (html: string) => setMessages((list) => [...list, { role: 'bot', html }])

  useEffect(() => {
    if (phase === 'chat' && messages.length === 0) pushBot(UK_INTRO.replace(/\n/g, '<br />'))
  }, [phase])

  const login = () => {
    const normalized = password.trim().toLowerCase()
    if (!permitDone && (account.trim().toLowerCase() === PUZZLE_ANSWER.wuliuMailAccount.toLowerCase() || password === PUZZLE_ANSWER.wuliuMailPwd)) {
      setError('密码错误')
      return
    }
    if (!permitDone && normalized === PUZZLE_ANSWER.stageTwoPassword) {
      setError('')
      gameStore.set({ hasMail2: true })
      setPhase('chat')
      return
    }
    setError('密码错误')
  }

  const clickCandidate = (name: string) => {
    if (name === '唐代胡羊焖饼') {
      pushBot(GAME_TEXT.easterEggFakeRelic)
      return
    }
    if (name === '《金刚经》卷轴') {
      pushBot(replaceHide(RELIC_DATA['金刚经卷轴'].showText.replace(/\n/g, '<br />')))
      setCandidates(['木雕坐佛'])
      return
    }
    if (name === '木雕坐佛') {
      pushBot(replaceHide(RELIC_DATA['木雕坐佛'].showText.replace(/\n/g, '<br />')))
      setCandidates([])
      return
    }
  }

  return (
    <div className="qingxiaoda-page">
      <header className="qingxiaoda-topbar">
        <button className="qingxiaoda-back" type="button" onClick={onBack}>← 桌面</button>
        <span className="qingxiaoda-title">青小搭</span>
        <span className="qingxiaoda-avatar" aria-hidden="true">🐸</span>
      </header>

      {phase === 'login' ? (
        <div className="qingxiaoda-login">
          <div className="qingxiaoda-login-card">
            <div className="qingxiaoda-login-logo" aria-hidden="true">🐸</div>
            <h1>青小搭</h1>
            <p className="qingxiaoda-hint">{GAME_TEXT.xiaoDaLoginHint}</p>
            {permitDone && (
              <p className="qingxiaoda-permit-hint">账号密码为数字 + 小数点</p>
            )}
            <label>
              <span>密码</span>
              <input type="password" value={permitDone ? permitPassword : password} onChange={(event) => permitDone ? setPermitPassword(event.target.value) : setPassword(event.target.value)} placeholder={permitDone ? '数字 + 小数点' : '纯字母'} />
            </label>
            {error && <p className="qingxiaoda-error">{error}</p>}
            <button className="qingxiaoda-login-btn" type="button" onClick={login}>登录</button>
          </div>
        </div>
      ) : (
        <div className="qingxiaoda-chat">
          <div className="qingxiaoda-chat-head">
            <span className="qingxiaoda-avatar" aria-hidden="true">🇬🇧</span>
            <span>英国现藏敦煌文物</span>
          </div>
          <div className="qingxiaoda-messages">
            {messages.map((message, index) => (
              <div key={index} className={`qingxiaoda-message ${message.role}`} dangerouslySetInnerHTML={{ __html: message.html }} />
            ))}
          </div>
          <div className="qingxiaoda-candidates">
            {candidates.map((name) => (
              <button key={name} type="button" onClick={() => clickCandidate(name)}>{name}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
