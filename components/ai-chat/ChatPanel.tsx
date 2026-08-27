'use client';

import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { Bubble, Prompts, Sender } from '@ant-design/x';
import { RobotOutlined } from '@ant-design/icons';
import { History, Plus, Trash2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ACCENT } from '@/components/site/accent';
import { AI_CHAT_CONFIG } from './config';
import { ConversationMeta, useChat } from './useChat';

/** 站点品牌色（跟随 site/accent 的珊瑚红，与 CTA/导航高亮同源） */
const BRAND_RED = ACCENT.deep;

const aiAvatar = (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: BRAND_RED,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      flexShrink: 0,
    }}
  >
    <RobotOutlined />
  </div>
);

/** 助手气泡内 markdown 的作用域样式（仅作用于 .ai-md，随组件迁移） */
const MD_STYLES = `
.ai-md { font-size: 0.875rem; line-height: 1.7; word-break: break-word; }
.ai-md > :first-child { margin-top: 0; }
.ai-md > :last-child { margin-bottom: 0; }
.ai-md p { margin: 0.5em 0; }
.ai-md h1, .ai-md h2, .ai-md h3, .ai-md h4 { font-weight: 600; margin: 0.8em 0 0.4em; line-height: 1.4; }
.ai-md h1 { font-size: 1.15em; }
.ai-md h2 { font-size: 1.1em; }
.ai-md h3 { font-size: 1em; }
.ai-md h4 { font-size: 0.95em; }
.ai-md ul, .ai-md ol { margin: 0.5em 0; padding-left: 1.4em; }
.ai-md ul { list-style: disc; }
.ai-md ol { list-style: decimal; }
.ai-md li { margin: 0.25em 0; }
.ai-md a { color: ${BRAND_RED}; text-decoration: underline; }
.ai-md blockquote { margin: 0.6em 0; padding: 0.1em 0 0.1em 0.9em; border-left: 3px solid #e4dcd6; color: #5E534C; }
.ai-md hr { border: none; border-top: 1px solid #e2e8f0; margin: 0.8em 0; }
.ai-md code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.85em; background: #f1ece3; border-radius: 4px; padding: 0.15em 0.4em; }
.ai-md pre { background: #362c24; color: #f1ece3; border-radius: 8px; padding: 10px 12px; overflow-x: auto; margin: 0.6em 0; }
.ai-md pre code { background: none; padding: 0; color: inherit; font-size: 0.85em; }
.ai-md table { border-collapse: collapse; margin: 0.6em 0; font-size: 0.9em; max-width: 100%; display: block; overflow-x: auto; }
.ai-md th, .ai-md td { border: 1px solid #e2e8f0; padding: 4px 10px; text-align: left; }
.ai-md th { background: #fdfdf1; font-weight: 600; }

/* 助手思考中占位 */
.ai-thinking { display: inline-flex; align-items: center; gap: 6px; }
.ai-thinking-text { font-size: 0.75rem; color: #94a3b8; }
.ai-thinking-dots { display: inline-flex; gap: 4px; align-items: center; }
.ai-thinking-dots i { width: 5px; height: 5px; border-radius: 50%; background: #94a3b8; animation: ai-dot-bounce 1s infinite ease-in-out; }
.ai-thinking-dots i:nth-child(2) { animation-delay: 0.15s; }
.ai-thinking-dots i:nth-child(3) { animation-delay: 0.3s; }
@keyframes ai-dot-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}
`;

