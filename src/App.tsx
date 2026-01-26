import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppToaster } from "@/modules/app/components/ui/sonner";
import AppRoutes from "./routes/AppRoutes";
import { AccessProvider } from "@/context/AccessContext";
import { UserSummaryProvider } from "@/modules/app/context/UserSummaryContext";
import { DownloadersProvider } from "@/modules/app/context/DownloadersContext";
import { useDictionaryStore } from "./stores/dictionaryStore";
import { usePreferenceCategoriesStore } from "./stores/preferenceCategoriesStore";
import { GlobalLoader } from "@/modules/app/components/ui/GlobalLoader";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AppGlobalErrorBoundary } from "@/modules/app/layouts/GlobalErrorBoundary";
import { changeLanguage, type SupportedLanguage, isSupportedLanguage } from "@/i18n";
import { getUsersService } from "@/api/lazy";
import { FullScreenLoader } from "@/modules/app/components/ui/FullScreenLoader";

// i18n 初始化
import "@/i18n";

// 全局认证事件
declare global {
  interface Window {
    dispatchAuthEvent: () => void;
  }
}

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * 应用初始化：加载字典、分类数据和用户语言偏好
   */
  useEffect(() => {
    const init = async () => {
      try {
        // 并行加载字典和分类数据
        await Promise.all([
          useDictionaryStore.getState().fetchDictionaries(),
          usePreferenceCategoriesStore.getState().fetchCategories(),
        ]);

        // 加载用户语言偏好
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const UsersService = await getUsersService();
            const resp = await UsersService.usersPreferencesControllerGet();
            const data = resp?.data;

            if (data?.language && isSupportedLanguage(data.language)) {
              // 应用用户偏好的语言设置
              await changeLanguage(data.language as SupportedLanguage);
            }
          } catch (error) {
            // 失败时使用 localStorage 中的语言或默认语言
            console.warn("加载用户语言偏好失败，使用本地语言设置", error);
          }
        }
      } catch (error) {
        console.error("应用初始化失败", error);
      } finally {
        // 无论成功或失败，都标记为已初始化，确保应用能正常启动
        setIsInitialized(true);
      }
    };
    init();
  }, []);

  // 强制刷新路由的 Key，用于在登录/登出时重置整个路由树
  // 解决部分组件使用 useEffect 初始化数据而无法响应 Auth 变化的问题
  const [authKey, setAuthKey] = useState(0);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthKey((prev) => prev + 1);
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // 显示全屏加载器直到初始化完成
  if (!isInitialized) {
    return <FullScreenLoader />;
  }

  return (
    <BrowserRouter>
      <AccessProvider>
        <UserSummaryProvider>
          <DownloadersProvider>
            {/* 全局加载器单例 - 挂载在应用根部 */}
            <GlobalLoader />
            <ThemeSwitcher />
            <AppToaster />
            {/* 顶层错误边界：捕获子树渲染错误并展示友好兜底 UI */}
            <AppGlobalErrorBoundary>
              <AppRoutes key={authKey} />
            </AppGlobalErrorBoundary>
          </DownloadersProvider>
        </UserSummaryProvider>
      </AccessProvider>
    </BrowserRouter>
  );
}
