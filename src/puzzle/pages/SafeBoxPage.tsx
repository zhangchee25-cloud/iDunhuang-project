import { useState } from 'react'
import { PUZZLE_ANSWER } from '../data/puzzleAnswer'
import { GAME_TEXT } from '../data/gameText'
import { gameStore } from '../stores/gameStore'
import './safebox.css'

const normalize = (value: string) => value.trim().replace(/[。.]$/, '')

export default function SafeBoxPage({ onBack }: { onBack: () => void }) {
  const [layer, setLayer] = useState<1 | 2>(1)
  const [values, setValues] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const answers = layer === 1 ? PUZZLE_ANSWER.safeBox1 : PUZZLE_ANSWER.safeBox2

  const submit = () => {
    const next = normalize(current)
    if (next !== answers[values.length]) {
      setError('密码错误')
      return
    }
    setError('')
    const updated = [...values, next]
    setValues(updated)
    setCurrent('')
    if (updated.length < answers.length) return
    if (layer === 1) {
      setLayer(2)
      setValues([])
      return
    }
    gameStore.set({ hasMail3: true })
    setDone(true)
  }

  return (
    <div className="safebox-page">
      <header className="safebox-topbar">
        <button className="safebox-back" type="button" onClick={onBack}>← 返回桌面</button>
        <span className="safebox-title">法国巴黎原产保险箱</span>
      </header>
      <div className="safebox-shell">
        <div className={`safebox ${done ? 'is-open' : ''}`}>
          <div className="safebox-dial" aria-hidden="true">
            <span>{done ? '✓' : layer === 1 ? '①' : '②'}</span>
          </div>
          <h1>{done ? '保险箱已打开' : layer === 1 ? '保险箱 · 第一层' : '保险箱 · 第二层'}</h1>
          <p className="safebox-desc">
            {done ? '你解锁了最后一段旅程。' : `请输入第 ${values.length + 1} 个数字（${values.length + 1}/${answers.length}）`}
          </p>
          {!done && (
            <div className="safebox-progress">
              {answers.map((_, index) => (
                <i key={index} className={index < values.length ? 'is-filled' : ''} />
              ))}
            </div>
          )}
          {!done ? (
            <>
              <input type="text" value={current} onChange={(event) => setCurrent(event.target.value)} placeholder="数字 + 小数点" />
              {error && <p className="safebox-error">{error}</p>}
              <button type="button" onClick={submit}>确认</button>
            </>
          ) : (
            <div className="safebox-success" role="alert">{GAME_TEXT.redAlertFinal}</div>
          )}
        </div>
      </div>
    </div>
  )
}
