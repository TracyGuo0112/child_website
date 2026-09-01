import { ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import ChatPanel from "@/components/ai-chat/ChatPanel";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ChatPage() {
  return (
    <main className="min-h-screen px-6 pb-24 pt-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Keep the page title visible when visitors open this route directly. */}
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
