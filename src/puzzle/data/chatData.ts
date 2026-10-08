export type ChatMessage = {
  sender: string
  content: string
  type: "text" | "link" | "music" | "pdfShare"
  linkUrl?: string
  disabled?: boolean // 是否锁定不可点击
}

export type ChatSession = {
  sessionId: string
  title: string
  canOpen: boolean
  msgList: ChatMessage[]
}

export const MECHAT_SESSIONS: ChatSession[] = [
  {
    sessionId: "wuliu",
    title: "吴务鎏",
    canOpen: true,
    msgList: [
      { sender: "吴务鎏", content: "这周课程好多，马上就要放暑假咯", type: "text" },
      { sender: "我", content: "是啊，打算假期去哪里玩？", type: "text" },
      { sender: "吴务鎏", content: "我可能要出去一趟，暂时不在学校。", type: "text" },
      { sender: "吴务鎏", content: "我的青蛙大学邮箱账号：ee56@mails.frog.edu.cn，密码：FROG2025wuliu，你一定要记住。", type: "text" },
      { sender: "我", content: "???", type: "text" },
      { sender: "我", content: "不是，你怎么把账号密码直接发给我了，这也太信任我了吧！提高反诈意识啊喂！", type: "text" },
      { sender: "我", content: "发生什么事？你要去哪？看到请回复我！", type: "text" },
      { sender: "我", content: "人呢？不要已读不回啊！", type: "text" }
    ]
  },
  {
    sessionId: "filehelper",
    title: "文件传输助手",
    canOpen: true,
    msgList: [
      { sender: "我", content: "拿快递", type: "text" },
      { sender: "我", content: "电子女篮新生杯报名", type: "text" },
      { sender: "我", content: "新生导师谈话报告提交", type: "text" },
      { sender: "我", content: "《大物作业2》", type: "pdfShare" },
      { sender: "OO音乐分享", content: "Capital Letters", type: "music" },
      { sender: "我", content: "《电电学习秘诀》", type: "pdfShare" },
      { sender: "我", content: "【多拼拼】法国巴黎原产保险箱", type: "link", linkUrl: "#safeBox", disabled: true },
      { sender: "我", content: "【千度网盘】电子系课程资料", type: "link", linkUrl: "#disk" }
    ]
  },
  { sessionId: "classmate1", title: "伍雾凌", canOpen: false, msgList: [] },
  { sessionId: "classmate2", title: "2026班委群", canOpen: false, msgList: [] }
]
