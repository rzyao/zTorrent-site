/**
 * 用户偏好存储与读取工具
 * 作用：集中管理“成人模式开关、默认种子分类（多选）、默认影片类型（多选）”的本地持久化
 * 存储介质：localStorage（后端接口未就绪时的临时方案）
 */

export interface UserPreferences {
  showAdult: boolean;
  defaultTorrentCategories: string[];
  defaultFilmGenres: string[];
}

const DEFAULT_PREFERENCES: UserPreferences = {
  showAdult: false,
  defaultTorrentCategories: [],
  defaultFilmGenres: [],
};

const KEY_SHOW_ADULT = 'userPref.showAdult';
const KEY_TORRENT_CATEGORIES = 'userPref.defaultTorrentCategories';
const KEY_FILM_GENRES = 'userPref.defaultFilmGenres';

/**
 * 安全读取布尔值
 * 支持：'true' | '1' | true → true，其余均视为 false
 */
function readBool(key: string, fallback = false): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const val = raw.trim().toLowerCase();
    if (val === 'true' || val === '1') return true;
    if (val === 'false' || val === '0') return false;
    return Boolean(JSON.parse(raw));
  } catch {
    return fallback;
  }
}

/**
 * 安全读取字符串数组
 */
function readStringArray(key: string, fallback: string[] = []): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return fallback;
    return arr.filter((x) => typeof x === 'string');
  } catch {
    return fallback;
  }
}

/**
 * 写入字符串数组
 */
function writeStringArray(key: string, arr: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.isArray(arr) ? arr : []));
  } catch {}
}

/**
 * 写入布尔值（统一用 'true' / 'false'）
 */
function writeBool(key: string, val: boolean) {
  try {
    localStorage.setItem(key, String(!!val));
  } catch {}
}

/**
 * 读取偏好（带默认值合并）
 */
export function getPreferences(): UserPreferences {
  return {
    showAdult: readBool(KEY_SHOW_ADULT, DEFAULT_PREFERENCES.showAdult),
    defaultTorrentCategories: readStringArray(KEY_TORRENT_CATEGORIES, DEFAULT_PREFERENCES.defaultTorrentCategories),
    defaultFilmGenres: readStringArray(KEY_FILM_GENRES, DEFAULT_PREFERENCES.defaultFilmGenres),
  };
}

/**
 * 增量保存偏好
 * 仅写入传入的字段，未传入的字段保持不变
 */
export function savePreferences(update: Partial<UserPreferences>) {
  const current = getPreferences();
  const next: UserPreferences = { ...current, ...update };
  writeBool(KEY_SHOW_ADULT, next.showAdult);
  writeStringArray(KEY_TORRENT_CATEGORIES, next.defaultTorrentCategories);
  writeStringArray(KEY_FILM_GENRES, next.defaultFilmGenres);
}

/**
 * 重置为默认值
 */
export function resetPreferences() {
  savePreferences({ ...DEFAULT_PREFERENCES });
}

