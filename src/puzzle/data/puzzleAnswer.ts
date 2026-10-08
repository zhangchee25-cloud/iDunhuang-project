/** 网页解谜全部标准答案，统一管理，方便后期修改 */
export const PUZZLE_ANSWER = {
  // 清小搭第二阶段登录密码：提取英文文本大写字母小写化 DHSTAGETWO
  stageTwoPassword: "dhstagetwo",

  // 第一层保险箱三组数字
  safeBox1: ["868", "499.5", "8210"],
  // 第二层保险箱三组数字
  safeBox2: ["17", "9", "9.4"],

  // 网盘第一虚假提取码
  fakeDiskCode: "3808",
  // 凯撒位移：向后位移16位；原始字符串 html
  caesarShift: 16,
  caesarOriginStr: "html",
  // html向后移16位：xbre；向前16位：rcnv
  caesarAnswerBackward: "xbre",
  caesarAnswerForward: "rcnv",

  // 法国IDP中心经纬度（巴黎国家图书馆黎塞留馆）
  franceIdpLngLat: {
    lat: 48.8627,
    lng: 2.3423
  },

  // 搜索框可命中关键词
  searchKeywords: ["伦敦", "英国图书馆", "The Diamond Sutra"],

  // 吴务鎏账号密码（青蛙大学，玩家拿到，但不能登录清小搭）
  wuliuMailAccount: "ee56@mails.frog.edu.cn",
  wuliuMailPwd: "FROG2025wuliu"
}
