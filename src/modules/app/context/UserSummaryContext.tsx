import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DashboardService } from "@/api/services/DashboardService";

export interface UserSummary {
  uploadedBytes: number;
  downloadedBytes: number;
  ratio: number;
  bonus: string;
  bonusPoints: number;
  unreadNotifications: number;
  unreadInbox: number;
}

interface UserSummaryState {
  data: UserSummary | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

const UserSummaryContext = createContext<UserSummaryState>({
  data: null,
  isLoading: true,
  error: null,
  refresh: () => {},
});

export function UserSummaryProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 获取用户统计数据
  const fetchSummary = useCallback(async () => {
    try {
      // 凭证由 HttpOnly Cookie 携带；未登录时接口返回 401，被下方 catch 处理
      setError(null);
      const response = await DashboardService.dashboardControllerSummary({});

      if (response.data) {
        setData({
          uploadedBytes: response.data.uploadedBytes || 0,
          downloadedBytes: response.data.downloadedBytes || 0,
          ratio: response.data.ratio || 0,
          bonus: response.data.bonus || "0",
          bonusPoints: Number.parseFloat(response.data.bonus || "0"),
          unreadNotifications: response.data.unreadNotifications || 0,
          unreadInbox: response.data.unreadInbox || 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("获取用户统计数据失败"));
      console.error("获取用户统计数据失败:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 立即获取一次数据
    fetchSummary();

    // 设置15分钟定时器
    const intervalId = setInterval(
      () => {
        // 只在页面可见时刷新
        if (document.visibilityState === "visible") {
          fetchSummary();
        }
      },
      15 * 60 * 1000,
    ); // 15分钟

    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      // 当页面从隐藏变为可见时，立即刷新数据
      if (document.visibilityState === "visible") {
        fetchSummary();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 清理函数
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSummary]);

  return (
    <UserSummaryContext.Provider value={{ data, isLoading, error, refresh: fetchSummary }}>
      {children}
    </UserSummaryContext.Provider>
  );
}

export function useUserSummary() {
  const context = useContext(UserSummaryContext);
  if (!context) {
    throw new Error("useUserSummary must be used within UserSummaryProvider");
  }
  return context;
}
