# 敦煌有信

面向支队宣传展示的单页数字展：从敦煌到伦敦、巴黎，浏览《金刚经》、敦煌琵琶谱与木雕坐佛的馆藏线索。页面包括可旋转的 3D 卷轴、图像放大阅读和附来源的固定问答。无需后端或大模型密钥。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。在项目目录运行：

```bash
npm install
npm run dev
```

打开终端显示的本地地址。正式构建与本地演示：

```bash
npm run build
npm run preview
```

`dist/` 是完整静态网站，可上传到腾讯云 CloudBase 静态网站托管或其他静态托管服务。上线前请用最终展示用途再次核对每张馆藏图像的使用条件。

## 内容与图像

- 展品和问答集中在 `src/data.ts`，每条问答附查证链接。
- 《金刚经》图像取自项目中的 `IDP金刚经图像/`，网站只复制了卷首版画、经文、卷末题记和全卷概览四张到 `public/assets/`；原始下载目录未改动。馆藏号 Or.8210/P.2，图像署名 © British Library Board / International Dunhuang Programme。使用须遵循 [IDP 版权与再利用说明](https://idp.bl.uk/copyright/) 及单件标注。
- 琵琶谱使用 [法国国家图书馆 Gallica 的 Pelliot chinois 3808，f.16](https://gallica.bnf.fr/ark:/12148/btv1b8303290v/f16.item) 数字图像，按其非商业再利用要求注明来源。
- 木雕坐佛 MAS.853 当前使用原创 AI 辅助艺术示意，**不是原件照片**；资料以[大英博物馆馆藏记录](https://www.britishmuseum.org/collection/object/A_MAS-853)为准。原站可访问且图片许可确认后，可替换 `public/assets/buddha-interpretation.png` 并同步更新 `src/data.ts` 的图片说明。

3D 卷轴是解释形制的数字展示示意，纸面贴有馆藏图像局部，并非文物三维扫描。若浏览器不支持 WebGL，自动显示静态图像。
