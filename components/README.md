# 组件库 components/

业务站的可复用组件都放这里,**与 `app/` 路由解耦**。每个组件 = 一个自包含文件夹,增删改查就是对文件夹的操作。

## 约定

```
components/<name>/
  index.ts      # 公共出口,对外只认这里;引用走 @/components/<name>
  <Name>.tsx    # 组件实现(可按职责拆多个文件)
  README.md     # 用法 / props / 已知约束
```

- **对外只从 `index.ts` 暴露**,文件夹内部怎么拆分外部不感知,也不依赖内部路径。
- 引用一律 `import { X } from "@/components/<name>"`;不要深 import 内部文件。例外:WebGL 等重组件需 `next/dynamic(ssr:false)` 时直接 import 入口模块,以便单独 code-split。
- 复杂组件按职责继续拆(如 blobs 把数据 `shapes`/`palettes` 与组件分离)。

## 增删改查

| 操作 | 做什么 |
|------|--------|
| 增 | 新建 `components/<name>/`,至少含 `index.ts` 与 `README.md` |
| 删 | 删整个文件夹 + 全局搜 `@/components/<name>` 清理引用 |
| 改 | 只动该文件夹;`index.ts` 出口不变则外部无感 |
| 查 | 浏览本目录,每个文件夹的 README 就是该组件的说明 |

## 现有组件

- **blobs** — 虹彩果冻 3D 装饰团子(React Three Fiber)。详见 [`blobs/README.md`](./blobs/README.md)。
