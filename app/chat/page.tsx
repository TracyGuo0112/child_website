"use client";

import { useEffect, useState } from "react";
import { ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { hasDocsPass } from "@/components/site/docs-keys";
import ChatPanel from "@/components/ai-chat/ChatPanel";

// AI 客服已收归技术文档体系：与 /docs 一样需要 appkey 验证才能使用。软门控逻辑
// 与 docs/page.tsx 完全一致——无验证直接访问时弹回首页并让 NavBar 打开验证弹窗
// (?docs=1)。验证成功后落地 /docs（其中已内嵌本客服）。不可从客户端组件导出
// metadata，标签页标题回退到 layout 默认，与 /docs 一致，属既定取舍。
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ChatPage() {
  // 门控在客户端：挂载后才能读 sessionStorage。
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (hasDocsPass()) {
      setAllowed(true);
    } else {
      // 无验证：弹回首页并请 NavBar 重新打开验证弹窗
      window.location.replace(`${base}/?docs=1`);
    }
  }, []);

  // 验证通过前不渲染，避免跳转前闪现页面
  if (allowed !== true) return null;

  return (
    <main className="min-h-screen px-6 pb-24 pt-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* 独立工具页，深链需页面内定位，故自带标题 */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold lg:text-3xl" style={{ color: ink[900] }}>
            AI 客服
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed lg:text-base" style={{ color: ink[700] }}>
            与小雅实时对话，咨询儿童 SDK 接入、硬件适配、家长端会员与合作流程等问题，
            也可以先浏览
            <a href={`${base}/faq`} className="font-medium hover:opacity-70" style={{ color: ACCENT.deep }}>
              高频问题
            </a>
            页。
          </p>
        </header>
        <ChatPanel />
      </div>
    </main>
  );
}
