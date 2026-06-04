# hero-blob

页面里放虹彩果冻团子的薄客户端封装。包住 [`blobs`](../blobs/) 的 `BlobScene`，加两层性能保护，让 server component 页面无需自己变成 client 就能放 3D 团子。

## 用法

```tsx
import HeroBlob from "@/components/hero-blob/HeroBlob";

<HeroBlob
  cameraZ={6}
  blobs={[{ shape: "cloud", theme: "candy", position: [3.6, 2, 0], scale: 0.55, motion: {} }]}
/>
```

WebGL 重组件按 components 约定**直接 import 入口文件**（`HeroBlob.tsx`），不走 `index.ts` 桶——以便 `dynamic(ssr:false)` 单独 code-split。桶只出 `BlobSpec` 类型。

## props

- `blobs: BlobSpec[]` —— 团子规格（形状/主题/位置/缩放/动效），透传给 `BlobScene`。
- `cameraZ?: number` —— 相机 z，默认 3；越大视野越广、团子越小。
- `className?: string` —— 透传到外层容器。

## 已知约束 / 性能

- **可见性门控**：`IntersectionObserver { threshold: 0.01 }`，只有真正在屏的那屏持有活的 WebGL context，离开即卸载。多 context 并发约腰斩帧率，故无预热边距。
- **resolution 44**：marching cubes 成本 O(resolution³)/颗/帧，hero 里团子小而软，44 比库默认 72 约 4× 吞吐、肉眼无差。调用点显式传 `resolution` 仍可覆盖。
- 详见根级性能记录：少放并发团子最稳。