/** 历史会话列表（侧边栏与移动端折叠面板共用） */
const ConversationList: React.FC<{
  conversations: ConversationMeta[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ conversations, activeId, onSelect, onDelete }) => {
  // 记录最近一次复制的会话 id，用于展示「已复制」反馈（完成后自动复位）
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    copyText(id).then((ok) => {
      if (!ok) return;
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
    });
  };

  if (conversations.length === 0) {
    return (
      <div className="text-xs text-slate-400 text-center py-6 px-2 leading-5">
        暂无历史会话
        <br />
        提问后自动记录
      </div>
    );
  }
  return (
    <>
      {conversations.map((c) => (
        <div key={c.id} className="group flex items-center gap-0.5 rounded-lg">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(c.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(c.id);
              }
            }}
            title={`${c.title}\n${c.id}`}
            className={`flex-1 min-w-0 text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              c.id === activeId ? 'text-white' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
            style={c.id === activeId ? { backgroundColor: BRAND_RED } : undefined}
          >
            <div className="text-xs truncate font-medium">{c.title}</div>
            <div className="flex items-center gap-1">
              <span
                className={`text-[10px] truncate leading-4 ${
                  c.id === activeId ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {c.id}
              </span>
              <button
                onClick={(e) => copyId(e, c.id)}
                title="复制会话 ID"
                className={`flex items-center gap-1 text-[10px] leading-4 shrink-0 rounded px-1 transition-colors ${
                  copiedId === c.id
                    ? 'text-emerald-500'
                    : c.id === activeId
                      ? 'text-white/70 hover:text-white'
                      : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Copy size={10} />
                {copiedId === c.id ? '已复制' : '复制'}
              </button>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(c.id);
            }}
            title="删除会话记录"
            className="mr-1 p-1 rounded text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </>
  );
};

/** 降级复制：用隐藏 textarea 走 document.execCommand('copy')，返回是否成功 */
function fallbackCopy(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

/** 复制文本到剪贴板：安全上下文优先用异步 Clipboard API，否则降级 execCommand */
async function copyText(value: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return fallbackCopy(value);
    }
  }
  return fallbackCopy(value);
}

/**
 * 独立对话面板组件（基于 @ant-design/x）
 * 自带主题与状态管理，可整体拷贝到其他 React 项目复用
 */
const ChatPanel: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [copiedActive, setCopiedActive] = useState(false);
  const {
    items,
    requesting,
    statusText,
    loadingHistory,
    backendOnline,
    conversations,
    activeId,
    send,
    stop,
    newConversation,
    switchConversation,
    deleteConversation,
  } = useChat();

  const handleSend = (text: string) => {
    const value = (text || '').trim();
    if (!value) return;
    setInputValue('');
    send(value);
  };

  // 复制当前会话 ID：仅在存在激活会话且有消息会话时展示，避免新建空白态误报
  const copyActive = () => {
    if (!activeId) return;
    copyText(activeId).then((ok) => {
      if (!ok) return;
      setCopiedActive(true);
      window.setTimeout(() => setCopiedActive(false), 1500);
    });
  };

  const bubbleItems = items.map((it) => ({
    key: it.key,
    role: it.role,
    content: it.content,
    status: it.status,
    // 应答未开始输出时展示「思考中」占位（loading 态由 Bubble 内建机制渲染）
    loading: it.status === 'loading',
  }));

  const isEmpty = items.length === 0;

  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: BRAND_RED,
            borderRadius: 12,
            colorText: '#362c24',
            colorBgContainer: '#ffffff',
            fontFamily: 'inherit',
          },
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* <style> 是 raw text 元素：children 方式在 SSR 会把 CSS 里的 ">" 转义成
              &gt;，浏览器解析 style 时不做实体解码，水合时文本不一致会报错——
              必须用 dangerouslySetInnerHTML 走原始文本 */}
          <style dangerouslySetInnerHTML={{ __html: MD_STYLES }} />
          <div className="flex" style={{ height: '72vh', minHeight: 560, maxHeight: 860 }}>
            {/* 会话侧边栏（桌面端） */}
            <aside className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-slate-100 bg-slate-50/60">
              <div className="p-2.5">
                <button
                  onClick={newConversation}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: BRAND_RED }}
                >
                  <Plus size={14} />
                  新会话
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 pb-2.5">
                <ConversationList
                  conversations={conversations}
                  activeId={activeId}
                  onSelect={switchConversation}
                  onDelete={deleteConversation}
                />
              </div>
            </aside>

            {/* 主对话区 */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* 移动端会话操作条 */}
              <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50/60">
                <button
                  onClick={newConversation}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-white"
                  style={{ backgroundColor: BRAND_RED }}
                >
                  <Plus size={12} />
                  新会话
                </button>
                <button
                  onClick={() => setMobileListOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200"
                >
                  <History size={12} />
                  会话记录{conversations.length > 0 ? ` (${conversations.length})` : ''}
                </button>
              </div>
              {mobileListOpen && (
                <div className="md:hidden max-h-44 overflow-y-auto border-b border-slate-100 px-2 py-2 bg-slate-50/60">
                  <ConversationList
                    conversations={conversations}
                    activeId={activeId}
                    onSelect={(id) => {
                      switchConversation(id);
                      setMobileListOpen(false);
                    }}
                    onDelete={deleteConversation}
                  />
                </div>
              )}

              {/* 面板头部 */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            {aiAvatar}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">小雅 AI 客服</div>
              <div className="text-xs text-slate-400 truncate">
                {AI_CHAT_CONFIG.mode === 'mock'
                  ? '演示模式 · 应答内容仅供参考'
                  : AI_CHAT_CONFIG.mode === 'viking'
                    ? '已连接知识库'
                    : '在线'}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
              {activeId ? (
                <button
                  onClick={copyActive}
                  title={activeId}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                    copiedActive ? 'text-emerald-500' : 'hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  {copiedActive ? <Check size={11} /> : <Copy size={11} />}
                  {copiedActive ? '已复制' : '复制 sessionId'}
                </button>
              ) : null}
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: requesting
                    ? '#f59e0b'
                    : backendOnline === false
                      ? '#ef4444'
                      : backendOnline === true
                        ? '#22c55e'
                        : '#94a3b8',
                }}
              />
              {requesting
                ? '思考中'
                : backendOnline === false
                  ? '服务不可用'
                  : backendOnline === true
                    ? '在线'
                    : '检测中'}
            </div>
          </div>

          {/* 消息区 / 空状态 */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isEmpty ? (
              loadingHistory ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">
                  正在加载会话记录…
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center px-6 py-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 text-2xl"
                    style={{ backgroundColor: BRAND_RED }}
                  >
                    <RobotOutlined />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{AI_CHAT_CONFIG.welcome.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 text-center">{AI_CHAT_CONFIG.welcome.description}</p>
                  <Prompts
                    vertical
                    style={{ width: '100%', maxWidth: 420 }}
                    items={AI_CHAT_CONFIG.welcome.prompts.map((p) => ({
                      key: p.key,
                      label: p.label,
                      description: p.description,
                    }))}
                    onItemClick={({ data }) => handleSend(String(data.label || ''))}
                  />
                </div>
              )
            ) : (
              <Bubble.List
                style={{ padding: 16 }}
                autoScroll
                items={bubbleItems}
                // @ant-design/x v1 中该 prop 为 roles（v2 才改名 role）
                roles={{
                  user: {
                    placement: 'end',
                    variant: 'filled',
                    styles: {
                      content: {
                        background: BRAND_RED,
                        color: '#ffffff',
                        borderRadius: 14,
                        borderTopRightRadius: 4,
                      },
                    },
                  },
                  assistant: {
                    placement: 'start',
                    avatar: aiAvatar,
                    variant: 'filled',
                    loadingRender: () => {
                      // 请求中气泡的实时阶段：从 items 找当前处于 searching/reading/generating 的那条
                      const pending = items.find(
                        (x) =>
                          x.role === 'assistant' &&
                          (x.phase === 'searching' || x.phase === 'reading' || x.phase === 'generating'),
                      );
                      return (
                        <span className="ai-thinking">
                          <span className="ai-thinking-text">{pending?.phaseLabel || '思考中'}</span>
                          <span className="ai-thinking-dots">
                            <i />
                            <i />
                            <i />
                          </span>
                        </span>
                      );
                    },
                    messageRender: (content) => (
                      <div className="ai-md">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{String(content || '')}</ReactMarkdown>
                      </div>
                    ),
                    styles: {
                      content: {
                        background: '#f1f5f9',
                        color: '#362c24',
                        borderRadius: 14,
                        borderTopLeftRadius: 4,
                      },
                    },
                  },
                }}
              />
            )}
          </div>

          {/* 实时检索状态栏 */}
          {requesting && statusText ? (
            <div className="flex items-center gap-2 px-5 py-2 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{statusText}</span>
              <span className="ml-auto text-slate-400">可点击停止按钮中断</span>
            </div>
          ) : null}

          {/* 输入区 */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white">
            <Sender
              value={inputValue}
              onChange={(v) => setInputValue(v)}
              onSubmit={handleSend}
              loading={requesting}
              onCancel={stop}
              placeholder="输入你想了解的内容，如：如何接入 SDK？"
            />
            <div className="mt-2 text-center text-xs text-slate-400">内容由 AI 生成，请注意甄别</div>
          </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default ChatPanel;
