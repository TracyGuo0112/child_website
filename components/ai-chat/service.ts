import { AI_CHAT_CONFIG } from './config';

/**
 * ngrok 免费版会为一个 *.ngrok-free.dev 域名注入「访问提醒」HTML 拦截页，
 * 该页没有 CORS 头，导致浏览器跨域校验失败（未加时常报
 * "No 'Access-Control-Allow-Origin' header"）。加上此自定义头后 ngrok 就不会
 * 注入拦截页，后端原始响应（含 CORS 头）原样返回。所有直连 viking 的 XHR 都要加，
 * 否则对应请求仍会被拦。
 */
const NGROK_SKIP_BROWSER_WARNING = 'ngrok-skip-browser-warning';

type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatHandle {
  /** 中断当前应答 */
  cancel: () => void;
}

/** 应答生命周期阶段：用于在气泡内展示「当前在做什么」 */
export type ChatPhase = 'idle' | 'searching' | 'reading' | 'generating' | 'done';

interface ChatCallbacks {
  /** 流式增量回调 */
  onChunk?: (delta: string) => void;
  /** 阶段状态回调（如「检索中 · 第 2 轮」，应答开始后清空） */
  onStatus?: (status: string) => void;
  /** 阶段变化回调：既给出语义化 phase，也给出用户可读的文案（展示在气泡内） */
  onPhase?: (phase: ChatPhase, label?: string) => void;
  /** 应答完成回调 */
  onFinish?: (fullText: string) => void;
  /** 异常回调 */
  onError?: (error: Error) => void;
  /** 用户主动中断回调（返回已生成的部分内容） */
  onCancel?: (partialText: string) => void;
}

/** 统一对话入口：根据配置分发到 mock 或真实接口适配器；sessionId 用于多会话管理 */
export function requestChat(messages: ChatMessage[], callbacks: ChatCallbacks, sessionId?: string): ChatHandle {
  if (AI_CHAT_CONFIG.mode === 'viking') {
    return requestVikingBot(messages, callbacks, sessionId);
  }
  return requestMock(messages, callbacks);
}

/**
 * 健康检查：探测当前 viking endpoint 的 OpenViking 服务是否在线。
 * /health 无需鉴权，返回 { status, healthy, ... }；健康且 HTTP 2xx 视为在线。
 * 带超时（默认 5s），避免后端不可达时请求长时间挂起。
 */
export function checkVikingHealth(timeoutMs = 5000): Promise<boolean> {
  const { endpoint } = AI_CHAT_CONFIG.viking;
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    // 超时即视为离线
    const timer = setTimeout(() => {
      xhr.abort();
      resolve(false);
    }, timeoutMs);
    xhr.open('GET', endpoint + '/health', true);
    xhr.setRequestHeader(NGROK_SKIP_BROWSER_WARNING, 'true');
    xhr.onload = () => {
      clearTimeout(timer);
      const ok = xhr.status >= 200 && xhr.status < 300;
      let healthy = ok;
      try {
        const data = JSON.parse(xhr.responseText);
        // 优先看 healthy 字段；没有该字段时以 status==='ok' 兜底
        healthy = ok && (data.healthy === true || data.status === 'ok');
      } catch {
        healthy = ok;
      }
      resolve(healthy);
    };
    xhr.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    xhr.onabort = () => {
      clearTimeout(timer);
      resolve(false);
    };
    xhr.send();
  });
}

/** 服务端会话消息（文本部分） */
export interface SessionMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** 拉取某会话的完整消息记录（服务端为唯一来源，含刷新恢复） */
export function fetchVikingContext(sessionId: string): Promise<SessionMessage[]> {
  const { endpoint, apiKey } = AI_CHAT_CONFIG.viking;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // sessionId 可能是裸 UUID（请求时用的），需先经会话列表解析出带命名空间前缀的完整 id
    resolveWithContextId(endpoint, apiKey, sessionId).then(
      (fullId) => {
        if (!fullId) {
          resolve([]);
          return;
        }
        xhr.open('GET', endpoint + '/api/v1/sessions/' + encodeURIComponent(fullId) + '/context', true);
        xhr.setRequestHeader('X-API-Key', apiKey);
        xhr.setRequestHeader(NGROK_SKIP_BROWSER_WARNING, 'true');
        xhr.onload = () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new Error('会话记录获取失败 ' + xhr.status));
            return;
          }
          try {
            const data = JSON.parse(xhr.responseText);
            const messages = (data && data.result && data.result.messages) || [];
            const out: SessionMessage[] = [];
            for (let i = 0; i < messages.length; i++) {
              const m = messages[i];
              if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
              // 只取文本部分，跳过工具调用入参出参
              let text = '';
              const parts = m.parts || [];
              for (let j = 0; j < parts.length; j++) {
                if (parts[j] && parts[j].type === 'text' && typeof parts[j].text === 'string') {
                  text += parts[j].text;
                }
              }
              if (text) {
                out.push({ role: m.role, content: text });
              }
            }
            resolve(out);
          } catch {
            reject(new Error('会话记录解析失败'));
          }
        };
        xhr.onerror = () => reject(new Error('网络异常'));
        xhr.send();
      },
      (err) => reject(err),
    );
  });
}

