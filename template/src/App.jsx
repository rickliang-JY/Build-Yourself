import React from 'react';
import { CONFIG } from './config.js';
import { chatComplete, loadAISettings, saveAISettings, isAIConfigured, AI_PRESETS } from './ai.js';
import { loadSettings, saveSettings, defaultSettings } from './settings.js';
import { renderApp } from './render.jsx';

const T = CONFIG.theme;
const N = CONFIG.totalDays;

export default class App extends React.Component {
  KEY = CONFIG.storageKey;
  LKEY = CONFIG.storageKey + '_lang';
  settings = loadSettings();

  L = {
    zh: {
      langSwitch: '中 / EN', tagline: CONFIG.tagline.zh, appTitle: CONFIG.appTitle.zh,
      ofTotal: '/ 共 ' + N + ' 天', kStreak: '连续打卡', streakUnit: '天', kCompletion: '总体完成率',
      kProgress: N + ' 天进度', back: '返回', viewAll: '查看全部 →', viewAllPhotos: '照片墙 →',
      history: '历史记录', today: '今天', aiAssistant: 'AI 助手', generating: '思考中…',
      secLearning: '学习总结', secReflection: '每日反思', secFitness: '健身打卡', secDiet: '今日饮食',
      secMilestone: '里程碑', secBody: '身体数据', doneBadge: '已完成', notDone: '未完成',
      colMove: '动作', colSets: '组 × 次', colWeight: '重量', cardioLabel: '有氧',
      addMove: '+ 添加动作', addMeal: '+ 添加一餐', addMile: '+ 添加里程碑',
      weightLabel: '体重', waistLabel: '腰围',
      reflectQ: '今天我学到了什么？哪里还能做得更好？',
      encourage: CONFIG.encourage.zh, quote: CONFIG.quote.zh,
      saved: '已自动保存到本地', reset: '重置为示例数据',
      weeklyReview: '每周复盘', weeklyTitle: '每周复盘', weeklySub: '综合你过去 7 天的学习、训练、饮食与反思。',
      bodyMap: '身体成分示意图', bodyHint: 'AI 估算，颜色越深表示该部位含量越高（可切换 肌肉 / 脂肪）', muscleMode: '肌肉', fatMode: '脂肪', bodyFatLabel: '体脂率', muscleLabel: '肌肉量', trend: '变化趋势', btnEstimate: '让 AI 估算 / 更新今日身体数据', bodyNote: 'AI 基于体重、腰围、训练与饮食估算，非精确测量；每次评估生成一个时间点。',
      todayMeals: '今天 · 记录与照片', addPhoto: '添加照片',
      photoNote: '提示：AI 基于你填写的文字说明给点评，不会读取照片本身。',
      bodyPhoto: '今日身体照片', addBodyPhoto: '添加身体照片', bodyPhotoWall: '身体变化记录',
      bodyPhotoNote: '记录每天的身体状态，照片仅存在本机浏览器，不会上传。', noBodyPhotos: '还没有身体照片，在上方添加第一张吧。',
      btnPoints: '提炼要点', btnQuiz: '出小测验', btnTomorrow: '明日重点',
      btnCoach: 'AI 反思教练：追问 + 鼓励', btnFitness: '给下次训练建议', btnDiet: '营养点评', btnWeekly: '生成每周复盘',
      phTopic: '今天的主题…', phBody: '写下今天的学习总结…', phReflect: '写下你的反思，督促自己成长…',
      phMove: '动作名称', phCardio: '例如 跑步 20 分钟', phMeal: '吃了什么…', phMile: '里程碑',
      weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      titles: { learning: '学习总结', reflection: '每日反思', fitness: '健身打卡', diet: '饮食记录', weekly: '每周复盘' },
      dayWord: '第 ', dayWordEnd: ' 天',
      aiSettings: 'AI 设置', export: '导出备份', import: '导入备份',
      aiBaseURL: 'Base URL（接口地址）', aiKey: 'API Key', aiModel: '模型名', aiPreset: '服务商预设',
      aiSave: '保存', aiClose: '关闭', aiTip: '密钥只存在你本机浏览器，不会上传。',
      aiNotConfigured: '请先配置 AI（点右上角「AI 设置」）。',
      importDone: '导入成功！', importFail: '导入失败：文件格式不对。',
      settings: '计划设置', settingsTitle: '计划设置',
      setBasics: '基本信息', setSections: '启用的板块', setMilestones: '里程碑节点', setDanger: '危险操作',
      fTotalDays: '计划总天数', fStartDate: '开始日期', fTitleZh: '标题（中文）', fTitleEn: '标题（英文）',
      fTaglineZh: '副标题（中文）', fTaglineEn: '副标题（英文）', fEncourage: '鼓励语（中文）', fQuote: '格言（中文）',
      settingsSaved: '设置已保存', settingsTip: '这些设置保存在本机浏览器，导出备份不包含设置。',
      milestoneTagHint: '标签（如 D30）', milestoneTextHint: '里程碑内容', milestoneSubHint: '备注',
      dayDetailReflection: '反思', dayDetailLearning: '学习', dayDetailFitness: '训练', dayDetailDiet: '饮食',
      emptyDay: '这一天还没有记录。',
    },
    en: {
      langSwitch: '中 / EN', tagline: CONFIG.tagline.en, appTitle: CONFIG.appTitle.en,
      ofTotal: '/ of ' + N, kStreak: 'Streak', streakUnit: 'days', kCompletion: 'Completion',
      kProgress: N + '-Day Progress', back: 'Back', viewAll: 'View all →', viewAllPhotos: 'Photo wall →',
      history: 'History', today: 'Today', aiAssistant: 'AI Assistant', generating: 'Thinking…',
      secLearning: 'Learning Summary', secReflection: 'Daily Reflection', secFitness: 'Fitness Check-in', secDiet: "Today's Meals",
      secMilestone: 'Milestones', secBody: 'Body Metrics', doneBadge: 'Done', notDone: 'Not done',
      colMove: 'Exercise', colSets: 'Sets × Reps', colWeight: 'Weight', cardioLabel: 'Cardio',
      addMove: '+ Add exercise', addMeal: '+ Add a meal', addMile: '+ Add milestone',
      weightLabel: 'Weight', waistLabel: 'Waist',
      reflectQ: 'What did I learn today? Where can I do better?',
      encourage: CONFIG.encourage.en, quote: CONFIG.quote.en,
      saved: 'Auto-saved on this device', reset: 'Reset to sample data',
      weeklyReview: 'Weekly review', weeklyTitle: 'Weekly Review', weeklySub: 'A synthesis of your last 7 days of learning, training, diet and reflection.',
      bodyMap: 'Body Composition', bodyHint: 'AI estimate — darker = more of it (toggle Muscle / Fat)', muscleMode: 'Muscle', fatMode: 'Fat', bodyFatLabel: 'Body fat', muscleLabel: 'Muscle', trend: 'Trend', btnEstimate: 'Let AI estimate / update today', bodyNote: 'AI estimates from weight, waist, training and diet — not a precise measurement; each estimate adds a time point.',
      todayMeals: 'Today · log & photos', addPhoto: 'Add photo',
      photoNote: 'Note: the AI comments on your text descriptions — it does not read the photos themselves.',
      bodyPhoto: "Today's body photo", addBodyPhoto: 'Add body photo', bodyPhotoWall: 'Body progress',
      bodyPhotoNote: 'Log your body each day — photos stay in this browser and are never uploaded.', noBodyPhotos: 'No body photos yet — add your first one above.',
      btnPoints: 'Key points', btnQuiz: 'Quiz me', btnTomorrow: "Tomorrow's focus",
      btnCoach: 'AI coach: probe + encourage', btnFitness: 'Suggest next session', btnDiet: 'Nutrition feedback', btnWeekly: 'Generate weekly review',
      phTopic: "Today's topic…", phBody: "Write today's learning summary…", phReflect: 'Write your reflection to push your growth…',
      phMove: 'Exercise name', phCardio: 'e.g. Run 20 min', phMeal: 'What you ate…', phMile: 'Milestone',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      titles: { learning: 'Learning Summary', reflection: 'Daily Reflection', fitness: 'Fitness', diet: 'Diet Log', weekly: 'Weekly Review' },
      dayWord: 'Day ', dayWordEnd: '',
      aiSettings: 'AI Settings', export: 'Export', import: 'Import',
      aiBaseURL: 'Base URL', aiKey: 'API Key', aiModel: 'Model', aiPreset: 'Provider preset',
      aiSave: 'Save', aiClose: 'Close', aiTip: 'Your key is stored only in this browser, never uploaded.',
      aiNotConfigured: 'Configure AI first (top-right "AI Settings").',
      importDone: 'Import successful!', importFail: 'Import failed: bad file format.',
      settings: 'Plan Settings', settingsTitle: 'Plan Settings',
      setBasics: 'Basics', setSections: 'Enabled sections', setMilestones: 'Milestones', setDanger: 'Danger zone',
      fTotalDays: 'Total days', fStartDate: 'Start date', fTitleZh: 'Title (Chinese)', fTitleEn: 'Title (English)',
      fTaglineZh: 'Subtitle (Chinese)', fTaglineEn: 'Subtitle (English)', fEncourage: 'Encouragement (Chinese)', fQuote: 'Quote (Chinese)',
      settingsSaved: 'Settings saved', settingsTip: 'Settings are stored in this browser; data export does not include them.',
      milestoneTagHint: 'Tag (e.g. D30)', milestoneTextHint: 'Milestone text', milestoneSubHint: 'Note',
      dayDetailReflection: 'Reflection', dayDetailLearning: 'Learning', dayDetailFitness: 'Training', dayDetailDiet: 'Diet',
      emptyDay: 'No entry for this day yet.',
    },
  };

