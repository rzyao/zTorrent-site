import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { AppToaster } from "./components/ui/sonner";
import AppRoutes from "./routes/AppRoutes";
import { AccessProvider } from "@/context/AccessContext";
import { UserSummaryProvider } from "@/context/UserSummaryContext";
import { DownloadersProvider } from "@/context/DownloadersContext";
import { useDictionaryStore } from "./stores/dictionaryStore";
import { usePreferenceCategoriesStore } from "./stores/preferenceCategoriesStore";
import { GlobalLoader } from "./components/ui/GlobalLoader";

// 全局认证事件
declare global {
  interface Window {
    dispatchAuthEvent: () => void;
  }
}

export default function App() {
  /**
   * 应用初始化：加载字典和分类数据
   */
  useEffect(() => {
    const init = async () => {
      await useDictionaryStore.getState().fetchDictionaries();
      await usePreferenceCategoriesStore.getState().fetchCategories();
    };
    init();
  }, []);

  return (
    <BrowserRouter>
      <AccessProvider>
        <UserSummaryProvider>
          <DownloadersProvider>
            {/* 全局加载器单例 - 挂载在应用根部 */}
            <GlobalLoader />
            <AppToaster />
            <AppRoutes />
          </DownloadersProvider>
        </UserSummaryProvider>
      </AccessProvider>
    </BrowserRouter>
  );
}
