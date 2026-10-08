import { useEffect, useRef, useState } from 'react'
import { GAME_TEXT } from '../data/gameText'
import '../styles/puzzle-intro.css'

export type PuzzleStage = 'intro' | 'desktop'

const NARRATION_LINES = GAME_TEXT.openingNarration
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)

export function PuzzleIntro({ onEnter }: { onEnter: () => void }) {
  const [confirmed, setConfirmed] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [typingLine, setTypingLine] = useState(0)
  const [typed, setTyped] = useState('')
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    if (!confirmed || typingLine >= NARRATION_LINES.length) return
    const line = NARRATION_LINES[typingLine]
    let char = 0
    let frame = 0
    const tick = (time: number) => {
      if (frame === 0) frame = time
      const elapsed = time - frame
      const next = Math.min(line.length, Math.floor(elapsed / 70))
      if (next !== char) {
        char = next
        setTyped(line.slice(0, char))
      }
      if (char < line.length) {
        requestRef.current = requestAnimationFrame(tick)
      }
    }
    setTyped('')
    requestRef.current = requestAnimationFrame(tick)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [confirmed, typingLine])

  const nextLine = () => {
    if (!confirmed) {
      setConfirmed(true)
      setVisibleCount(1)
      return
    }
    if (typingLine < NARRATION_LINES.length - 1) {
      setTypingLine((line) => line + 1)
      setVisibleCount((count) => count + 1)
    } else {
      onEnter()
    }
  }

  return (
    <main className="puzzle-intro">
      {!confirmed && (
        <div className="puzzle-entry-layer" role="dialog" aria-modal="true" aria-labelledby="puzzle-entry-title">
          <div className="puzzle-entry-card">
            <div className="puzzle-entry-head">
              <span className="puzzle-entry-dot" aria-hidden="true" />
              <span className="puzzle-entry-kicker">iDUNHUANG · 隐藏入口</span>
            </div>
            <h1 id="puzzle-entry-title">微信新消息</h1>
            <p className="puzzle-entry-copy">选择后进入网站的网页解密游戏版本，是否进入？</p>
            <div className="puzzle-entry-actions">
              <button className="puzzle-entry-cancel" type="button" onClick={() => window.history.back()}>先不了</button>
              <button className="puzzle-entry-go" type="button" onClick={nextLine}>进入解密 <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </div>
      )}

      {confirmed && (
        <div className="puzzle-narration">
          <div className="puzzle-narration-inner">
            <span className="puzzle-narration-label">A LETTER FROM DUNHUANG</span>
            {NARRATION_LINES.map((line, index) => {
              if (index >= visibleCount) return null
              const current = index === typingLine ? typed : line
              return (
                <p className={`puzzle-narration-line ${index === typingLine ? 'is-typing' : ''}`} key={line}>
                  {current}
                  {index === typingLine && <span className="puzzle-caret" aria-hidden="true" />}
                </p>
              )
            })}
            {visibleCount < NARRATION_LINES.length && (
              <button className="puzzle-narration-next" type="button" onClick={nextLine}>继续 <span aria-hidden="true">↓</span></button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