/** 裸 UUID → 带命名空间前缀的完整会话 id（前缀首次从会话列表解析后缓存） */
let vikingSessionPrefix: string | null = null;

function resolveWithContextId(endpoint: string, apiKey: string, sessionId: string): Promise<string | null> {
  if (vikingSessionPrefix) {
    return Promise.resolve(vikingSessionPrefix + ':' + sessionId);
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint + '/api/v1/sessions', true);
    xhr.setRequestHeader('X-API-Key', apiKey);
    xhr.setRequestHeader(NGROK_SKIP_BROWSER_WARNING, 'true');
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error('会话列表获取失败 ' + xhr.status));
        return;
      }
      try {
        const data = JSON.parse(xhr.responseText);
        const list = ((data && data.result) || []) as Array<Record<string, unknown>>;
        const hit = list.find((it) => {
          const sid = String((it && it.session_id) || '');
          return sid === sessionId || sid.endsWith(':' + sessionId);
        });
        const fullId = hit ? String(hit.session_id) : null;
        if (fullId && fullId.indexOf(':' + sessionId) !== -1) {
          vikingSessionPrefix = fullId.slice(0, fullId.length - sessionId.length - 1);
        }
        resolve(fullId);
      } catch {
        reject(new Error('会话列表解析失败'));
      }
    };
    xhr.onerror = () => reject(new Error('网络异常'));
    xhr.send();
  });
}

/** 演示用内置应答（按提问关键词匹配，内容与站点 faq-data 对齐） */
const MOCK_QA: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['接入', '流程', '怎么接', '如何接', '集成', '申请', '上线', '联调', '交付'],
    answer:
      '接入整体流程：\n1. 通过页面「申请合作」留下信息，商务同学会在 1 个工作日内联系；\n2. 确认合作模式与商务条款后签约；\n3. 我方直接把贵司拉进代码仓库提供 SDK 源码（无需开发板或编译环境）；\n4. 按接口文件适配线程、锁、HTTP、文件 IO 等底层能力并联调；\n5. 报备设备 SN 码后上线，权益随设备发放。',
  },
  {
    keywords: ['硬件', '资源占用', '内存', 'ram', 'rom', '芯片', '系统', '平台', '要求', '适配'],
    answer:
      '硬件门槛很低：无屏纯内容场景 SDK 的 RAM/ROM 各约 70-80KB（带 UI 资源由 UI 图数量决定）。SDK 用标准 C99 编写，与芯片架构和平台无关，支持 RTOS、Linux 等 C 系统，交叉编译工具链不同也没关系；解码和实际播放由贵司自己的播放器实现。',
  },
  {
    keywords: ['家长', '会员', '权益', '支付', '付费', 'vip', '领取'],
    answer:
      '家长端能力：用户拿到 AI 玩具后需领取会员，否则设备不可播放喜马拉雅内容；会员权益随设备发放，支付在小程序/APP（家长端）完成，也支持在设备屏幕展示支付二维码。会员到期或试听结束会通过播放错误回调通知设备端，可用 TTS 引导用户回到家长端续费。',
  },
  {
    keywords: ['账号', '登录', '免登', '绑定', '鉴权', 'token'],
    answer:
      '账号必须走喜马账号体系（法务要求内容以明确账号输出）：标准方案是贵司把用户手机号（加密）传给喜马做服务端静默登录——老用户直接登录，新用户自动注册，用户无感。无屏设备由小程序/APP 端登录产生 token，经贵司通信链路透传到设备端，由 SDK 存入 Flash；refresh token 有效期 30 天。',
  },
  {
    keywords: ['内容', '版权', '曲库', '故事', '儿歌', '专辑', 'url', '直链'],
    answer:
      '接入后可获得全量儿童版权内容库，覆盖儿歌、故事、国学、科普等品类。版权合规要求不能直接暴露 URL：SDK 在设备端维护播放列表实现连播，并内置鉴权、缓存、断点续播等逻辑。',
  },
  {
    keywords: ['商务', '合作', '收费', '价格', '资质', '签约', '联系'],
    answer:
      '商务合作流程很简单：点击页面顶部「申请合作」或通过页脚联系方式留下您的信息，商务同学会在 1 个工作日内与您联系，沟通合作模式、资质要求与商务条款。也可以先浏览「高频问题」页了解更多细节。',
  },
];

