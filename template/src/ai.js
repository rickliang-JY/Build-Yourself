// OpenAI-compatible AI client.
// Works with any provider that exposes POST {baseURL}/chat/completions:
// OpenAI, DeepSeek, Moonshot/Kimi, 通义, Together, Groq, local LLMs, etc.
// Claude can be reached via an OpenAI-compatible gateway/proxy too.

const SETTINGS_KEY = 'growth_plan_ai_settings_v1';

export const AI_PRESETS = [
  { id: 'openai', name: 'OpenAI (GPT)', baseURL: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { id: 'deepseek', name: 'DeepSeek', baseURL: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { id: 'moonshot', name: 'Moonshot / Kimi', baseURL: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
  { id: 'dashscope', name: '通义千问 (DashScope)', baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  { id: 'siliconflow', name: 'SiliconFlow 硅基流动', baseURL: 'https://api.siliconflow.cn/v1', model: 'deepseek-ai/DeepSeek-V3' },
  { id: 'custom', name: '自定义 / Custom', baseURL: '', model: '' },
];

export function loadAISettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { baseURL: '', apiKey: '', model: '', preset: 'deepseek' };
}

export function saveAISettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) {}
}

export function isAIConfigured() {
  const s = loadAISettings();
  return !!(s.baseURL && s.apiKey && s.model);
}

// Returns the assistant message text. Throws on error.
export async function chatComplete({ system, prompt, temperature = 0.6, signal }) {
  const s = loadAISettings();
  if (!s.baseURL || !s.apiKey || !s.model) {
    throw new Error('AI 未配置：请先在「AI 设置」里填入 Base URL、API Key 和模型名。');
  }
  const url = s.baseURL.replace(/\/+$/, '') + '/chat/completions';
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + s.apiKey,
    },
    body: JSON.stringify({ model: s.model, messages, temperature, stream: false }),
    signal,
  });

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 300); } catch (e) {}
    throw new Error('AI 请求失败 (' + res.status + ') ' + detail);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string') throw new Error('AI 返回格式异常');
  return text.trim();
}
