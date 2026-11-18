import { ControlMode, Difficulty, Language, SaveData } from '../types/game';

const KEYS = {
  lang: 'eds_lang_v2',
  diff: 'eds_diff_v2',
  ctrl: 'eds_ctrl_v2',
  endings: 'eds_endings_v2',
  peaceful: 'eds_peaceful_v2',
  lastSave: 'eds_last_v2',
  slotPrefix: 'eds_slot_v2_',
};

export function getDifficultyParams(difficulty: Difficulty) {
  switch (difficulty) {
    case 'easy':
      return { monsterSpeed: 1.15, vision: 215, damage: 20, maxHp: 120, aggro: 165 };
    case 'medium':
      return { monsterSpeed: 1.65, vision: 165, damage: 34, maxHp: 100, aggro: 225 };
    case 'hard':
      return { monsterSpeed: 2.15, vision: 128, damage: 50, maxHp: 100, aggro: 285 };
    case 'nightmare':
      return { monsterSpeed: 2.75, vision: 92, damage: 100, maxHp: 80, aggro: 440 };
  }
}

export const saveSystem = {
  getLang(): Language {
    const val = localStorage.getItem(KEYS.lang) as Language | null;
    return val || 'pt-PT';
  },
  setLang(lang: Language) {
    localStorage.setItem(KEYS.lang, lang);
  },
  getDifficulty(): Difficulty {
    return (localStorage.getItem(KEYS.diff) as Difficulty | null) || 'medium';
  },
  setDifficulty(diff: Difficulty) {
    localStorage.setItem(KEYS.diff, diff);
  },
  getControlMode(): ControlMode {
    return (localStorage.getItem(KEYS.ctrl) as ControlMode | null) || 'auto';
  },
  setControlMode(ctrl: ControlMode) {
    localStorage.setItem(KEYS.ctrl, ctrl);
  },
  getUnlockedEndings(): number[] {
    try {
      const raw = localStorage.getItem(KEYS.endings);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  },
  unlockEnding(id: number) {
    const arr = this.getUnlockedEndings();
    if (!arr.includes(id)) {
      arr.push(id);
      localStorage.setItem(KEYS.endings, JSON.stringify(arr));
    }
    if ([2, 6, 7].includes(id)) {
      localStorage.setItem(KEYS.peaceful, '1');
    }
  },
  isPeacefulUnlocked(): boolean {
    return localStorage.getItem(KEYS.peaceful) === '1';
  },
  saveSlot(slot: number, data: SaveData) {
    const payload: SaveData = { ...data, slot, date: new Date().toLocaleString() };
    localStorage.setItem(KEYS.slotPrefix + slot, JSON.stringify(payload));
    localStorage.setItem(KEYS.lastSave, JSON.stringify(payload));
  },
  loadSlot(slot: number): SaveData | null {
    try {
      const raw = localStorage.getItem(KEYS.slotPrefix + slot);
      return raw ? (JSON.parse(raw) as SaveData) : null;
    } catch {
      return null;
    }
  },
  loadLast(): SaveData | null {
    try {
      const raw = localStorage.getItem(KEYS.lastSave);
      return raw ? (JSON.parse(raw) as SaveData) : null;
    } catch {
      return null;
    }
  },
  hasContinue(): boolean {
    return !!localStorage.getItem(KEYS.lastSave);
  },
};
