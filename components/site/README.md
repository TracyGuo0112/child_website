# site

站点骨架件:导航栏、页脚、内容页外壳,以及共享的原子组件 / 配色 token / 导航数据。七个路由页共用。

## 用法

```tsx
import { NavBar, Footer, PageShell, SolidBtn, ACCENT, NAV } from "@/components/site";
```

`NavBar` / `Footer` 由根 `app/layout.tsx` 挂载,各页无需手动放。内容页用 `PageShell` 包裹:

```tsx
import { PageShell } from "@/components/site";

export default function Page() {
  return (
    <PageShell eyebrow="场景方案" title="四类设备接入" lead="...">
      {/* 页面内容 */}
    </PageShell>
  );
}
```

## 文件

| 文件 | 端 | 职责 |
|------|----|----|
| `nav.ts` | 纯数据 | `BRAND` + `NAV {label,href}[]`,导航顺序的单一来源 |
| `accent.ts` | 纯 token | `ACCENT` 橙色 ramp,CTA/高亮单一旋钮 |
| `atoms.tsx` | server | `Wordmark`/`SolidBtn`/`LineBtn`/`Eyebrow`,无 hooks |
| `NavBar.tsx` | **client** | 浮动 pill 导航,`usePathname` 高亮当前页 |
| `Footer.tsx` | server | 页脚 + 落地 CTA(半透明象牙玻璃,透出蓝天) |
| `PageShell.tsx` | server | 内容页统一外壳(透明透出蓝天 + 避让 nav + 背景团子 + 标题区) |
| `ShellBlobs.tsx` | **client** | 1 颗角落背景团子,封装 `hero-blob` |
| `SiteBackground.tsx` | server | 全站固定背景(蓝天→暖奶白渐变 + 云白晕 + 两角彩虹缎带),纯 CSS/SVG 零资源,`fixed -z-10` |

## 已知约束

- **桶 vs 路径引用**:`index.ts` 桶含 client 的 `NavBar`。folder 内的 server 件(`Footer`/`PageShell`)**从具体路径**引 `atoms`/`accent`/`nav`,**不经桶**——否则会把 server 件拖进 client bundle。外部页面消费走桶即可。
- **sticky 不被 clip**:`NavBar` 必须挂在非 `overflow-hidden` 的祖先(根 layout 的 `<body>` 直接子节点)。各页的 `overflow-hidden` 只加在页面内部容器。
- **active 高亮**:`/` 精确匹配,其余前缀匹配(留给未来嵌套路由)。
- **全站背景**:`SiteBackground` 由根 layout 挂一次(`fixed -z-10`),覆盖所有路由;`PageShell`/`Footer` 不再铺不透明底色,透出蓝天。改背景只动这一个文件。
