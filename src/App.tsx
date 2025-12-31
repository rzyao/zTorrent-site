import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { AppToaster } from "./components/ui/sonner";
import AppRoutes from "./routes/AppRoutes";
import { AccessProvider } from "@/context/AccessContext";
import { UserSummaryProvider } from "@/context/UserSummaryContext";
import { DownloadersProvider } from "@/context/DownloadersContext";
import { useDictionaryStore } from "./stores/dictionaryStore";
import { usePreferenceCategoriesStore } from "./stores/preferenceCategoriesStore";

// 全局认证事件
declare global {
  interface Window {
    dispatchAuthEvent: () => void;
  }
}

export default function App() {
  /**
   * 应用初始化：加载字典和分类数据
   * 使用 store.getState() 直接调用 action，避免因函数引用不稳定
   * 导致 useEffect 重复执行或在手机端出现竞态条件
   */
  useEffect(() => {
    // document.documentElement.classList.add("dark"); // Removed to prevent flash and conflict with ForumThemeContext
    // 应用初始化时：先加载字典数据，再获取分类数据（确保 label 能正确填充）
    const init = async () => {
      await useDictionaryStore.getState().fetchDictionaries();
      await usePreferenceCategoriesStore.getState().fetchCategories();
    };
    init();
  }, []); // 空依赖数组，仅在挂载时执行一次

  return (
    <BrowserRouter>
      <AccessProvider>
        <UserSummaryProvider>
          <DownloadersProvider>
            <AppToaster />
            <AppRoutes />
          </DownloadersProvider>
        </UserSummaryProvider>
      </AccessProvider>
    </BrowserRouter>
  );
}
