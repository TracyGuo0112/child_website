/**
 * AI 客服模块配置（自 aiot-open-platform/components/ai-chat 迁移）
 * 后续接入内部大模型服务时，只需调整本文件（协议非现有实现时再在 service.ts 补充适配器）
 *
 * 机密配置说明：viking 的 api key 不在前端，浏览器访问独立部署的 qa-gateway
 * （sdk-QA-agent/qa-gateway，Fastify），由网关服务端转发到 viking 并隐藏密钥。
 * 对话走 /stream、/context，健康检查走 /health（均相对 GATEWAY_BASE）。
 */
export interface AiChatPrompt {
  key: string;
  label: string;
  description: string;
}

export interface AiChatConfig {
  /** 服务模式：mock-内置演示应答；viking-VikingBot 知识库对话流 */
  mode: 'mock' | 'viking';
  /** 网关配置：浏览器跨域访问独立部署的 qa-gateway（Fastify 服务） */
  gateway: {
    /** 网关基地址，如 'http://localhost:3400'，实际拼接 /stream /context /health */
    apiBase: string;
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

// 网关地址：sdk-QA-agent/qa-gateway（Fastify），默认监听 3400。
// 本地开发指向 http://localhost:3400；部署后改用对外可达的公网地址（nginx/Caddy 反代）。
const GATEWAY_BASE = 'http://120.48.82.100:3400';
// const GATEWAY_BASE = 'http://localhost:3400';

export const AI_CHAT_CONFIG: AiChatConfig = {
  mode: 'viking',
  gateway: {
    apiBase: GATEWAY_BASE,
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
