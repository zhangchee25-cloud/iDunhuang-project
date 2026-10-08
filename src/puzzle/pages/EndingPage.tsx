import { useEffect, useRef, useState } from 'react'
import { GAME_TEXT } from '../data/gameText'
import { typeWriter } from '../utils/textTools'
import { gameStore } from '../stores/gameStore'
import './ending.css'

const ENDING_INTRO = `vr文件里出现了吴务鎏的身影，她看着镜头，对你说`

export default function EndingPage({ onHome }: { onHome: () => void }) {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const runRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    let cancelled = false
    const fullText = `${ENDING_INTRO}\n\n${GAME_TEXT.endingNarration}`
    runRef.current = typeWriter(fullText, (chunk) => {
      if (!cancelled) setText(chunk)
    }, 60).then(() => {
      if (!cancelled) setDone(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const replay = () => {
    gameStore.reset()
    localStorage.removeItem('puzzle_xiaoda_uk')
    localStorage.removeItem('puzzle_xiaoda_france')
    localStorage.removeItem('puzzle_tmail_loggedin')
    window.location.hash = '#puzzle'
    window.location.reload()
  }

  return (
    <main className="ending-page">
      <div className="ending-content">
        <span className="ending-eyebrow">iDUNHUANG · ENDING</span>
        <div className="ending-narration">
          {text.split('\n').map((line, index) => (
            <p key={index} className="ending-line">{line || '\u00A0'}</p>
          ))}
          {!done && <span className="ending-caret" aria-hidden="true" />}
        </div>

        {done && (
          <div className="ending-finale">
            <h1 className="ending-title">{GAME_TEXT.endingTitle}</h1>
            <div className="ending-actions">
              <button className="ending-replay" type="button" onClick={replay}>重新游玩</button>
              <button className="ending-home" type="button" onClick={onHome}>返回iDunhuang主展览</button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
