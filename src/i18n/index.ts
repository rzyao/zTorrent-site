import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 语言资源导入
import zhCNCommon from './locales/zh-CN/common.json';
import zhTWCommon from './locales/zh-TW/common.json';
import enUSCommon from './locales/en-US/common.json';
import jaJPCommon from './locales/ja-JP/common.json';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh-CN';

// 语言资源
const resources = {
  'zh-CN': {
    common: zhCNCommon,
  },
  'zh-TW': {
    common: zhTWCommon,
  },
  'en-US': {
    common: enUSCommon,
  },
  'ja-JP': {
    common: jaJPCommon,
  },
};

// 初始化 i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: 'common',
    ns: ['common'],
    
    // 语言检测配置
    detection: {
      // 检测顺序：localStorage -> navigator -> htmlTag
      order: ['localStorage', 'navigator', 'htmlTag'],
      // 缓存到 localStorage
      caches: ['localStorage'],
      // localStorage key
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React 已经安全转义
    },

    react: {
      useSuspense: false,
    },
  });

/**
 * 切换语言
 * @param language 目标语言代码
 */
export const changeLanguage = async (language: SupportedLanguage) => {
  await i18n.changeLanguage(language);
  // 保存到 localStorage
  localStorage.setItem('i18nextLng', language);
};

/**
 * 获取当前语言
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  const lang = i18n.language;
  // 确保返回的是支持的语言
  const supported = SUPPORTED_LANGUAGES.find(l => l.code === lang);
  return supported ? (lang as SupportedLanguage) : DEFAULT_LANGUAGE;
};

/**
 * 检查是否是支持的语言
 */
export const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.some(l => l.code === lang);
};

export default i18n;
