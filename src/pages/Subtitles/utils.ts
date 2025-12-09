// 工具方法集合：与展示相关的轻量逻辑集中在此，便于组件复用

export const getLanguageFlag = (code: string) => {
  const flags: { [key: string]: string } = {
    zh: '🇨🇳',
    en: '🇺🇸',
    jp: '🇯🇵',
    kr: '🇰🇷',
  };
  return flags[code] || '🌍';
};

