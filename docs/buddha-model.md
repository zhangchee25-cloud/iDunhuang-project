# MAS.853 坐佛数字重建记录

完成日期：2026-10-07。该模型依据馆藏照片生成，不是大英博物馆的三维扫描、实测数据或修复成果。面部形体和背部裂缝深度仍含生成模型的推断，研究或传播中请以原图、馆藏记录为准。

## 输入与原件保护

- 正面：`public/assets/buddha-reference/1144299001.jpg`。
- 背面：`public/assets/buddha-reference/1144300001.jpg`。
- 其余三张原图用于核对形态；原始五张图均未改动。静态展示采用 `1613966443.jpg` 的未修改副本 `public/assets/buddha-real.jpg`。
- 用户批准本地裁切后，正、背面均从 2021 × 2500 裁为 2021 × 2290（框为 `[0, 0, 2021, 2290]`），仅去除底部标尺。背景未用 AI 改写；保存为 `assets/model-sources/buddha/front.png`、`back.png`。逐像素比对与原照片对应裁切区域一致。
- AI 抠图试稿改变了表面纹理，因此没有输入建模服务，也没有进入网站。

## 生成与积分

使用 Tripo 官方 API 的多视图建模。两次成功生成各扣 60 点，共 120 点；开始余额 200 点，结束余额 80 点、冻结 0 点。没有执行额外付费转换、重生成或充值。

| 候选 | 任务编号 | 随机种子 | 实际扣点 | 网页版本 |
| --- | --- | --- | --- | --- |
| 1 | `29949473-60c4-4bfc-bdc0-97ac08e45b61` | 20261007 | 60 | 9,272,576 字节，98,394 三角面 |
| 2（选用） | `542da2fc-0b5f-435c-aa15-f4fb89c8aab6` | 20261008 | 60 | 8,899,732 字节，97,182 三角面 |

选择第二版：浏览器对照中嘴部轮廓更自然，正、背面彩绘及标签可见，体积更小。这是展示效果比较，不代表通过了科学精度测量。两版背部裂缝主要表现为纹理，原件深度不可从两张照片可靠还原。

参数：`model: v3.1-20260211`，`geometry_quality: detailed`，`texture_quality: detailed`，`texture_version: v3.5-20260815`，`texture_alignment: original_image`，`orientation: align_image`，`texture/pbr/delight: true`，`face_limit: 100000`，`quad/smart_low_poly/auto_size: false`。正面和背面分别作为 front/back 输入，同一任务的 model_seed、texture_seed 相同。

官方接口参考：[多视图输入](https://developers.tripo3d.ai/en/docs/generation-multiview-to-model/standard)、[价格说明](https://developers.tripo3d.ai/en/pricing)。这里的积分金额以本次任务实际返回记录和余额为准，不保证未来服务价格不变。

## 本地交付

- 网站模型：`public/assets/buddha.glb`，8.90 MB（十进制），97,182 三角面，52,471 顶点。
- 原始高分辨率 GLB：`assets/models/buddha-high.glb`，16,533,156 字节，不进入发布包。
- 网站版本将三张 4K 内嵌纹理缩至 2048 × 2048：颜色 JPEG、金属粗糙度 JPEG、法线 PNG。保留几何、索引和 UV，不重新减面，不付费转换；JPEG 质量 94，4:4:4。
- 所有纹理内嵌，无运行时海外图片、解码器 CDN 或建模 API 请求。当前 GLB 无扩展依赖。
- 模型 Y 轴向上、正面朝 +X；查看器的 `modelRotationY: -Math.PI / 2` 将其转至 +Z。
- API 密钥仅用于本地生成进程，未保存到项目、网页或发布包。该进程已退出。

## 验证范围

浏览器检查了桌面 1440 × 900 和手机 390 × 844 的 0%、25%、43%、64%、100% 镜头，反向滚动、正背面旋转、缩放、复位、原图切换。手机最后一幕增加横向空间以完整容纳莲座；320 像素页面宽度未出现横向溢出。原有卷轴热点、四页阅读、问答和锚点保留。

实际模型在两个查看器中共享一次加载；验证加载失败、无 WebGL、模拟上下文丢失时回到馆藏照片。减少动画的 JS 分支通过测试页模拟；原生系统设置及真实低端手机仍建议团队现场复核。浏览器尺寸模拟不等于真实手机 GPU 性能测试。

原图 © The Trustees of the British Museum，由团队提供。逐张授权证明尚未提供；公开宣传前须核实原图及衍生模型用途的许可。生成成功本身不授予原图的再利用权。本轮未上传 GitHub、未部署。
