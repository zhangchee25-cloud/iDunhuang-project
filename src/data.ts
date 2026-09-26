export type ExhibitId = 'diamond' | 'pipa' | 'buddha'

export type Exhibit = {
  id: ExhibitId
  index: string
  name: string
  english: string
  shelfmark: string
  institution: string
  city: string
  period: string
  material: string
  summary: string
  detail: string
  image: string
  imageAlt: string
  imageCredit: string
  imageRights: string
  imageRightsUrl: string
  sourceUrl: string
  sourceLabel: string
  imageIsInterpretation?: boolean
}

export type Conversation = {
  id: string
  exhibit: ExhibitId
  question: string
  answer: string
  sourceUrl: string
  sourceLabel: string
}

export const exhibits: Exhibit[] = [
  {
    id: 'diamond',
    index: '01',
    name: '《金刚经》卷轴',
    english: 'The Diamond Sutra',
    shelfmark: 'Or.8210/P.2',
    institution: '英国图书馆',
    city: '伦敦',
    period: '公元 868 年',
    material: '雕版印刷 · 纸本卷轴',
    summary: '一部带有明确纪年的完整雕版印本，把千年前的印刷技术留在纸上。',
    detail: '这件卷轴发现于敦煌莫高窟第 17 窟，现藏英国图书馆。卷首版画与经文连接成近五米长的横卷。网页中的 3D 卷轴为数字展示示意；平面视图展示馆藏图像的局部。',
    image: '/assets/diamond-frontispiece.jpg',
    imageAlt: '《金刚经》卷首版画与部分经文',
    imageCredit: '© British Library Board / International Dunhuang Programme，Or.8210/P.2',
    imageRights: '非商业展示，注明馆藏来源；单件标注以 IDP 为准',
    imageRightsUrl: 'https://idp.bl.uk/copyright/',
    sourceUrl: 'https://idp.bl.uk/collection/51FDAEAFB4A24E2E9981692A98130BC8/',
    sourceLabel: 'IDP 馆藏记录',
  },
  {
    id: 'pipa',
    index: '02',
    name: '敦煌琵琶谱',
    english: 'Pelliot chinois 3808',
    shelfmark: 'Pelliot chinois 3808',
    institution: '法国国家图书馆',
    city: '巴黎',
    period: '约 10 世纪',
    material: '墨书 · 纸本遗书',
    summary: '一卷遗书的背面，保留了今日仍在研究的古代乐谱记号。',
    detail: 'P.3808 藏于法国国家图书馆。这里展示的是其背面乐谱页的数字图像。记号与现代五线谱不同，关于具体演奏方式的解释仍属于研究问题，因此网页不把它自动“翻译”为确定的旋律。',
    image: '/assets/p3808-score.jpg',
    imageAlt: '法国国家图书馆藏 Pelliot chinois 3808 背面乐谱页',
    imageCredit: 'Bibliothèque nationale de France / Gallica，Pelliot chinois 3808，f.16',
    imageRights: '非商业展示，注明来源',
    imageRightsUrl: 'https://www.bnf.fr/fr/portail-bnf-api-et-jeux-de-donnees',
    sourceUrl: 'https://gallica.bnf.fr/ark:/12148/btv1b8303290v/f16.item',
    sourceLabel: 'Gallica 数字图像',
  },
  {
    id: 'buddha',
    index: '03',
    name: '木雕坐佛',
    english: 'Seated wooden Buddha',
    shelfmark: 'MAS.853',
    institution: '大英博物馆',
    city: '伦敦',
    period: '9 世纪 · 唐代',
    material: '木雕 · 彩绘',
    summary: '一尊高约 9.4 厘米的小型坐佛，带着藏经洞器物的尺度与温度。',
    detail: '馆藏记录显示，这件木雕坐佛出自莫高窟第 17 窟，双手置于膝上，呈禅定姿。当前图像为原创艺术示意，不是文物照片或扫描模型；请点击馆藏链接观看原件资料。',
    image: '/assets/buddha-interpretation.png',
    imageAlt: '依据馆藏文字描述创作的木雕坐佛艺术示意图，并非原件照片',
    imageCredit: '本站原创 AI 辅助艺术示意；展品资料据大英博物馆',
    imageRights: '原创艺术示意，非文物影像',
    imageRightsUrl: 'https://www.britishmuseum.org/collection/object/A_MAS-853',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/A_MAS-853',
    sourceLabel: '大英博物馆馆藏记录',
    imageIsInterpretation: true,
  },
]

