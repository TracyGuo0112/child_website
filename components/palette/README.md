# Palette

儿童产品站的配色系统：**暖纸背景 + 一组去饱和「脏系马卡龙」+ 柔和暖墨**。

设计取向：高端童品（Liewood、Konges Sløjd、Lovevery）那种「克制的彩色」——
颜色负责童趣，暖纸和排版负责高级。所有点缀色锁在同一明度／饱和度上，整组才像
「一家人」而不是幼儿园原色大杂烩。

## 文件

| 文件 | 职责 |
|------|------|
| `palette.ts` | 全部 token（背景 / 墨色 / 马卡龙色族）。app 的唯一真源。 |
| `index.ts` | 公共出口，对外只认这里。 |

## token 一览

```
surface.paper   #F7F1DD   页面背景（暖奶油，取自参考图）
surface.raised  #FDFDF1   上浮卡片（冷象牙，比纸面浅、自然「浮起来」）

ink.900  #362C24  标题      ink.700  #5E534C  正文
ink.500  #8E847E  次要/说明  ink.line #E4DCD6  描边/分隔线
```

马卡龙色族，每个色相 4 档：

| 色 | tint 浅底 | soft 标签底 | mid 填充 | deep 文字 |
|----|-----------|-------------|----------|-----------|
| blush 藕粉 | `#FCD4D6` | `#F3BEC1` | `#DF959A` | `#8D4E53` |
| clay 陶土 | `#FAD8C6` | `#EFC3AB` | `#DB9C79` | `#8A5435` |
| mustard 芥黄 | `#EBDFBE` | `#DDCDA1` | `#C2AA68` | `#766122` |
| sage 鼠尾草 | `#CEE8CE` | `#B6D9B6` | `#88BC89` | `#427044` |
| sky 雾霾蓝 | `#C8E4FC` | `#AED3F3` | `#7BB3E2` | `#356890` |
| wisteria 紫藤 | `#E9D8F7` | `#DAC3EC` | `#BE9DD7` | `#725587` |

四档各自的用途：`tint` 卡片／区块背景 · `soft` 标签／chip 背景 ·
`mid` 插画／blob 填充 · `deep` 标签文字（在自家 tint／soft 上可读）。

## 用法

```tsx
import { surface, ink, pastels } from "@/components/palette";

<main style={{ background: surface.paper, color: ink[900] }}>
  <article style={{ background: surface.raised, border: `1px solid ${ink.line}` }}>
    <span style={{ background: pastels.sage.soft, color: pastels.sage.deep }}>启蒙</span>
    <h3 style={{ color: ink[900] }}>感官触觉布书</h3>
    <p style={{ color: ink[700] }}>正文…</p>
  </article>
</main>
```

需要遍历做色卡／分类配色时用 `pastelNames`：

```tsx
import { pastels, pastelNames } from "@/components/palette";
pastelNames.map((name) => pastels[name].mid);
```

## 扩展（改色／加色）

颜色是 OKLCH 派生、APCA 校验后冻结成 hex 的，**不要手挑 hex**——改 OKLCH 规格再重算。

- **加一个色相**：在 `palette.ts` 的 `PastelName` 加名字，按既有 L/C 规格只改色相角 `h`，
  四档分别 `tint .905/.045`、`soft .85/.060`、`mid .745/.090`、`deep .50/.085`。
- **整组更脏／更艳**：统一调四档的 chroma（C）。降 C 更高级、更北欧；升 C 更甜。
- **校验**：正文文字用 `ink.700`（暖纸上 APCA +78）；任意 `deep` 文字放自家 `tint`／`soft`
  上对比度足够（APCA ≥ +50，适合小号粗体标签）。OKLCH／APCA 计算见生成脚本。

## 实现要点 / 已知约束

- **为什么用 OKLCH 不用 HSL**：HSL 非感知均匀，等距明度看着不等距，黄色还会因天生高亮度
  导致对比度崩。OKLCH 锁明度后整组颜色「轻重一致」，这正是和谐感的来源。
- **为什么用 APCA 不只看 WCAG 2.x**：WCAG 2.x 对浅色／黄色判定偏差大；APCA 更贴近实际可读性。
- **背景是取样色、不是生成色**：`paper`／`raised` 来自参考图，刻意保留；其余 token 才是派生。
- 这套是 **UI 设计 token**，与 `components/blobs` 里的 `palettes.ts`（3D 团子的虹彩材质主题）
  是两回事，不要混用。
