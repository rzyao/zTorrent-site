import { createContext, useContext, useCallback } from "react";

interface KeepAliveContextType {
  setTabSaved: (saved: boolean, path?: string) => void;
}

export const KeepAliveContext = createContext<KeepAliveContextType | null>(null);

// 用于在 KeepAlive 内容区域中提供当前 Tab Key
export const TabKeyContext = createContext<string | null>(null);

export const useKeepAliveContext = () => {
  const context = useContext(KeepAliveContext);
  if (!context) {
    throw new Error("useKeepAliveContext must be used within a KeepAliveContext.Provider");
  }
  return context;
};

/**
 * 页面用于设置保存状态的 Hook
 * 自动处理 KeepAlive 环境下的 Tab Key 识别
 */
export const useTabStatus = () => {
  const { setTabSaved } = useKeepAliveContext();
  const tabKey = useContext(TabKeyContext);

  // 使用 useCallback 避免不必要的重渲染
  const setSaved = useCallback(
    (saved: boolean) => {
      // 如果存在 tabKey（在 KeepAliveContent 内），优先使用它
      // 否则让 setTabSaved 使用默认的 activeKey
      setTabSaved(saved, tabKey || undefined);
    },
    [setTabSaved, tabKey],
  );

  return {
    setSaved,
    setUnsaved: () => setSaved(false),
  };
};