export const conversations: Conversation[] = [
  {
    id: 'diamond-date',
    exhibit: 'diamond',
    question: '你来自哪一年？',
    answer: '卷末题记标明公元 868 年。它是现存带明确纪年的最早完整印刷书之一，因此也是研究雕版印刷的重要实物。',
    sourceUrl: 'https://idp.bl.uk/collection/51FDAEAFB4A24E2E9981692A98130BC8/',
    sourceLabel: 'IDP 馆藏记录',
  },
  {
    id: 'diamond-making',
    exhibit: 'diamond',
    question: '你是怎样做出来的？',
    answer: '经文和卷首图像使用雕版印刷，印在纸上后连接成横卷。IDP 的记录给出的原件宽度为 499.5 厘米。',
    sourceUrl: 'https://idp.bl.uk/collection/51FDAEAFB4A24E2E9981692A98130BC8/',
    sourceLabel: 'IDP 馆藏记录',
  },
  {
    id: 'diamond-care',
    exhibit: 'diamond',
    question: '为什么需要数字化？',
    answer: '古卷需要谨慎保存。数字图像让更多人观察卷首版画和文字细节，也减少反复接触原件的需要。IDP 记录了这件卷轴的修复与数字展示。',
    sourceUrl: 'https://idp.bl.uk/blog/the-diamond-sutra/',
    sourceLabel: 'IDP《金刚经》介绍',
  },
  {
    id: 'pipa-location',
    exhibit: 'pipa',
    question: '你现在在哪里？',
    answer: '这卷遗书以 Pelliot chinois 3808 为编号，现藏法国国家图书馆。Gallica 提供数字图像，可以在线查看卷页。',
    sourceUrl: 'https://heritage.bnf.fr/france-chine/partitions',
    sourceLabel: '法国国家图书馆专题',
  },
  {
    id: 'pipa-sound',
    exhibit: 'pipa',
    question: '能直接听到你的旋律吗？',
    answer: '目前不能把谱面记号直接等同于一种确定的现代声音。研究者仍在解释这些记号与演奏方式；本站先展示原始图像和馆藏信息。',
    sourceUrl: 'https://heritage.bnf.fr/france-chine/partitions',
    sourceLabel: '法国国家图书馆专题',
  },
  {
    id: 'pipa-reverse',
    exhibit: 'pipa',
    question: '乐谱写在卷轴哪一面？',
    answer: '乐谱记号保存在 P.3808 的背面。网页展示的 f.16 图像可看见成列排列的记号和文字。',
    sourceUrl: 'https://gallica.bnf.fr/ark:/12148/btv1b8303290v/f16.item',
    sourceLabel: 'Gallica，f.16',
  },
  {
    id: 'buddha-origin',
    exhibit: 'buddha',
    question: '你从哪里被发现？',
    answer: '大英博物馆的馆藏记录将发现地点列为敦煌莫高窟第 17 窟，也就是常说的藏经洞。',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/A_MAS-853',
    sourceLabel: '大英博物馆馆藏记录',
  },
  {
    id: 'buddha-detail',
    exhibit: 'buddha',
    question: '你是什么材料、什么年代？',
    answer: '馆藏记录把它定为 9 世纪唐代木雕，表面有彩绘痕迹，高约 9.4 厘米。本站配图为艺术示意，原件请以馆藏记录为准。',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/A_MAS-853',
    sourceLabel: '大英博物馆馆藏记录',
  },
]

export const byId = Object.fromEntries(exhibits.map((item) => [item.id, item])) as Record<ExhibitId, Exhibit>