const MOCK_FALLBACK_ANSWER =
  '我是喜马拉雅儿童 SDK 的演示助手，目前处于演示模式，暂时只能介绍接入流程、硬件要求、家长端会员、账号鉴权与商务合作等相关话题。您可以点击输入框上方的快捷提问，或换个问题试试～';

function pickMockAnswer(question: string): string {
  const q = (question || '').toLowerCase();
  for (const item of MOCK_QA) {
    if (item.keywords.some((k) => q.indexOf(k) !== -1)) {
      return item.answer;
    }
  }
  return MOCK_FALLBACK_ANSWER;
}

/** mock 实现：定时器模拟流式输出，可随时中断 */
function requestMock(messages: ChatMessage[], callbacks: ChatCallbacks): ChatHandle {
  const lastQuestion = [...messages].reverse().find((m) => m.role === 'user');
  const answer = pickMockAnswer(lastQuestion ? lastQuestion.content : '');
  let canceled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let full = '';

  const emit = () => {
    if (canceled) return;
    if (full.length >= answer.length) {
      timer = null;
      if (callbacks.onFinish) callbacks.onFinish(full);
      return;
    }
    const delta = answer.slice(full.length, full.length + 2);
    full += delta;
    if (callbacks.onChunk) callbacks.onChunk(delta);
    timer = setTimeout(emit, 16);
  };
  // 先模拟首字延迟
  timer = setTimeout(emit, 600);

  return {
    cancel: () => {
      canceled = true;
      if (timer) clearTimeout(timer);
      if (callbacks.onCancel) callbacks.onCancel(full);
    },
  };
}

/** 兼容低版本浏览器的 UUID v4 生成（服务端 session_id 字段要求 UUID 格式） */
export function uuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * VikingBot（OpenViking 知识库）对话流适配器
 * 协议要点（POST {endpoint}/bot/v1/chat/stream，SSE）：
 * - 请求头 X-API-Key；请求体 { message, session_id }，多轮上下文由服务端按 session_id 维护
 * - 过程事件 event: tool_call / tool_result / iteration（检索与迭代过程）
 * - 最终事件 event: response，data.content 为一次性全文（无增量 delta），这里切片模拟打字机
 */
/** 常用检索工具的用户可读名称（用于过程状态展示） */
const VIKING_TOOL_LABELS: Record<string, string> = {
  auto_memory_search: '检索记忆',
  openviking_search: '搜索知识库',
  openviking_list: '浏览资源目录',
  openviking_multi_read: '读取文档',
};

/** VikingBot SSE 事件（宽松结构，字段按需判型） */
interface VikingStreamEvent {
  event?: string;
  data?: string | { content?: unknown };
}

/** 阶段 → 用户可读文案（气泡内展示用） */
const PHASE_LABEL: Record<ChatPhase, string> = {
  idle: '',
  searching: '🔍 正在检索知识库…',
  reading: '📖 正在查阅相关资料…',
  generating: '✍️ 正在组织回答…',
  done: '',
};

