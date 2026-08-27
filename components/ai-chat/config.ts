/**
 * AI 客服模块配置（自 aiot-open-platform/components/ai-chat 迁移）
 * 后续接入内部大模型服务时，只需调整本文件（协议非现有实现时再在 service.ts 补充适配器）
 */
export interface AiChatPrompt {
  key: string;
  label: string;
  description: string;
}

export interface AiChatConfig {
  /** 服务模式：mock-内置演示应答；viking-VikingBot 知识库对话流 */
  mode: 'mock' | 'viking';
  /** VikingBot（OpenViking 知识库）配置（mode 为 viking 时生效） */
  viking: {
    /** 服务根地址，如 http://localhost:8933 */
    endpoint: string;
    apiKey: string;
    /** 检索阶段的过渡提示文案（首个 tool_call 事件时展示） */
    statusText: string;
  };
  /** 空状态欢迎信息与快捷提问 */
  welcome: {
    title: string;
    description: string;
    prompts: AiChatPrompt[];
  };
}

export const AI_CHAT_CONFIG: AiChatConfig = {
  mode: 'viking',
  viking: {
    endpoint: 'https://lazily-jugular-flip.ngrok-free.dev',
    apiKey: 'ZGVmYXVsdA.YWRtaW4.ZTkzNzU4Y2MwNzY5ZjIyYzMxNzc5NGM4YjU4Njg3ZGZiOWE2MTJmZmE4YWJkOTcyYTBkZjdiOTY2ZTcxNDJjOA',
    statusText: '🔍 正在检索知识库…',
  },
  welcome: {
    title: '你可以这样问我',
    description: '支持流式对话，也可以直接点击下方快捷提问体验',
    prompts: [
      { key: 'process', label: '如何接入 SDK？', description: '从签约到上线的完整流程' },
      { key: 'hardware', label: '硬件有什么要求？', description: '资源占用与系统适配' },
      { key: 'parent', label: '家长端能管理什么？', description: '会员权益 · 账号绑定' },
      { key: 'business', label: '如何开始商务合作？', description: '对接方式与联系方式' },
    ],
  },
};
