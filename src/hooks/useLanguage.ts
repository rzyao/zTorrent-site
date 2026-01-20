import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import {
  changeLanguage as i18nChangeLanguage,
  getCurrentLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
} from '@/i18n';

// dayjs locale 映射
const DAYJS_LOCALE_MAP: Record<SupportedLanguage, string> = {
  'zh-CN': 'zh-cn',
  'zh-TW': 'zh-tw',
  'en-US': 'en',
  'ja-JP': 'ja',
};

/**
 * 语言切换 Hook
 * 提供语言切换功能，并自动同步 dayjs locale
 */
export function useLanguage() {
  const { t, i18n } = useTranslation();
  
  // 当前语言 - 使用 i18n.language 保证响应式更新
  const currentLanguage = (() => {
    const lang = i18n.language;
    // 确保返回的是支持的语言
    const supported = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    return supported ? (lang as SupportedLanguage) : DEFAULT_LANGUAGE;
  })();
  
  // 获取当前语言信息
  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  ) || SUPPORTED_LANGUAGES[0];

  // 切换语言
  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    // 切换 i18n 语言
    await i18nChangeLanguage(language);
    
    // 同步切换 dayjs locale
    const dayjsLocale = DAYJS_LOCALE_MAP[language];
    if (dayjsLocale) {
      dayjs.locale(dayjsLocale);
    }
  }, []);

  // 初始化时同步 dayjs locale
  useEffect(() => {
    const dayjsLocale = DAYJS_LOCALE_MAP[currentLanguage];
    if (dayjsLocale) {
      dayjs.locale(dayjsLocale);
    }
  }, [currentLanguage]);

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const dayjsLocale = DAYJS_LOCALE_MAP[lng as SupportedLanguage];
      if (dayjsLocale) {
        dayjs.locale(dayjsLocale);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return {
    /** 翻译函数 */
    t,
    /** i18n 实例 */
    i18n,
    /** 当前语言代码 */
    currentLanguage,
    /** 当前语言信息（包含 label 和 flag） */
    currentLanguageInfo,
    /** 切换语言 */
    changeLanguage,
    /** 支持的语言列表 */
    supportedLanguages: SUPPORTED_LANGUAGES,
    /** 默认语言 */
    defaultLanguage: DEFAULT_LANGUAGE,
  };
}

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type SupportedLanguage };