function requestVikingBot(messages: ChatMessage[], callbacks: ChatCallbacks, sessionId?: string): ChatHandle {
  const { endpoint, apiKey, statusText } = AI_CHAT_CONFIG.viking;
  const lastQuestion = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastQuestion) {
    if (callbacks.onError) callbacks.onError(new Error('没有可发送的提问'));
    return { cancel: () => {} };
  }
  // 会话 id 由外部（useChat）维护并透传；未传时服务端自行新开会话（JSON.stringify 会剔除 undefined）

  // 阶段状态机：把离散 SSE 事件归并成稳定的 phase，并同步推送用户可读文案
  let phase: ChatPhase = 'idle';
  const setPhase = (next: ChatPhase, label?: string) => {
    if (phase === next) return;
    phase = next;
    if (callbacks.onPhase) callbacks.onPhase(next, label ?? PHASE_LABEL[next]);
  };

  const xhr = new XMLHttpRequest();
  let canceled = false;
  let typeTimer: ReturnType<typeof setTimeout> | null = null;
  let responseReceived = false;
  let consumed = 0;
  let lineBuffer = '';

  const handleLine = (line: string) => {
    if (!line || line.indexOf('data:') !== 0) return;
    const payload = line.slice(5).trim();
    if (!payload) return;
    let evt: VikingStreamEvent;
    try {
      evt = JSON.parse(payload);
    } catch {
      return;
    }
    if (evt.event === 'tool_call') {
      // 检索可能耗时较久，把过程翻译成用户可读的实时状态
      const raw = String(evt.data || '');
      const name = raw.split('(')[0];
      // openviking_search 属于检索；openviking_multi_read/list 属于读取文档
      const next: ChatPhase = name === 'openviking_search' || name === 'auto_memory_search' ? 'searching' : 'reading';
      setPhase(next, '🔍 ' + (VIKING_TOOL_LABELS[name] || '检索知识库') + '…');
      if (callbacks.onStatus) callbacks.onStatus(PHASE_LABEL[next]);
      return;
    }
    if (evt.event === 'tool_result') {
      setPhase('reading', '📖 正在查阅相关资料…');
      if (callbacks.onStatus) callbacks.onStatus(PHASE_LABEL.reading);
      return;
    }
    if (evt.event === 'iteration') {
      const m = /Iteration (\d+)/.exec(String(evt.data || ''));
      const label = m ? '🔍 检索中 · 第 ' + m[1] + ' 轮' : PHASE_LABEL.searching;
      setPhase('searching', label);
      if (callbacks.onStatus) callbacks.onStatus(label);
      return;
    }
    if (evt.event === 'response' && typeof evt.data === 'object' && evt.data && typeof evt.data.content === 'string') {
      responseReceived = true;
      setPhase('generating', '✍️ 正在组织回答…');
      if (callbacks.onStatus) callbacks.onStatus(PHASE_LABEL.generating);
      // 全文一次性到达，切片成打字机效果
      const full = evt.data.content;
      let index = 0;
      const typeOut = () => {
        if (canceled) return;
        if (index >= full.length) {
          typeTimer = null;
          setPhase('done');
          if (callbacks.onFinish) callbacks.onFinish(full);
          return;
        }
        const delta = full.slice(index, index + 3);
        index += 3;
        if (callbacks.onChunk) callbacks.onChunk(delta);
        typeTimer = setTimeout(typeOut, 16);
      };
      typeTimer = setTimeout(typeOut, 0);
    }
  };

  xhr.open('POST', endpoint + '/bot/v1/chat/stream', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'text/event-stream');
  xhr.setRequestHeader('X-API-Key', apiKey);
  xhr.setRequestHeader(NGROK_SKIP_BROWSER_WARNING, 'true');

  xhr.onprogress = () => {
    const chunk = xhr.responseText.slice(consumed);
    consumed = xhr.responseText.length;
    const lines = (lineBuffer + chunk).split('\n');
    lineBuffer = lines.pop() || '';
    for (let i = 0; i < lines.length; i++) {
      handleLine(lines[i].replace(/\r$/, ''));
    }
  };
  xhr.onload = () => {
    if (lineBuffer) {
      handleLine(lineBuffer.replace(/\r$/, ''));
      lineBuffer = '';
    }
    if (canceled) return;
    if (xhr.status < 200 || xhr.status >= 300) {
      let detail = '接口返回状态码 ' + xhr.status;
      try {
        const err = JSON.parse(xhr.responseText);
        if (err && err.error && err.error.message) detail = err.error.message;
      } catch {
        // 非 JSON 错误体，使用默认文案
      }
      if (callbacks.onError) callbacks.onError(new Error(detail));
      return;
    }
    if (!responseReceived) {
      if (callbacks.onError) callbacks.onError(new Error('服务未返回应答内容'));
    }
  };
  xhr.onerror = () => {
    if (!canceled && callbacks.onError) callbacks.onError(new Error('网络异常，请稍后重试'));
  };

  xhr.send(JSON.stringify({ message: lastQuestion.content, session_id: sessionId }));
  // 请求发出即给出初始状态（首个事件前通常有数秒空窗）
  setPhase('searching', statusText);
  if (callbacks.onStatus) callbacks.onStatus(statusText);

  return {
    cancel: () => {
      canceled = true;
      if (typeTimer) clearTimeout(typeTimer);
      xhr.abort();
      setPhase('done');
      if (callbacks.onCancel) callbacks.onCancel('');
    },
  };
}
