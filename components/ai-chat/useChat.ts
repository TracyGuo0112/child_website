import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatHandle,
  ChatMessage,
  ChatPhase,
  SessionMessage,
  checkVikingHealth,
  fetchVikingContext,
  requestChat,
  uuidV4,
} from './service';

export type ChatItemStatus = 'loading' | 'updating' | 'success' | 'error' | 'abort';

export interface ChatItem {
  key: number;
  role: 'user' | 'assistant';
  content: string;
  status: ChatItemStatus;
  /** 助手气泡当前所处阶段（检索/读档/生成等），用于在气泡内展示进行状态 */
  phase?: ChatPhase;
  /** 气泡内阶段提示文案（如「🔍 正在检索知识库…」） */
  phaseLabel?: string;
}

/** 会话元信息（本地登记 id/标题/时间，消息内容以服务端记录为准） */
export interface ConversationMeta {
  id: string;
  title: string;
  updatedAt: number;
}

const CONVERSATIONS_KEY = 'aiChatConversations';
const ACTIVE_CONVERSATION_KEY = 'aiChatActiveConversation';
/** 最多保留的历史会话数 */
const MAX_CONVERSATIONS = 30;

function loadConversations(): ConversationMeta[] {
  try {
    const raw = window.localStorage.getItem(CONVERSATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return (parsed as Array<Record<string, unknown>>)
      .filter((c) => !!c && typeof c.id === 'string' && typeof c.title === 'string')
      .map((c) => ({ id: c.id as string, title: c.title as string, updatedAt: Number(c.updatedAt) || 0 }))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_CONVERSATIONS);
  } catch {
    return [];
  }
}

function saveConversations(list: ConversationMeta[]): void {
  try {
    window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
  } catch {
    // 隐私模式等写入失败时忽略
  }
}

/**
 * 多会话对话状态管理：发送、流式更新、会话创建/切换/删除、刷新恢复
 * 消息记录以服务端为准（fetchVikingContext），本地只登记会话列表
 *
 * Next 迁移注：localStorage 读取全部放在挂载 effect 里完成（不放在 state
 * 初始化器），否则静态预渲染与客户端首帧不一致会导致水合告警。
 */
