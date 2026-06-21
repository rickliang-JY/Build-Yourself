// Runtime-editable plan settings. Defaults come from config.js, overrides
// are stored in localStorage so the user can change them from the UI.
import { CONFIG } from './config.js';

const KEY = (CONFIG.storageKey || 'growth_plan') + '_settings_v1';

function clone(o) { return JSON.parse(JSON.stringify(o)); }

export function defaultSettings() {
  return {
    totalDays: CONFIG.totalDays,
    appTitle: clone(CONFIG.appTitle),
    tagline: clone(CONFIG.tagline),
    encourage: clone(CONFIG.encourage),
    quote: clone(CONFIG.quote),
    sections: clone(CONFIG.sections),
  };
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const base = defaultSettings();
      // shallow-merge with nested objects to tolerate older/partial saves
      return {
        totalDays: s.totalDays || base.totalDays,
        appTitle: Object.assign(base.appTitle, s.appTitle),
        tagline: Object.assign(base.tagline, s.tagline),
        encourage: Object.assign(base.encourage, s.encourage),
        quote: Object.assign(base.quote, s.quote),
        sections: Object.assign(base.sections, s.sections),
      };
    }
  } catch (e) {}
  return defaultSettings();
}

export function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
}
