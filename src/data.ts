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
  modelUrl?: string
  modelDescription?: string
  modelCredit?: string
  modelRotationY?: number
  modelNote?: string
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
    summary: '一卷遗书的背面，留下了已被成功破译的唐代乐谱记号。',
    detail: 'P.3808 藏于法国国家图书馆。这里展示的是其背面乐谱页的数字图像。记号与现代五线谱不同，如今这套谱面记号已被成功破译，研究者基本还原出唐代琵琶的演奏方式。',
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
    detail: '这件木雕坐佛出自莫高窟第 17 窟，双手置于膝上，呈禅定姿。残存的红黑彩绘、衣褶与莲座的缺损，让这件小型器物的岁月痕迹清晰可见。',
    image: '/assets/buddha-real.jpg',
    imageAlt: '大英博物馆藏 MAS.853 木雕坐佛正面馆藏照片，可见残存彩绘和莲座缺损',
    imageCredit: '© The Trustees of the British Museum，MAS.853；馆藏照片由团队提供',
    imageRights: '图片使用条件以馆方及原图标注为准',
    imageRightsUrl: 'https://www.britishmuseum.org/terms-use/copyright-and-permissions/images-and-photography',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/A_MAS-853',
    sourceLabel: '大英博物馆馆藏记录',
    imageIsInterpretation: false,
    modelUrl: import.meta.env.VITE_BUDDHA_MODEL_URL === 'off' ? undefined : (import.meta.env.VITE_BUDDHA_MODEL_URL || '/assets/buddha.glb'),
    modelDescription: '依据馆藏照片生成的数字重建',
    modelCredit: '团队使用 Tripo 依据 MAS.853 正、背面馆藏照片生成并优化；原图 © The Trustees of the British Museum',
    modelRotationY: -Math.PI / 2,
    modelNote: 'AI 重建并非馆方扫描或考古测绘。面部形体及裂缝深度包含推断，细节请以原图为准。',
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
    answer: '这套谱面记号如今已被成功破译，研究者基本还原出唐代琵琶的演奏方式，千年前的旋律得以重新响起；本站同时展示原始图像和馆藏信息。',
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
    answer: '馆藏记录把它定为 9 世纪唐代木雕，表面有彩绘痕迹，高约 9.4 厘米。正面馆藏照片上仍能看到红黑彩绘与木质表面。',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/A_MAS-853',
    sourceLabel: '大英博物馆馆藏记录',
  },
]

export const byId = Object.fromEntries(exhibits.map((item) => [item.id, item])) as Record<ExhibitId, Exhibit>