export function useChat() {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const itemsRef = useRef<ChatItem[]>([]);
  const handleRef = useRef<ChatHandle | null>(null);
  const keyRef = useRef(0);
  const activeIdRef = useRef<string | null>(null);
  const conversationsRef = useRef<ConversationMeta[]>(conversations);
  /** 加载序号：会话切换后使旧请求结果失效 */
  const loadSeqRef = useRef(0);
  /** 挂载恢复是否完成：之前不对 activeId 做 localStorage 回写，避免清掉待恢复的记录 */
  const hydratedRef = useRef(false);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);
  useEffect(() => {
    activeIdRef.current = activeId;
    if (!hydratedRef.current) return;
    try {
      if (activeId) window.localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeId);
      else window.localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    } catch {
      // 忽略
    }
  }, [activeId]);

  const updateItem = useCallback((key: number, patch: Partial<ChatItem>) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }, []);

  const finish = useCallback(() => {
    handleRef.current = null;
    setRequesting(false);
    setStatusText('');
  }, []);

  /** 更新/登记会话（新会话以首条提问为标题） */
  const touchConversation = useCallback((id: string, title?: string) => {
    const list = conversationsRef.current.slice();
    const idx = list.findIndex((c) => c.id === id);
    const now = Date.now();
    if (idx >= 0) {
      list[idx] = { ...list[idx], updatedAt: now, title: title || list[idx].title };
    } else if (title) {
      list.unshift({ id, title, updatedAt: now });
    }
    const sorted = list.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CONVERSATIONS);
    conversationsRef.current = sorted;
    setConversations(sorted);
    saveConversations(sorted);
  }, []);

  /** 从服务端拉取会话消息并展示 */
  const loadConversation = useCallback((id: string) => {
    setItems([]);
    setLoadingHistory(true);
    const seq = ++loadSeqRef.current;
    fetchVikingContext(id).then(
      (msgs: SessionMessage[]) => {
        if (seq !== loadSeqRef.current) return;
        setItems(
          msgs.map((m) => ({
            key: ++keyRef.current,
            role: m.role,
            content: m.content,
            status: 'success' as ChatItemStatus,
          })),
        );
        setLoadingHistory(false);
      },
      () => {
        if (seq !== loadSeqRef.current) return;
        setItems([]);
        setLoadingHistory(false);
      },
    );
  }, []);

  // 刷新恢复：挂载后从 localStorage 恢复会话列表，并继续最近一次会话
  useEffect(() => {
    const list = loadConversations();
    conversationsRef.current = list;
    setConversations(list);
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(ACTIVE_CONVERSATION_KEY) || null;
    } catch {
      saved = null;
    }
    hydratedRef.current = true;
    if (saved) {
      setActiveId(saved);
      activeIdRef.current = saved;
      loadConversation(saved);
    }
  }, [loadConversation]);

  /** 健康检查：进入页面先探测 viking 服务是否在线，驱动头部状态展示 */
  const checkBackend = useCallback(async () => {
    const online = await checkVikingHealth();
    setBackendOnline(online);
    return online;
  }, []);

  // 挂载时（含新会话/刷新）首次检测服务在线状态
  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const send = useCallback(
    (text: string) => {
      const value = (text || '').trim();
      if (!value || handleRef.current) return;

      const convId = activeIdRef.current || uuidV4();
      const isNew = convId !== activeIdRef.current;
      if (isNew) {
        setActiveId(convId);
        activeIdRef.current = convId;
      }

      const userKey = ++keyRef.current;
      const aiKey = ++keyRef.current;
      setItems((prev) =>
        prev.concat([
          { key: userKey, role: 'user', content: value, status: 'success' },
          { key: aiKey, role: 'assistant', content: '', status: 'loading' },
        ]),
      );
      setRequesting(true);
      touchConversation(convId, isNew ? value.slice(0, 24) : undefined);

      const history: ChatMessage[] = itemsRef.current
        .filter((it) => it.content && it.status !== 'error')
        .map((it) => ({ role: it.role, content: it.content }))
        .concat([{ role: 'user', content: value }]);

      handleRef.current = requestChat(
        history,
        {
          onStatus: (status) => {
            setStatusText(status);
          },
          onPhase: (phase, label) => {
            // 会话已切换则丢弃
            if (activeIdRef.current !== convId) return;
            const patch: Partial<ChatItem> = { phase };
            if (label !== undefined) patch.phaseLabel = label;
            updateItem(aiKey, patch);
          },
          onChunk: (delta) => {
            if (activeIdRef.current !== convId) return; // 会话已切换，丢弃过期响应
            setItems((prev) =>
              prev.map((it) =>
                it.key === aiKey
                  ? { ...it, content: it.content + delta, status: 'updating' as ChatItemStatus }
                  : it,
              ),
            );
          },
          onFinish: () => {
            if (activeIdRef.current === convId) updateItem(aiKey, { status: 'success', phase: 'done' });
            finish();
          },
          onError: () => {
            // 保留已生成的部分内容，仅在内容为空时展示错误文案
            if (activeIdRef.current !== convId) {
              finish();
              return;
            }
            setItems((prev) =>
              prev.map((it) =>
                it.key === aiKey && !it.content
                  ? { ...it, content: '服务开小差了，请稍后重试', status: 'error' as ChatItemStatus }
                  : it,
              ),
            );
            finish();
          },
          onCancel: () => {
            if (activeIdRef.current === convId) updateItem(aiKey, { status: 'abort' });
            finish();
          },
        },
        convId,
      );
    },
    [finish, touchConversation, updateItem],
  );

  const stop = useCallback(() => {
    if (handleRef.current) handleRef.current.cancel();
  }, []);

  /** 新建会话：清空当前展示，首条提问时真正创建 */
  const newConversation = useCallback(() => {
    if (handleRef.current) handleRef.current.cancel();
    loadSeqRef.current++; // 使未完成的历史加载失效
    setActiveId(null);
    activeIdRef.current = null;
    setItems([]);
    setStatusText('');
  }, []);

  /** 切换到历史会话 */
  const switchConversation = useCallback(
    (id: string) => {
      if (id === activeIdRef.current) return;
      if (handleRef.current) handleRef.current.cancel();
      setActiveId(id);
      activeIdRef.current = id;
      loadConversation(id);
    },
    [loadConversation],
  );

  /** 删除会话记录（仅本地列表，服务端历史仍保留） */
  const deleteConversation = useCallback(
    (id: string) => {
      const list = conversationsRef.current.filter((c) => c.id !== id);
      conversationsRef.current = list;
      setConversations(list);
      saveConversations(list);
      if (id === activeIdRef.current) {
        newConversation();
      }
    },
    [newConversation],
  );

  return {
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
  };
}