  RNAME = { zh: { shoulders: '肩', chest: '胸', arms: '手臂', abs: '核心', back: '背', legs: '腿', glutes: '臀' }, en: { shoulders: 'Shoulders', chest: 'Chest', arms: 'Arms', abs: 'Core', back: 'Back', legs: 'Legs', glutes: 'Glutes' } };
  REGIONS = ['shoulders', 'chest', 'arms', 'abs', 'back', 'legs', 'glutes'];

  iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  today = this.iso(new Date());

  emptyRecord() { return { learning: { topic: '', body: '', tagA: '', tagB: '', time: '' }, reflection: { answer: '' }, fitness: { done: false, exercises: [], cardio: '', weight: '', waist: '', bodyPhotoId: null }, diet: { meals: [] } }; }

  defaultData() {
    const base = new Date();
    if (!CONFIG.seedSampleData) {
      const records = {}; records[this.today] = this.emptyRecord();
      return { startDate: this.today, records, milestones: [], bodySnapshots: [] };
    }
    const topics = ['React 状态管理 & 系统设计', 'TypeScript 类型体操', '数据库索引原理', '算法：动态规划', '系统设计：缓存一致性', '操作系统：并发与锁', 'TCP 拥塞控制'];
    const bodies = ['复盘 useReducer 与 Context 的组合，沉淀出可复用的状态机模式。', '练习条件类型与映射类型，弄懂了 infer 的用法。', 'B+ 树为什么适合磁盘索引：减少 IO 并支持有序扫描。', '背包问题的状态定义与滚动数组优化。', '缓存与库的一致性：先更新库再删缓存，配合延时双删。', '互斥锁、信号量与死锁的四个必要条件。', '慢启动、拥塞避免与快速重传的完整过程。'];
    const refl = ['理解了状态下放的取舍，明天用真实页面验证这套模式。', '类型体操有趣但要克制，可读性优先。', '把索引原理和真实慢查询联系起来更有体感。', '动归的关键是状态定义，多画表格。', '一致性没有银弹，按业务选方案。', '并发 bug 难复现，要靠模型而非直觉。', '把网络过程画成时序图记得更牢。'];
    const sessions = [
      [{ name: '卧推', scheme: '4 × 6', weight: '60 kg' }, { name: '坐姿推举', scheme: '3 × 10', weight: '24 kg' }, { name: '绳索下压', scheme: '3 × 12', weight: '25 kg' }],
      [{ name: '硬拉', scheme: '3 × 5', weight: '100 kg' }, { name: '杠铃划船', scheme: '4 × 8', weight: '60 kg' }, { name: '二头弯举', scheme: '3 × 12', weight: '14 kg' }],
      [{ name: '杠铃深蹲', scheme: '4 × 8', weight: '80 kg' }, { name: '罗马尼亚硬拉', scheme: '3 × 10', weight: '70 kg' }, { name: '提踵', scheme: '4 × 15', weight: '40 kg' }],
    ];
    const cardios = ['跑步 · 20 分钟', '划船机 · 15 分钟', '快走 · 25 分钟'];
    const baseMeals = () => [{ label: '早餐', items: '燕麦 + 水煮蛋 ×2 + 黑咖啡', photoId: null }, { label: '午餐', items: '鸡胸肉 + 糙米饭 + 西兰花', photoId: null }, { label: '晚餐', items: '三文鱼 + 时蔬沙拉 + 红薯', photoId: null }];
    const records = {};
    for (let i = 0; i < 7; i++) {
      const d = this.iso(this.addDays(base, -i));
      records[d] = {
        learning: { topic: topics[i], body: bodies[i], tagA: '前端', tagB: '系统设计', time: '专注 2 小时' },
        reflection: { answer: refl[i] },
        fitness: { done: true, exercises: sessions[i % 3].map(x => Object.assign({}, x)), cardio: cardios[i % 3], weight: (72.4 + i * 0.1).toFixed(1), waist: '81' },
        diet: { meals: baseMeals() },
      };
    }
    const mkSnap = (off, bf, mm, k) => ({ date: this.iso(this.addDays(base, off)), bodyFat: bf, muscleMass: mm, regions: { shoulders: { muscle: 40 + k, fat: 36 - k }, chest: { muscle: 46 + k, fat: 38 - k }, arms: { muscle: 44 + k, fat: 30 - k }, abs: { muscle: 38 + k, fat: 52 - k }, back: { muscle: 52 + k, fat: 34 - k }, legs: { muscle: 58 + k, fat: 42 - k }, glutes: { muscle: 50 + k, fat: 44 - k } }, note: '' });
    return {
      startDate: this.iso(this.addDays(base, -23)),
      records,
      milestones: [
        { tag: '✓', text: '启动计划', sub: '第 1 天', done: true },
        { tag: 'D30', text: '完成第一阶段复盘', sub: '进行中', done: false },
        { tag: 'D60', text: '阶段目标', sub: '进行中', done: false },
        { tag: 'D' + this.settings.totalDays, text: '最终目标', sub: '终点', done: false },
      ],
      bodySnapshots: [mkSnap(-21, 19.4, 55.6, 0), mkSnap(-14, 18.5, 56.4, 5), mkSnap(-7, 17.6, 57.2, 10), mkSnap(-1, 16.8, 58.1, 15)],
    };
  }

