export const BRAND = "喜马拉雅儿童 SDK";

// label = 展示名;href = 真实路由;数组顺序即导航顺序。
// 纯数据,无 "use client",故 server 件(Footer/PageShell)与 client 件(NavBar)可共用。
export const NAV = [
  { label: "首页", href: "/" },
  { label: "场景方案", href: "/scenarios" },
  { label: "核心能力", href: "/capabilities" },
  { label: "Demo 展示", href: "/demo" },
  { label: "接入说明", href: "/integration" },
  { label: "合作流程", href: "/process" },
  { label: "常见问题", href: "/faq" },
] as const;
