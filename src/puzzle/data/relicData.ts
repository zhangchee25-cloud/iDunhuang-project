export type RelicItem = {
  name: string
  showText: string
  hideNum?: string[]
}

export const RELIC_DATA: Record<string, RelicItem> = {
  "金刚经卷轴": {
    name: "《金刚经》卷轴",
    showText: `idp官网链接：https://idp.bl.uk/collection/51FDAEAFB4A24E2E9981692A98130BC8/
馆藏编号 Or.8210/P.2。
卷末题记标明公元 <b>868</b> 年。
它是现存带明确纪年的最早完整印刷书之一，因此也是研究雕版印刷的重要实物。
经文和卷首图像使用雕版印刷，印在纸上后连接成横卷。
IDP 的记录给出的原件宽度为 <b>499.5</b> 厘米。
古卷需要谨慎保存。数字图像让更多人观察卷首版画和文字细节，也减少反复接触原件的需要。
IDP 记录了这件卷轴的修复与数字展示。
馆藏档案编号 <b>8210</b>`
  },
  "木雕坐佛": {
    name: "木雕坐佛",
    showText: `idp官网链接：https://www.britishmuseum.org/collection/object/A_MAS-853
大英博物馆的馆藏记录将发现地点列为敦煌莫高窟第【HIDE17】窟，也就是常说的藏经洞。
馆藏记录把它定为 【HIDE9】 世纪唐代木雕，表面有彩绘痕迹，高约【HIDE9.4】厘米。
本站配图为艺术示意，原件请以馆藏记录为准。`,
    hideNum: ["17", "9", "9.4"]
  },
  "敦煌琵琶谱": {
    name: "敦煌琵琶谱",
    showText: `这卷遗书以 Pelliot chinois <b>3808</b> 为编号，现藏法国国家图书馆。
Gallica提供数字图像，可以在线查看卷页，访问地址：https://gallica.bnf.fr/ark:/12148/btv1b8303290v/f16.item
好消息是，这套谱面记号如今已经成功破译，研究者基本还原出唐代琵琶的演奏方式，千年前的旋律得以重新响起。
乐谱记号保存在 P.3808 的背面。网页展示的 f.<b>16</b> 图像可看见成列排列的记号和文字。`
  },
  "唐代胡羊焖饼": {
    name: "唐代胡羊焖饼",
    showText: ""
  }
}
