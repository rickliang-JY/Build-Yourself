// ============================================================================
//  模板配置 — 改这里就能把它变成你自己的计划
//  TEMPLATE CONFIG — edit this file to make the app your own
// ============================================================================
//
//  常见改法：
//    - 想做 30 天 / 100 天 / 365 天计划：改 totalDays
//    - 换标题、副标题：改 appTitle / tagline
//    - 换主题色：改 theme.accent
//    - 不需要某个板块（比如不健身）：把 sections 里对应项设为 false
//    - 想和别人分开存数据：改 storageKey 成一个独一无二的字符串
//
// ----------------------------------------------------------------------------

export const CONFIG = {
  // 计划总天数。任意正整数：30 / 90 / 100 / 365 ...
  totalDays: 90,

  // 本地存储用的 key。改成不同的值＝开一份全新、互不干扰的记录。
  storageKey: 'growth_plan_v1',

  // 默认语言：'zh' 或 'en'
  defaultLang: 'zh',

  // 标题与副标题（中 / 英）
  appTitle: { zh: '90 天成长计划', en: '90-Day Growth Plan' },
  tagline: { zh: '学习 · 健身 · 饮食 · 每日反思', en: 'Learn · Train · Eat · Reflect' },

  // 首页底部的鼓励语与格言
  encourage: {
    zh: '每天进步一点点，未来会感谢现在的你。',
    en: 'A little progress every day — future you will be grateful.',
  },
  quote: {
    zh: '自律，是通往自由的路。',
    en: 'Discipline is the path to freedom.',
  },

  // 板块开关：不需要的设为 false，对应入口和详情页会自动隐藏
  sections: {
    learning: true,    // 学习总结
    reflection: true,  // 每日反思
    fitness: true,     // 健身打卡
    diet: true,        // 饮食记录（含照片）
    milestones: true,  // 里程碑
    body: true,        // 身体数据（需要 AI 估算）
    weekly: true,      // 每周复盘（AI 生成）
  },

  // 主题色
  theme: {
    accent: '#C2663F',   // 主强调色
    accent2: '#CF9A3F',  // 次强调色（脂肪/趋势线等）
    bg: '#faf9f5',       // 页面背景
    card: '#ffffff',     // 卡片背景
    ink: '#2B2A27',      // 主文字
    sub: '#6f6b62',      // 次文字
    faint: '#9b978d',    // 更弱的文字
    line: '#EAE4D7',     // 分隔/格子底色
  },

  // 是否在首次打开时填充一份示例数据（方便预览）。设为 false 则从空白开始。
  seedSampleData: true,
};
