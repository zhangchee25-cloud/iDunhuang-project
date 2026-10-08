import { useState } from 'react'
import { PUZZLE_ANSWER } from '../data/puzzleAnswer'
import { GAME_TEXT } from '../data/gameText'
import './disk.css'

type View = 'enter' | 'fake' | 'real'

export default function DiskPage({ onBack }: { onBack: () => void }) {
  const [code, setCode] = useState('')
  const [view, setView] = useState<View>('enter')
  const [error, setError] = useState('')
  const [openDirs, setOpenDirs] = useState<string[]>(['elective'])

  const submit = () => {
    const value = code.trim().toLowerCase()
    if (value === PUZZLE_ANSWER.fakeDiskCode) {
      setView('fake')
      setError('')
      return
    }
    if (value === PUZZLE_ANSWER.caesarAnswerBackward || value === PUZZLE_ANSWER.caesarAnswerForward) {
      setView('real')
      setError('')
      return
    }
    setError('提取码错误')
  }

  return (
    <div className="disk-page">
      <header className="disk-topbar">
        <button className="disk-back" type="button" onClick={onBack}>← 返回桌面</button>
        <span className="disk-title">千度网盘</span>
      </header>

      {view === 'enter' && (
        <div className="disk-enter">
          <div className="disk-enter-card">
            <span className="disk-logo" aria-hidden="true">☁️</span>
            <h1>电子系课程资料</h1>
            <p>请输入 4 位提取码</p>
            <input type="text" maxLength={4} value={code} onChange={(event) => setCode(event.target.value)} placeholder="4位提取码" />
            {error && <p className="disk-error">{error}</p>}
            <button type="button" onClick={submit}>提取文件</button>
          </div>
        </div>
      )}

      {view === 'fake' && (
        <div className="disk-files">
          <div className="disk-files-head">课程资料 · 共 2 个文件</div>
          <div className="disk-file" title={GAME_TEXT.diskHoverTip}>title.html</div>
          <div className="disk-file" title="凯撒生平">16. 凯撒生平</div>
          <button className="disk-reenter" type="button" onClick={() => { setView('enter'); setCode('') }}>返回重新输入提取码</button>
        </div>
      )}

      {view === 'real' && (
        <div className="disk-files">
          <div className="disk-files-head">真实课程资料</div>
          <button className="disk-folder" type="button" onClick={() => setOpenDirs((list) => list.includes('elective') ? list.filter((id) => id !== 'elective') : [...list, 'elective'])}>
            📁 任选课
          </button>
          {openDirs.includes('elective') && (
            <div className="disk-folder-children">
              <button className="disk-folder" type="button" onClick={() => setOpenDirs((list) => list.includes('paris') ? list.filter((id) => id !== 'paris') : [...list, 'paris'])}>
                📁 巴黎风土人情
              </button>
              {openDirs.includes('paris') && (
                <div className="disk-folder-children">
                  <button className="disk-folder" type="button" onClick={() => { window.location.hash = 'ending' }}>🎬 VR让你一秒到巴黎IDP中心</button>
                </div>
              )}
            </div>
          )}
          <button className="disk-reenter" type="button" onClick={() => { setView('enter'); setCode(''); setOpenDirs(['elective']) }}>返回重新输入提取码</button>
        </div>
      )}
    </div>
  )
}
