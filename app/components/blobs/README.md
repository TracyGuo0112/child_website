# Gummy Blobs

复刻 [UG Labs](https://onepagelove.com/ug-labs) 那种「虹彩果冻软糖」3D 元素,用 React Three Fiber 实现。纯代码、零外部素材(无 HDRI、无模型文件),配色与形状全部数据驱动。

## 文件结构

| 文件 | 职责 |
|------|------|
| `shapes.ts` | 形状拓扑（metaball 融球摆位）+ 每形状默认上色方式。**只放几何，不放颜色。** |
| `palettes.ts` | 配色主题（色板）+ 种子变体逻辑。**只放颜色，不放几何。** |
| `GummyBlob.tsx` | 单个团子组件。一个可定位/缩放的 `MarchingCubes` mesh + 物理透射材质 + 呼吸动画。 |
| `BlobScene.tsx` | 容器：一个 `<Canvas>` + 一套共享光照，渲染任意多个团子（一个 WebGL context）。 |

形状（拓扑）和配色（主题）是两个正交维度，各自独立扩展，互不影响。

## 快速使用

```tsx
import dynamic from "next/dynamic";
// WebGL 不能 SSR
const BlobScene = dynamic(() => import("@/app/components/blobs/BlobScene"), { ssr: false });

<div style={{ width: 400, height: 400 }}>
  <BlobScene
    cameraZ={3}
    blobs={[{ shape: "splat", theme: "sunset" }]}
  />
</div>
```

多个团子摆在一个 context 里（hero 区那种漂浮布局）：

```tsx
<BlobScene
  cameraZ={6}
  blobs={[
    { shape: "cloud",  theme: "reference", position: [-2, 1, 0],  scale: 0.6 },
    { shape: "star",   theme: "aurora",    position: [2, -1, 0],  scale: 0.5, speed: 1.2 },
    { shape: "pebble", theme: "candy",     position: [0, 2, -1], scale: 0.4 },
  ]}
/>
```

## GummyBlob props

`BlobScene` 的 `blobs[]` 每一项就是一份 `GummyBlobProps`（`BlobSpec = GummyBlobProps`），所以下面所有参数在 scene 里也能直接用。

| prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `shape` | `ShapeName` | （必填） | `cloud` `splat` `donut` `star` `pebble` `pill` |
| `theme` | `ThemeName` | `reference` | `reference` `sunset` `ocean` `candy` `aurora` `bubblegum` |
| `seed` | `number` | `0` | 在同一主题内换取色顺序，产生不同变体 |
| `coloring` | `"ramp" \| "confetti"` | 按形状 | `ramp`=沿 Y 轴渐变流色；`confetti`=随机斑块。覆盖形状默认值 |
| `position` | `[x,y,z]` | `[0,0,0]` | 世界坐标布局（共享 canvas 里摆位） |
| `scale` | `number` | `1` | 视觉大小 |
| `spread` | `number` | `0.95` | 融球摆开程度（越大越松散，过大会超出融球场） |
| `speed` | `number` | `1` | 动画速度倍率 |
| `resolution` | `number` | `72` | 网格精度。小团子可降到 ~40 省性能，hero 特写可升 |
| `maxPolyCount` | `number` | `20000` | 多边形上限 |
| `material` | `Partial<MeshPhysicalMaterialParameters>` | — | 浅合并到默认果冻材质（见下方陷阱） |
| `motion` | `MotionConfig \| false` | 默认幅度 | 动画幅度，或 `false` 完全静止 |

`MotionConfig`：`{ breathe?, bob?, wobble?, drift? }`，任一设 0 可单独关掉某层运动。

## BlobScene props

| prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `blobs` | `BlobSpec[]` | （必填） | 要渲染的团子列表 |
| `cameraZ` | `number` | `3` | 相机距离（越大视野越广，可塞更多/更小团子） |
| `fov` | `number` | `42` | 视场角 |
| `background` | `string \| null` | `null` | 场景背景色；`null` 透明（页面底色透出来） |
| `exposure` | `number` | `1.1` | ACES 色调映射曝光 |
| `lights` | `ReactNode` | 默认彩色棚光 | 整体替换光照（自定义时**必须含 `<Environment>`**，否则透射材质没有反射可采样） |
| `className` | `string` | — | 透传到 `<Canvas>` |

## 扩展

- **加形状**：在 `shapes.ts` 的 `ShapeName` 联合类型加名字，在 `SHAPES` 加融球摆位数组，在 `SHAPE_COLORING` 指定默认上色方式。坐标在世界空间 `[-1,1]`（融球场范围），球保持在 `~[-0.7,0.7]` 内避免裁切。
- **加主题**：在 `palettes.ts` 的 `ThemeName` 加名字，在 `THEMES` 加一组从低到高的色板（亮色高饱和效果最好）。

## 实现要点 / 已知约束

- **质感 = 物理透射材质**：`MeshPhysicalMaterial` 的 `transmission`（透光次表面）+ `iridescence`（虹彩薄膜）+ 代码生成的彩色 `Environment`（提供锐利高光与菲涅尔边缘光）。matcap 做不出透光，已弃用。
- **为什么直接用 three-stdlib 的 `MarchingCubes` 而不是 drei 的 `<MarchingCube>`**：drei 包装用**绝对世界坐标**喂融球场，mesh 一旦为布局平移，球就被顶出 `[-1,1]` 场。本组件直接在本地场坐标手动 `addBall`，于是 mesh 的 `position`/`scale` 与喂球完全解耦——这才让「一个 Canvas 摆多个团子」成立。
- **呼吸不能用 `group.scale`**：同上原因，缩放会破坏融球场。呼吸是「脉动 `spread`」实现的（所有瓣同步内外移动）。
- **性能**：每个 `BlobScene` 是一个 WebGL context。优先把多个团子塞进**一个** scene（传 `blobs[]` + `position`），而不是开多个 scene。软件渲染（如无 GPU 的截图环境）单页 context 数有上限，真机无此限。
- **`material` prop 的引用陷阱**：它进 `useMemo([material])`。若每次渲染传**新对象字面量**（`material={{ roughness: 0.5 }}`），会每帧重建材质 → 卡顿/泄漏。要自定义材质，请把对象提到组件外或用 `useMemo` 固定引用。不传则所有团子共享一个默认材质实例（最省）。
