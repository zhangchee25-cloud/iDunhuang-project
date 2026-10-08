import { useState } from 'react'
import { PUZZLE_ANSWER } from '../data/puzzleAnswer'
import { SEARCH_PAGE_DATA } from '../data/mailData'
import { GAME_TEXT } from '../data/gameText'
import { gameStore } from '../stores/gameStore'
import './search.css'

type WikiKey = '伦敦' | '英国图书馆' | 'The Diamond Sutra'

const WIKI: Record<WikiKey, string> = {
  '伦敦': SEARCH_PAGE_DATA.londonWiki,
  '英国图书馆': SEARCH_PAGE_DATA.libWiki,
  'The Diamond Sutra': SEARCH_PAGE_DATA.diamondSutraWiki,
}

const matchKeyword = (query: string): WikiKey | null => {
  const value = query.trim()
  if (!value) return null
  return PUZZLE_ANSWER.searchKeywords.find((keyword) => value.toLowerCase().includes(keyword.toLowerCase())) as WikiKey | undefined ?? null
}

export default function SearchPage({ onBack, onSolved }: { onBack: () => void; onSolved: () => void }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<{ key: WikiKey | null; text: string } | null>(null)

  const submit = () => {
    const key = matchKeyword(query)
    if (!key) {
      setResult({ key: null, text: GAME_TEXT.searchNothingTip })
      return
    }
    setResult({ key, text: WIKI[key] })
    if (!gameStore.get().hasMail2) {
      gameStore.set({ hasMail2: true })
      onSolved()
    }
  }

  return (
    <div className="search-page">
      <header className="search-topbar">
        <button className="search-back" type="button" onClick={onBack}>← 返回邮箱</button>
        <span className="search-title">敦煌检索</span>
      </header>
      <div className="search-shell">
        <h1>敦煌资料检索</h1>
        <p>输入关键词，检索相关词条。</p>
        <form className="search-form" onSubmit={(event) => { event.preventDefault(); submit() }}>
          <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button type="submit">检索</button>
        </form>
        {result && (
          <div className="search-result">
            <strong>{result.key ? result.key : '检索结果'}</strong>
            <p>{result.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}
