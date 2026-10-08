const STORAGE_KEY = "iDunhuang_puzzle_game"

type GameState = {
  stage: number // 0初始，1敦煌，2英国，3法国，4结局
  canOpenSafeLink: boolean
  hasMail2: boolean
  hasMail3: boolean
  noteContent: string
}

const defaultState: GameState = {
  stage:0,
  canOpenSafeLink:false,
  hasMail2:false,
  hasMail3:false,
  noteContent:""
}

export const gameStore = {
  get():GameState{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(!raw) return {...defaultState}
    try{
      return JSON.parse(raw)
    }catch {
      return {...defaultState}
    }
  },
  set(state:Partial<GameState>){
    const old = this.get()
    const next = {...old,...state}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  },
  reset(){
    localStorage.removeItem(STORAGE_KEY)
  }
}