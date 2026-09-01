# 喜马拉雅儿童 SDK 说明文档

这是面向第三方 AI 玩具厂商的喜马拉雅儿童内容接入说明站。页面用于对外介绍接入方案、家长端能力、玩具端 SDK 能力、合作流程，并公开提供技术文档和 AI 客服。

当前项目以静态站点方式部署到 nginx 子路径：

- 正式入口：[https://api.ximalaya.com/xmly-iot-api/device/url/doc/children-sdk](https://api.ximalaya.com/xmly-iot-api/device/url/doc/children-sdk)
- 正式站点实际路径：`http://120.48.82.100:8889/child_website/`
- v2 验证路径：`http://120.48.82.100:8889/child_website_v2/`

## 技术栈

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Three.js / React Three Fiber，用于首页的 3D 果冻团子视觉
- antd + @ant-design/x，用于 `/chat` AI 客服对话面板（模块在 `components/ai-chat/`）
- `output: "export"` 静态导出，发布产物在 `out/`

## 本地开发

```bash
npm install
npm run dev
```

本地访问：

```text
http://localhost:3000
```

本地开发时没有 basePath，路由直接是 `/`、`/docs`、`/blobs`。

## 常用命令

```bash
# 本地开发
npm run dev

# 构建正式站点，默认 basePath 为 /child_website
npm run build

# 构建 v2 验证站点
DEPLOY_BASE_PATH=/child_website_v2 npm run build
```

构建时会把 basePath 写进静态资源和页面链接。正式站和 v2 站必须分别构建，不能复用同一个 `out/`。

## 目录结构

```text
app/
  page.tsx                 首页，按锚点串起各章节
  docs/page.tsx            技术文档入口页
  faq/page.tsx             高频问题页
  chat/page.tsx            AI 客服页
  sections/                首页各方案章节
  hero/                    首页首屏视觉

components/
  site/                    导航、页脚、背景、按钮、文档弹窗
  ai-chat/                 AI 客服对话模块（自 aiot-open-platform 迁移，基于 antd + @ant-design/x）
  blobs/                   3D 果冻团子核心实现
  hero-blob/               团子在页面中的轻封装
  palette/                 UI 配色 token

public/
  brand/                   logo、商务二维码
  diagrams/                架构图和流程图
  docs/                    可下载 PDF 文档
```

## 页面与内容

- 首页章节顺序由 `app/page.tsx` 和 `components/site/nav.ts` 共同决定。
- 导航锚点对应各 section 的 `id`，例如 `#overview`、`#architecture`、`#parent`。
- 商务二维码弹窗在 `components/site/ApplyBtn.tsx`。
- 当前商务二维码使用 `public/brand/bd-wechat.jpg`。
- `public/brand/bd-wechat.png` 是之前的袁敏二维码，保留在仓库里但当前页面不引用。

## 技术文档页

技术文档页位于 `/docs`，当前展示五份 PDF：

- `public/docs/xmly-sdk-c-v2.7.pdf`
- `public/docs/xmly-miniapp-v2.0.4.pdf`
- `public/docs/xmly-app-android.pdf`
- `public/docs/xmly-app-harmonyos.pdf`
- `public/docs/xmly-app-ios.pdf`

文档列表和版本号在 `app/docs/page.tsx` 中维护。

`/docs`、其中的 PDF 文档以及 `/chat` 均为公开内容，无需 appkey 或登录即可访问。

## 替换资源

### 替换商务二维码

1. 替换或新增 `public/brand/bd-wechat.jpg`。
2. 如果图片尺寸变化，同步修改 `components/site/ApplyBtn.tsx` 里的 `width` 和 `height`。
3. 执行 `npm run build`。
4. 部署到目标路径并校验线上图片地址。

### 替换 PDF

1. 把 PDF 放到 `public/docs/`。
2. 更新 `app/docs/page.tsx` 中的 `meta` 和 `file`。
3. 如果旧 PDF 不再使用，从 `public/docs/` 删除。
4. 执行对应路径的构建和部署。

## 部署

当前部署方式是构建静态文件，然后上传到服务器版本目录，最后切换 `current` 软链接。

### 正式站 `/child_website`

```bash
npm run build

VERSION=child_website-$(date +%Y%m%d%H%M%S)
ssh root@120.48.82.100 "mkdir -p /usr/share/nginx/html/child_website/$VERSION"
rsync -az --delete out/ root@120.48.82.100:/usr/share/nginx/html/child_website/$VERSION/
ssh root@120.48.82.100 "ln -sfn /usr/share/nginx/html/child_website/$VERSION /usr/share/nginx/html/child_website/current"
```

校验：

```bash
curl -I -L https://api.ximalaya.com/xmly-iot-api/device/url/doc/children-sdk
curl -I http://120.48.82.100:8889/child_website/brand/bd-wechat.jpg
```

正式入口会 302 到 `http://120.48.82.100:8889/child_website/#hero`。

### v2 站 `/child_website_v2`

```bash
DEPLOY_BASE_PATH=/child_website_v2 npm run build

VERSION=child_website_v2-$(date +%Y%m%d%H%M%S)
ssh root@120.48.82.100 "mkdir -p /usr/share/nginx/html/child_website_v2/$VERSION"
rsync -az --delete out/ root@120.48.82.100:/usr/share/nginx/html/child_website_v2/$VERSION/
ssh root@120.48.82.100 "ln -sfn /usr/share/nginx/html/child_website_v2/$VERSION /usr/share/nginx/html/child_website_v2/current"
```

校验：

```bash
curl -I -L http://120.48.82.100:8889/child_website_v2/
```

### 回滚

服务器会保留历史版本目录。需要回滚时，把 `current` 重新指向旧版本：

```bash
ssh root@120.48.82.100 "ln -sfn /usr/share/nginx/html/child_website/旧版本目录 /usr/share/nginx/html/child_website/current"
```

v2 站同理替换为 `/usr/share/nginx/html/child_website_v2/...`。

## 路径配置说明

`next.config.mjs` 当前以 nginx 子路径部署为准：

- 生产默认：`/child_website`
- v2 覆盖：`DEPLOY_BASE_PATH=/child_website_v2`
- 本地开发：空 basePath

如果要改成 Vercel 根路径或其他根路径部署，需要先调整 `next.config.mjs`，并重新检查所有使用 `NEXT_PUBLIC_BASE_PATH` 的图片和链接。

## 维护注意事项

- 不要把 `out/`、`.next/`、`node_modules/` 提交进仓库。
- 改导航时同时检查桌面导航、移动端导航和页脚导航。
- 改资源路径后一定要重新构建；静态导出会把路径写进生成后的 JS。
- 技术文档和 AI 客服均为公开入口，不要在其中放置高敏感资料。
