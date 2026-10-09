# Netlify 发布记录

- 公开网址：https://idunhuang-digital-journey-2026.netlify.app
- 项目 ID：`01fc9fbc-3930-48c6-95da-1b6176f447bf`
- 首次生产部署 ID：`6ac6f790831c8543c64e166b`
- 部署详情：https://app.netlify.com/projects/idunhuang-digital-journey-2026/deploys/6ac6f790831c8543c64e166b
- 发布方式：本机正式构建后上传静态文件，不连接 GitHub 自动部署。
- 当前验收状态：账号所有者已设为 Public。2026 年 10 月 8 日复核时，不带登录信息的 18 个页面与资源请求全部返回 HTTP 200；首页标题正确，坐佛 GLB 的 SHA-256 与本地文件一致。此验证不等于所有校园网与移动网络均已实测。

构建配置在根目录 `netlify.toml`。执行 `npm run build:netlify` 会先检查 TypeScript，再生成 `sites/netlify-dist/`。构建脚本只复制运行需要的图片、队徽和 GLB，不清空或改写原有 `dist/` 和原始素材。

## 后续更新

```sh
npm test
npm run build:netlify
npx netlify-cli deploy --prod --no-build --dir sites/netlify-dist --site 01fc9fbc-3930-48c6-95da-1b6176f447bf
```

本机 Netlify 项目绑定保存在被忽略的 `.netlify/state.json`，不要提交账号配置或令牌。如果换电脑，使用 Netlify 官方登录授权，再用上面的项目 ID 发布，不重复创建站点。修改本地源码不会自动更新已发布页面。

本次新增 Netlify 入口不修改既有 Codex Sites 站点，不生成新模型，也不消耗 Tripo 积分。网页用于非商业教育学习，保留馆藏署名与使用条件。国内校园网与微信内置浏览器的可达性需由访问者实测，不能仅凭部署成功保证。
