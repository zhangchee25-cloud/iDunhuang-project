# 敦煌有信

「一眼，千年」滚动序章与展览已合并为连续页面：序章 → 敦煌 → 伦敦（《金刚经》、木雕坐佛）→ 巴黎（琵琶谱）→ 数字化与来源。每件展品只展示一次，问答紧随对应展品。首页沿用原来的三幕滚动时长、镜头缓动与文字切换。

木雕坐佛已接入根据真实馆藏正、背面照片生成的 Tripo 数字重建。首页保留三幕滚动运镜，展品区可旋转、缩放、复位和切换原图。模型为 97,182 个三角面、2K 内嵌纹理、8.90 MB；不是馆方扫描或考古测绘，面部形体和裂缝深度含 AI 推断，细节请以原图为准。

序章采用「暗中浮现」：首屏标题清晰，佛像随滚动逐渐显形。导航队徽根据队旗手写 iD 与飞天飘带提炼，砂金主版、紫色版和小图标位于 `public/assets/team-emblem*.svg`；队旗原图保存在 `assets/brand/`。显现曲线由 `src/heroReveal.ts` 控制，运行 `npm test` 可检查关键节点和连续性。

面向支队宣传展示的单页数字展：从敦煌到伦敦、巴黎，浏览《金刚经》、敦煌琵琶谱与木雕坐佛的馆藏线索。页面包括可旋转的 3D 卷轴、图像放大阅读和附来源的固定问答。无需后端或大模型密钥。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。在项目目录运行：

```bash
npm install
npm run dev
```

打开终端显示的本地地址。正式构建与本地演示：

```bash
npm run build -- --emptyOutDir false
npm run preview
```

`dist/` 是完整静态网站，可上传到腾讯云 CloudBase 静态网站托管或其他静态托管服务。上线前请用最终展示用途再次核对每张馆藏图像的使用条件。

## 内容与图像

- 展品和问答集中在 `src/data.ts`，每条问答附查证链接。
- 《金刚经》图像取自项目中的 `IDP金刚经图像/`，网站只复制了卷首版画、经文、卷末题记和全卷概览四张到 `public/assets/`；原始下载目录未改动。馆藏号 Or.8210/P.2，图像署名 © British Library Board / International Dunhuang Programme。使用须遵循 [IDP 版权与再利用说明](https://idp.bl.uk/copyright/) 及单件标注。
- 琵琶谱使用 [法国国家图书馆 Gallica 的 Pelliot chinois 3808，f.16](https://gallica.bnf.fr/ark:/12148/btv1b8303290v/f16.item) 数字图像，按其非商业再利用要求注明来源。
- 木雕坐佛 MAS.853 已使用真实馆藏照片。五张团队原图保存在 `public/assets/buddha-reference/`，首页和展品默认使用 `public/assets/buddha-real.jpg`（原图 `1613966443.jpg` 的未修改副本）。署名 © The Trustees of the British Museum。逐图许可未随下载提供，正式发布时按馆方及原图标注填写使用条件。

3D 卷轴是解释形制的数字展示示意，纸面贴有馆藏图像局部，并非文物三维扫描。若浏览器不支持 WebGL，自动显示静态图像。

## 坐佛模型与替换方式

当前模型默认位于 `public/assets/buddha.glb`，原始高分辨率版本备份为 `assets/models/buddha-high.glb`（不进入发布包）。生成记录与积分明细见 [模型记录](docs/buddha-model.md)。正、背面输入保存在 `assets/model-sources/buddha/`；只裁除底部标尺，不修饰文物像素，未采用 AI 抠图试稿。

1. 替换 `public/assets/buddha.glb` 即可。建议 Y 轴向上、不超过 10 万三角面、最高 2K 内嵌纹理、文件小于 10 MB。当前模型正面为 +X，在 `src/data.ts` 使用 `modelRotationY: -Math.PI / 2`；新模型若朝向 +Z，改为 `0`。
2. 默认无需环境变量；如要使用另一个本地地址，复制 `.env.example` 为 `.env.local` 并启用：

   ```dotenv
   VITE_BUDDHA_MODEL_URL=/assets/buddha.glb
   ```

3. 重启开发服务或重新构建。`VITE_BUDDHA_MODEL_URL=off` 可关闭模型，仅显示照片。模型和贴图全部本地加载，浏览器不调用 Tripo，不含 API 密钥。当前使用普通 GLB；加载器内置本地 Meshopt 解码支持，未配置 Draco/KTX2。
4. 更换模型后须重新对照照片和 0%、25%、43%、64%、100% 镜头节点，检查手机构图与性能。

模型加载失败或 WebGL 上下文丢失时自动回到照片版本。首页与展品共用已解析模型缓存，展品查看器接近视口才加载。

## 手动改文案与兼容链接

- `src/data.ts`：展品资料、问答、图片署名和模型说明。
- `src/Homepage.tsx`：序章三幕文字与镜头节奏。
- `src/App.tsx`：城市叙事、导航、数字化说明和来源页尾。
- `src/journey.css`：城市章节排版；`src/homepage.css`：序章；`src/styles.css`：通用、卷轴与阅读弹窗。
- 旧锚点保持有效：`#journey` 为敦煌、`#collection` 为伦敦、`#dialogue` 为《金刚经》问答，三个 `#exhibit-*` 定位对应展品。

原图不再依赖构建目录保存。本次保留了 `dist/assets/real image/` 的原始副本，使用 `npm run build -- --emptyOutDir false` 验证；以后素材请放入 `public/assets/`，普通构建会先清空 `dist/`。
