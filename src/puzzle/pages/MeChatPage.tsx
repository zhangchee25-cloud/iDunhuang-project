import { useState } from 'react'
import { MECHAT_SESSIONS, type ChatMessage } from '../data/chatData'
import { GAME_TEXT } from '../data/gameText'
import { gameStore } from '../stores/gameStore'
import './mechat.css'

const FILE_NAME_OVERRIDES: Record<string, string> = {
  '《大物作业2》': '大物作业2',
  '《电电学习秘诀》': 'glgg的随手推秘诀',
}

const isPinduoduoLink = (message: ChatMessage) => message.type === 'link' && message.linkUrl === '#safeBox'

function Message({ message, onSafeLink }: { message: ChatMessage; onSafeLink: () => void }) {
  const mine = message.sender === '我'
  const disabledSafe = isPinduoduoLink(message) && !gameStore.get().canOpenSafeLink

  const clickSafeLink = () => {
    if (!disabledSafe) onSafeLink()
  }

  if (message.type === 'music') {
    return (
      <div className={`mechat-row ${mine ? 'is-mine' : ''}`}>
        <div className="mechat-music">
          <span className="mechat-music-mark" aria-hidden="true">♪</span>
          <span>
            <strong>{message.sender}</strong>
            <small>分享了歌曲</small>
          </span>
          <span className="mechat-music-title">{message.content}</span>
        </div>
      </div>
    )
  }

  if (message.type === 'pdfShare') {
    return (
      <div className={`mechat-row ${mine ? 'is-mine' : ''}`}>
        <div className="mechat-file">
          <span className="mechat-file-mark" aria-hidden="true">📄</span>
          <span>
            <strong>{FILE_NAME_OVERRIDES[message.content] ?? message.content}</strong>
            <small>文件</small>
          </span>
        </div>
      </div>
    )
  }

  if (message.type === 'link') {
    return (
      <div className={`mechat-row ${mine ? 'is-mine' : ''}`}>
        <button
          type="button"
          className={`mechat-link ${disabledSafe ? 'is-disabled' : ''}`}
          onClick={isPinduoduoLink(message) ? clickSafeLink : undefined}
        >
          <span className="mechat-link-mark" aria-hidden="true">🔗</span>
          <span>{message.content}</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`mechat-row ${mine ? 'is-mine' : ''}`}>
      <div className="mechat-bubble">{message.content}</div>
    </div>
  )
}

export default function MeChatPage({ onBack }: { onBack: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)

  const activeSession = MECHAT_SESSIONS.find((session) => session.sessionId === activeId)

  const openSession = (sessionId: string) => {
    const session = MECHAT_SESSIONS.find((item) => item.sessionId === sessionId)!
    if (!session.canOpen) {
      setActiveId(null)
      return
    }
    setActiveId(sessionId)
  }

  const clickSafeLink = () => {
    if (gameStore.get().canOpenSafeLink) {
      window.location.hash = 'safeBox'
    } else {
      setFlash(true)
      window.setTimeout(() => setFlash(false), 1600)
    }
  }

  return (
    <div className="mechat-page">
      <header className="mechat-topbar">
        <button className="mechat-back" type="button" onClick={onBack}>← 桌面</button>
        <span className="mechat-title">MeChat</span>
        <span className="mechat-avatar">我</span>
      </header>

      <div className="mechat-layout">
        {!activeSession ? (
          <aside className="mechat-sessions">
            {MECHAT_SESSIONS.map((session) => (
              <button
                key={session.sessionId}
                type="button"
                className="mechat-session"
                onClick={() => openSession(session.sessionId)}
              >
                <span className="mechat-session-avatar">{session.title.slice(0, 1)}</span>
                <span className="mechat-session-name">{session.title}</span>
              </button>
            ))}
          </aside>
        ) : (
          <aside className="mechat-sessions">
            <button className="mechat-session" type="button" onClick={() => setActiveId(null)}>
              <span className="mechat-session-avatar">‹</span>
              <span className="mechat-session-name">返回会话列表</span>
            </button>
          </aside>
        )}

        <main className="mechat-chat">
          {!activeSession ? (
            <div className="mechat-empty">选择一个会话开始查看</div>
          ) : (
            <>
              <div className="mechat-chat-head">{activeSession.title}</div>
              <div className="mechat-messages">
                {activeSession.msgList.map((message, index) => (
                  <Message key={`${message.sender}-${index}`} message={message} onSafeLink={clickSafeLink} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {flash && (
        <div className="mechat-flash" role="alert">
          {GAME_TEXT.safeBoxLockTip}
        </div>
      )}
    </div>
  )
}
