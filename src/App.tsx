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
  const { fetchDictionaries } = useDictionaryStore();
  const { fetchCategories } = usePreferenceCategoriesStore();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    // 应用初始化时：先加载字典数据，再获取分类数据（确保 label 能正确填充）
    const init = async () => {
      await fetchDictionaries();
      await fetchCategories();
    };
    init();
  }, [fetchDictionaries, fetchCategories]);

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