  loadData() {
    try { const r = localStorage.getItem(this.KEY); if (r) { const d = JSON.parse(r); if (!d.records[this.today]) d.records[this.today] = this.emptyRecord(); if (!d.bodySnapshots) d.bodySnapshots = []; if (!d.milestones) d.milestones = []; return d; } } catch (e) {}
    return this.defaultData();
  }
  loadLang() { try { return localStorage.getItem(this.LKEY) || CONFIG.defaultLang; } catch (e) { return CONFIG.defaultLang; } }

  constructor(props) {
    super(props);
    this.state = {
      data: this.loadData(),
      lang: this.loadLang(),
      view: 'home',
      ai: {},
      bodyMode: 'muscle',
      aiOpen: false,
      aiForm: loadAISettings(),
      toast: '',
      settings: this.settings,
      dayKey: null,
      dayBack: 'home',
    };
  }

  photoUrls = {};
  loadingPhotos = {};
  setRoot = (el) => { this.root = el; };
  setPhotoInput = (el) => { this.photoInput = el; };

  persist = () => { try { localStorage.setItem(this.KEY, JSON.stringify(this.state.data)); } catch (e) {} };
  setData = (fn) => this.setState(s => ({ data: fn(s.data) }), this.persist);

  setPath(obj, path, val) {
    const keys = path.split('.');
    const root = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);
    let cur = root;
    for (let i = 0; i < keys.length - 1; i++) { const k = keys[i]; cur[k] = Array.isArray(cur[k]) ? cur[k].slice() : Object.assign({}, cur[k]); cur = cur[k]; }
    cur[keys[keys.length - 1]] = val;
    return root;
  }
  onField = (e) => {
    const f = e.target.dataset.field, v = e.target.value;
    if (e.target.tagName === 'TEXTAREA') { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }
    this.setData(d => this.setPath(d, f, v));
  };
  updateToday(fn) { this.setData(d => { const recs = Object.assign({}, d.records); recs[this.today] = fn(Object.assign({}, recs[this.today])); return Object.assign({}, d, { records: recs }); }); }
  toggleFitness = () => this.updateToday(r => Object.assign({}, r, { fitness: Object.assign({}, r.fitness, { done: !r.fitness.done }) }));
  addEx = () => this.updateToday(r => Object.assign({}, r, { fitness: Object.assign({}, r.fitness, { exercises: r.fitness.exercises.concat([{ name: '', scheme: '', weight: '' }]) }) }));
  addMeal = () => this.updateToday(r => Object.assign({}, r, { diet: Object.assign({}, r.diet, { meals: r.diet.meals.concat([{ label: '', items: '', photoId: null }]) }) }));
  removeEx(i) { this.updateToday(r => Object.assign({}, r, { fitness: Object.assign({}, r.fitness, { exercises: r.fitness.exercises.filter((_, j) => j !== i) }) })); }
  removeMeal(i) { this.updateToday(r => Object.assign({}, r, { diet: Object.assign({}, r.diet, { meals: r.diet.meals.filter((_, j) => j !== i) }) })); }
  addMs = () => this.setData(d => Object.assign({}, d, { milestones: d.milestones.concat([{ tag: 'D', text: '', sub: '', done: false }]) }));
  removeMs(i) { this.setData(d => Object.assign({}, d, { milestones: d.milestones.filter((_, j) => j !== i) })); }
  toggleMs(i) { this.setData(d => { const a = d.milestones.slice(); a[i] = Object.assign({}, a[i], { done: !a[i].done }); return Object.assign({}, d, { milestones: a }); }); }

  reset = () => {
    const msg = this.state.lang === 'zh' ? '确定要重置为示例数据吗？当前记录会被覆盖。' : 'Reset to sample data? Current entries will be replaced.';
    if (window.confirm(msg)) this.setData(() => this.defaultData());
    setTimeout(this.autosize, 40);
  };
  toggleLang = () => this.setState(s => ({ lang: s.lang === 'zh' ? 'en' : 'zh' }), () => { try { localStorage.setItem(this.LKEY, this.state.lang); } catch (e) {} });
  setView = (v) => this.setState({ view: v }, () => { window.scrollTo(0, 0); setTimeout(this.autosize, 40); });
  autosize = () => { if (this.root) this.root.querySelectorAll('textarea').forEach(ta => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }); };
  componentDidMount() { this.autosize(); }

  // ---- per-day detail navigation ----
  openDay = (iso) => this.setState(s => ({ view: 'day', dayKey: iso, dayBack: s.view === 'day' ? s.dayBack : s.view }), () => window.scrollTo(0, 0));

  // ---- plan settings ----
  openSettings = () => this.setState({ view: 'settings' }, () => window.scrollTo(0, 0));
  updateSettings = (fn) => { const ns = fn(this.settings); this.settings = ns; saveSettings(ns); this.setState({ settings: ns }); };
  onSetting = (path) => (e) => { const val = e.target.value; this.updateSettings(s => this.setPath(s, path, val)); };
  onSettingNum = (path) => (e) => { const val = Math.max(1, parseInt(e.target.value, 10) || 1); this.updateSettings(s => this.setPath(s, path, val)); };
  toggleSection = (k) => this.updateSettings(s => Object.assign({}, s, { sections: Object.assign({}, s.sections, { [k]: !s.sections[k] }) }));
  setStartDate = (e) => { const v = e.target.value; if (v) this.setData(d => Object.assign({}, d, { startDate: v })); setTimeout(this.autosize, 40); };

  // ---- export / import ----
  exportData = () => {
    const payload = { app: 'build-yourself', version: 1, key: this.KEY, exportedAt: new Date().toISOString(), data: this.state.data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (CONFIG.appTitle.en || 'plan').replace(/\s+/g, '-') + '-' + this.today + '.json';
    a.click(); URL.revokeObjectURL(url);
  };
  setImportInput = (el) => { this.importInput = el; };
  triggerImport = () => { if (this.importInput) this.importInput.click(); };
  onImport = async (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    try {
      const txt = await f.text();
      const obj = JSON.parse(txt);
      const data = obj.data || obj;
      if (!data || !data.records) throw new Error('bad');
      if (!data.records[this.today]) data.records[this.today] = this.emptyRecord();
      if (!data.bodySnapshots) data.bodySnapshots = [];
      if (!data.milestones) data.milestones = [];
      this.setData(() => data);
      this.toast(this.L[this.state.lang].importDone);
      setTimeout(this.autosize, 40);
    } catch (err) {
      this.toast(this.L[this.state.lang].importFail);
    }
  };
  toast(msg) { this.setState({ toast: msg }); clearTimeout(this._toastT); this._toastT = setTimeout(() => this.setState({ toast: '' }), 2500); }

  // ---- AI settings ----
  openAI = () => this.setState({ aiOpen: true, aiForm: loadAISettings() });
  closeAI = () => this.setState({ aiOpen: false });
  onAIPreset = (e) => {
    const p = AI_PRESETS.find(x => x.id === e.target.value) || {};
    this.setState(s => ({ aiForm: Object.assign({}, s.aiForm, { preset: p.id, baseURL: p.baseURL || s.aiForm.baseURL, model: p.model || s.aiForm.model }) }));
  };
  onAIField = (k) => (e) => { const v = e.target.value; this.setState(s => ({ aiForm: Object.assign({}, s.aiForm, { [k]: v }) })); };
  saveAI = () => { saveAISettings(this.state.aiForm); this.setState({ aiOpen: false }); };

  // ---- photos (IndexedDB) ----
  openDB() {
    if (this._db) return this._db;
    this._db = new Promise((res, rej) => { const r = indexedDB.open(this.KEY + '_photos', 1); r.onupgradeneeded = () => r.result.createObjectStore('p'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    return this._db;
  }
  idbPut(id, blob) { return this.openDB().then(db => new Promise((res, rej) => { const tx = db.transaction('p', 'readwrite'); tx.objectStore('p').put(blob, id); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); })); }
  idbGet(id) { return this.openDB().then(db => new Promise((res, rej) => { const tx = db.transaction('p', 'readonly'); const q = tx.objectStore('p').get(id); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); })); }
  ensurePhoto(id) {
    if (!id || this.photoUrls[id] || this.loadingPhotos[id]) return;
    this.loadingPhotos[id] = true;
    this.idbGet(id).then(blob => { if (blob) { this.photoUrls[id] = URL.createObjectURL(blob); this.forceUpdate(); } }).catch(() => {});
  }
  downscale(file) {
    return new Promise((res) => {
      const url = URL.createObjectURL(file); const img = new Image();
      img.onload = () => {
        const max = 1100, sc = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * sc), h = Math.round(img.height * sc);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob(b => res(b), 'image/jpeg', 0.82);
      };
      img.onerror = () => res(null);
      img.src = url;
    });
  }
  askPhoto(i) { this.pendingPhoto = { type: 'meal', i }; if (this.photoInput) this.photoInput.click(); }
  askBodyPhoto = () => { this.pendingPhoto = { type: 'body' }; if (this.photoInput) this.photoInput.click(); };
  onPhoto = async (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    const blob = await this.downscale(f); if (!blob) return;
    const id = 'ph_' + Date.now() + Math.random().toString(36).slice(2, 6);
    await this.idbPut(id, blob);
    this.photoUrls[id] = URL.createObjectURL(blob);
    const p = this.pendingPhoto || { type: 'meal', i: 0 };
    if (p.type === 'body') {
      this.updateToday(r => Object.assign({}, r, { fitness: Object.assign({}, r.fitness, { bodyPhotoId: id }) }));
    } else {
      this.updateToday(r => { const meals = r.diet.meals.slice(); meals[p.i] = Object.assign({}, meals[p.i], { photoId: id }); return Object.assign({}, r, { diet: Object.assign({}, r.diet, { meals }) }); });
    }
  };
  removePhoto(i) { this.updateToday(r => { const meals = r.diet.meals.slice(); meals[i] = Object.assign({}, meals[i], { photoId: null }); return Object.assign({}, r, { diet: Object.assign({}, r.diet, { meals }) }); }); }
  removeBodyPhoto = () => this.updateToday(r => Object.assign({}, r, { fitness: Object.assign({}, r.fitness, { bodyPhotoId: null }) }));

  // ---- AI calls ----
  setAi(key, val) { this.setState(s => ({ ai: Object.assign({}, s.ai, { [key]: Object.assign({}, s.ai[key], val) }) })); }
  async callAI(key, prompt) {
    const lang = this.state.lang;
    if (!isAIConfigured()) { this.setAi(key, { busy: false, text: this.L[lang].aiNotConfigured }); this.openAI(); return; }
    const sys = lang === 'zh' ? '你是一个中性、理性的成长教练。回答简洁、具体、可执行，使用中文，不要寒暄，可用短句或分点。' : 'You are a neutral, rational growth coach. Be concise, specific and actionable. Answer in English, no pleasantries, use short lines or bullets.';
    this.setAi(key, { busy: true });
    try {
      const text = await chatComplete({ system: sys, prompt });
      this.setAi(key, { busy: false, text: (text || '').trim() });
    } catch (e) {
      this.setAi(key, { busy: false, text: (lang === 'zh' ? 'AI 调用失败：' : 'AI request failed: ') + (e.message || e) });
    }
  }

  inline(s) {
    const parts = (s || '').split('**'); const els = [];
    parts.forEach((p, i) => { if (p === '') return; els.push(i % 2 ? React.createElement('strong', { key: i }, p) : p); });
    return els;
  }
  mdEl(text) {
    if (!text) return null;
    const out = [];
    text.split('\n').forEach((ln, i) => {
      let s = ln.trim();
      if (s === '') { out.push(React.createElement('div', { key: i, style: { height: '7px' } })); return; }
      let level = 0; while (s[0] === '#') { level++; s = s.slice(1); } s = s.trim();
      let bullet = false;
      if (/^[-*]\s+/.test(s)) { bullet = true; s = s.replace(/^[-*]\s+/, ''); }
      else if (/^\d+[.)]\s+/.test(s)) { bullet = true; s = s.replace(/^\d+[.)]\s+/, ''); }
      const kids = this.inline(s);
      if (level > 0) out.push(React.createElement('div', { key: i, style: { fontWeight: 700, fontSize: level <= 1 ? '15px' : '14px', margin: '12px 0 4px', color: T.ink } }, kids));
      else if (bullet) out.push(React.createElement('div', { key: i, style: { display: 'flex', gap: '8px', margin: '4px 0' } }, [React.createElement('span', { key: 'b', style: { color: T.accent, flex: 'none' } }, '•'), React.createElement('span', { key: 't' }, kids)]));
      else out.push(React.createElement('div', { key: i, style: { margin: '4px 0' } }, kids));
    });
    return React.createElement('div', {}, out);
  }
  cleanMd(text) {
    if (!text) return '';
    return text.split('\n').map(ln => {
      let s = ln.replace(/\*\*/g, '').replace(/`/g, '');
      s = s.replace(/^\s*#{1,6}\s*/, '');
      s = s.replace(/^\s*[-*]\s+/, '·  ');
      return s;
    }).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  mix(c1, c2, t) {
    const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    const r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t);
    const g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
    const bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }

  buildBody(snap, mode) {
    const base = '#EAE2D2', accent = mode === 'fat' ? T.accent2 : T.accent;
    const col = (region) => {
      if (!region || !snap || !snap.regions || !snap.regions[region]) return base;
      const v = Math.max(0, Math.min(100, +snap.regions[region][mode] || 0));
      return this.mix(base, accent, 0.16 + 0.84 * v / 100);
    };
    const shapes = [
      ['circle', null, { cx: 120, cy: 40, r: 21 }],
      ['rect', 'shoulders', { x: 73, y: 66, width: 26, height: 19, rx: 9 }], ['rect', 'shoulders', { x: 141, y: 66, width: 26, height: 19, rx: 9 }],
      ['rect', 'chest', { x: 97, y: 72, width: 21, height: 25, rx: 6 }], ['rect', 'chest', { x: 122, y: 72, width: 21, height: 25, rx: 6 }],
      ['rect', 'arms', { x: 66, y: 88, width: 16, height: 38, rx: 7 }], ['rect', 'arms', { x: 158, y: 88, width: 16, height: 38, rx: 7 }],
      ['rect', 'abs', { x: 101, y: 101, width: 38, height: 54, rx: 8 }],
      ['rect', 'arms', { x: 61, y: 128, width: 14, height: 38, rx: 6 }], ['rect', 'arms', { x: 165, y: 128, width: 14, height: 38, rx: 6 }],
      ['rect', 'legs', { x: 99, y: 162, width: 19, height: 70, rx: 8 }], ['rect', 'legs', { x: 122, y: 162, width: 19, height: 70, rx: 8 }],
      ['rect', 'legs', { x: 101, y: 238, width: 16, height: 58, rx: 7 }], ['rect', 'legs', { x: 123, y: 238, width: 16, height: 58, rx: 7 }],
      ['circle', null, { cx: 320, cy: 40, r: 21 }],
      ['rect', 'back', { x: 294, y: 66, width: 52, height: 44, rx: 10 }],
      ['rect', 'arms', { x: 266, y: 88, width: 16, height: 38, rx: 7 }], ['rect', 'arms', { x: 358, y: 88, width: 16, height: 38, rx: 7 }],
      ['rect', 'arms', { x: 261, y: 128, width: 14, height: 38, rx: 6 }], ['rect', 'arms', { x: 365, y: 128, width: 14, height: 38, rx: 6 }],
      ['rect', 'glutes', { x: 298, y: 114, width: 44, height: 28, rx: 9 }],
      ['rect', 'legs', { x: 299, y: 146, width: 19, height: 62, rx: 8 }], ['rect', 'legs', { x: 322, y: 146, width: 19, height: 62, rx: 8 }],
      ['rect', 'legs', { x: 301, y: 214, width: 16, height: 56, rx: 7 }], ['rect', 'legs', { x: 323, y: 214, width: 16, height: 56, rx: 7 }],
    ];
    const els = shapes.map((sh, i) => React.createElement(sh[0], Object.assign({ key: i, fill: col(sh[1]), stroke: '#D8CDB6', strokeWidth: 1 }, sh[2])));
    const labels = [
      React.createElement('text', { key: 'lf', x: 120, y: 314, fill: T.faint, fontSize: 11, textAnchor: 'middle' }, this.state.lang === 'zh' ? '正面' : 'Front'),
      React.createElement('text', { key: 'lb', x: 320, y: 314, fill: T.faint, fontSize: 11, textAnchor: 'middle' }, this.state.lang === 'zh' ? '背面' : 'Back'),
    ];
    return React.createElement('svg', { viewBox: '40 10 360 320', style: { width: '100%', maxWidth: '440px', display: 'block', margin: '0 auto' } }, els.concat(labels));
  }

  buildLegend(snap) {
    const names = this.RNAME[this.state.lang], lang = this.state.lang;
    const bar = (v, color) => React.createElement('div', { style: { flex: 1, height: '7px', background: '#EFE8DA', borderRadius: '4px', overflow: 'hidden' } }, React.createElement('div', { style: { width: Math.max(0, Math.min(100, v)) + '%', height: '100%', background: color } }));
    const head = React.createElement('div', { style: { display: 'flex', gap: '8px', fontSize: '10px', color: T.faint, margin: '0 0 4px', letterSpacing: '.08em', textTransform: 'uppercase' } }, [
      React.createElement('span', { key: 'a', style: { width: '40px', flex: 'none' } }, ''),
      React.createElement('span', { key: 'm', style: { flex: 1 } }, lang === 'zh' ? '肌肉' : 'Muscle'),
      React.createElement('span', { key: 'f', style: { flex: 1 } }, lang === 'zh' ? '脂肪' : 'Fat'),
    ]);
    const rows = this.REGIONS.map(r => {
      const reg = (snap && snap.regions && snap.regions[r]) || { muscle: 0, fat: 0 };
      return React.createElement('div', { key: r, style: { display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0', fontSize: '12px' } }, [
        React.createElement('span', { key: 'n', style: { width: '40px', flex: 'none', color: T.sub } }, names[r]),
        bar(reg.muscle, T.accent), bar(reg.fat, T.accent2),
      ]);
    });
    return React.createElement('div', { style: { marginTop: '14px' } }, [head].concat(rows));
  }

  buildTrend(snaps) {
    const lang = this.state.lang;
    if (!snaps || snaps.length < 2) return React.createElement('div', { style: { fontSize: '13px', color: T.faint, padding: '10px 0' } }, lang === 'zh' ? '多做几次评估即可看到变化趋势。' : 'Run a few estimates to see the trend.');
    const W = 320, H = 132, padL = 12, padR = 44, padT = 14, padB = 24, n = snaps.length;
    const xs = snaps.map((s, i) => padL + (W - padL - padR) * (i / (n - 1)));
    const fats = snaps.map(s => +s.bodyFat), mus = snaps.map(s => +s.muscleMass);
    const yOf = (arr, v) => { const mn = Math.min.apply(null, arr), mx = Math.max.apply(null, arr), r = (mx - mn) || 1; return padT + (H - padT - padB) * (1 - (v - mn) / r); };
    const mk = (arr, color) => {
      const pts = arr.map((v, i) => xs[i] + ',' + yOf(arr, v)).join(' ');
      const poly = React.createElement('polyline', { key: 'p' + color, points: pts, fill: 'none', stroke: color, strokeWidth: 2, strokeLinejoin: 'round' });
      const dots = arr.map((v, i) => React.createElement('circle', { key: 'd' + color + i, cx: xs[i], cy: yOf(arr, v), r: 2.6, fill: color }));
      const lbl = React.createElement('text', { key: 't' + color, x: xs[n - 1] + 6, y: yOf(arr, arr[n - 1]) + 4, fill: color, fontSize: 11, fontWeight: 700 }, '' + arr[n - 1]);
      return [poly].concat(dots).concat([lbl]);
    };
    const xlabels = [
      React.createElement('text', { key: 'xa', x: xs[0], y: H - 6, fill: T.faint, fontSize: 10 }, this.fmtDate(snaps[0].date, lang)),
      React.createElement('text', { key: 'xb', x: xs[n - 1], y: H - 6, fill: T.faint, fontSize: 10, textAnchor: 'end' }, this.fmtDate(snaps[n - 1].date, lang)),
    ];
    const svg = React.createElement('svg', { viewBox: '0 0 ' + W + ' ' + H, style: { width: '100%', display: 'block' } }, mk(fats, T.accent2).concat(mk(mus, T.accent)).concat(xlabels));
    const legend = React.createElement('div', { style: { display: 'flex', gap: '16px', marginTop: '4px', fontSize: '12px', color: T.sub } }, [
      React.createElement('span', { key: 'a', style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [React.createElement('span', { key: 's', style: { width: '12px', height: '3px', background: T.accent2, display: 'inline-block' } }), lang === 'zh' ? '体脂率 %' : 'Body fat %']),
      React.createElement('span', { key: 'b', style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [React.createElement('span', { key: 's', style: { width: '12px', height: '3px', background: T.accent, display: 'inline-block' } }), lang === 'zh' ? '肌肉量 kg' : 'Muscle kg']),
    ]);
    return React.createElement('div', {}, [svg, legend]);
  }

  setBodyMode = (m) => this.setState({ bodyMode: m });

  async estimateBody() {
    const lang = this.state.lang;
    if (!isAIConfigured()) { this.openAI(); return; }
    const d = this.state.data, rec = d.records[this.today] || this.emptyRecord();
    const dayNo = this.dayNumberOf(this.today, d.startDate);
    const recent = Object.keys(d.records).sort().reverse().slice(0, 5).map(k => (d.records[k].fitness.exercises || []).map(e => e.name).join('/')).filter(Boolean).join('；');
    const diet = rec.diet.meals.map(m => m.items).filter(Boolean).join('；');
    const prompt = '根据以下信息估算身体成分，没有精确测量就基于常识做合理估计。严格只输出 JSON，不要任何额外文字、不要代码块。格式：{"bodyFat":数字,"muscleMass":数字,"regions":{"shoulders":{"muscle":0,"fat":0},"chest":{"muscle":0,"fat":0},"arms":{"muscle":0,"fat":0},"abs":{"muscle":0,"fat":0},"back":{"muscle":0,"fat":0},"legs":{"muscle":0,"fat":0},"glutes":{"muscle":0,"fat":0}},"note":"一句话总结"}。muscle/fat 为该部位相对水平(0-100)。信息：体重 ' + (rec.fitness.weight || '70') + ' kg；腰围 ' + (rec.fitness.waist || '81') + ' cm；近期训练：' + (recent || '力量训练为主') + '；今日饮食：' + (diet || '高蛋白均衡') + '；已坚持 ' + dayNo + ' 天。';
    this.setAi('bodyest', { busy: true, text: '' });
    try {
      let txt = await chatComplete({ prompt, temperature: 0.4 });
      txt = (txt || '').trim();
      const m = txt.match(/\{[\s\S]*\}/);
      const obj = JSON.parse(m ? m[0] : txt);
      const snap = { date: this.today, bodyFat: Math.round((+obj.bodyFat) * 10) / 10, muscleMass: Math.round((+obj.muscleMass) * 10) / 10, regions: obj.regions, note: obj.note || '' };
      this.setData(dd => { const arr = (dd.bodySnapshots || []).filter(s => s.date !== this.today); arr.push(snap); arr.sort((a, b) => a.date < b.date ? -1 : 1); return Object.assign({}, dd, { bodySnapshots: arr }); });
      this.setAi('bodyest', { busy: false, text: obj.note || (lang === 'zh' ? '已更新今日身体评估。' : "Updated today's estimate.") });
    } catch (e) {
      this.setAi('bodyest', { busy: false, text: (lang === 'zh' ? '估算失败：' : 'Estimate failed: ') + (e.message || e) });
    }
  }

  fmtDate(isoStr, lang) {
    const d = new Date(isoStr + 'T00:00:00'); const wd = this.L[lang].weekdays[d.getDay()];
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + wd;
  }
  fmtFull(lang) {
    const d = new Date(); const wd = this.L[lang].weekdays[d.getDay()];
    if (lang === 'zh') return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · ' + wd;
    const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return wd + ' · ' + mons[d.getMonth()] + ' ' + d.getDate();
  }
  dayNumberOf(isoStr, start) { const a = new Date(start + 'T00:00:00'), b = new Date(isoStr + 'T00:00:00'); return Math.round((b - a) / 86400000) + 1; }
  hasContent(r) { return !!(r && (r.learning.body || r.learning.topic || r.reflection.answer || r.fitness.done || (r.fitness.exercises || []).length || (r.diet.meals || []).some(m => m.items || m.photoId))); }

  render() {
    return renderApp(this);
  }
}
