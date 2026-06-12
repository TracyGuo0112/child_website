export const BRAND = "喜马拉雅儿童 SDK 说明文档";

// 单页站：label = 展示名；href = 页内锚点（对应各 section 的 id），数组顺序即
// 导航顺序，也是页面 section 的排列顺序。
// 纯数据,无 "use client",故 server 件(Footer)与 client 件(NavBar)可共用。
export const NAV = [
  { label: "首页", href: "#hero" },
  { label: "方案概述", href: "#overview" },
  { label: "整体架构", href: "#architecture" },
  { label: "家长端能力", href: "#parent" },
  { label: "玩具端 SDK", href: "#toy" },
  { label: "约束与数据", href: "#constraints" },
  { label: "合作流程", href: "#process" },
] as const;
