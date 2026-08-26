import { toast } from "sonner";

// 自动退出管理器
export class AutoLogoutManager {
  private static timeoutId: NodeJS.Timeout | null = null;
  private static readonly TIMEOUT_MINUTES = 30;
  private static readonly TIMEOUT_MS = this.TIMEOUT_MINUTES * 60 * 1000;

  // 启动自动退出计时器
  static start() {
    this.stop(); // 先停止现有的计时器

    const isEnabled = localStorage.getItem("auto_logout") === "true";
    if (!isEnabled) {
      return;
    }

    this.timeoutId = setTimeout(() => {
      this.logout();
    }, this.TIMEOUT_MS);

    // 监听用户活动，重置计时器
    this.setupActivityListeners();
  }

  // 停止自动退出计时器
  static stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.removeActivityListeners();
  }

  // 重置计时器（用户活动时调用）
  static reset() {
    if (this.timeoutId) {
      this.start();
    }
  }

  // 执行退出操作
  private static logout() {
    // 调用后端 /auth/logout 清除 HttpOnly Cookie（凭证已不在前端）
    try {
      const base =
        (typeof import.meta !== "undefined" && (import.meta as any)?.env?.VITE_BASE_URL) ||
        "/api";
      void fetch(`${base}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
    } catch {}
    // 保留 auto_logout 用户偏好（否则仅触发一次）；触发全局事件通知 AccessProvider 重置态
    try {
      window.dispatchEvent(new Event("authChange"));
    } catch {}
    // 停止计时器
    this.stop();
    // 显示提示信息
    toast.warning("您已长时间无操作，为确保账户安全，系统已自动退出登录。", {
      duration: 10000,
    });
    // 跳转到登录页面
    window.location.href = "/login";
  }

  // 设置活动监听器
  private static setupActivityListeners() {
    const events = ["mousedown", "keydown", "touchstart", "scroll"];

    events.forEach((event) => {
      document.addEventListener(event, this.handleUserActivity, { passive: true });
    });
  }

  // 移除活动监听器
  private static removeActivityListeners() {
    const events = ["mousedown", "keydown", "touchstart", "scroll"];

    events.forEach((event) => {
      document.removeEventListener(event, this.handleUserActivity);
    });
  }

  // 处理用户活动
  private static handleUserActivity = () => {
    this.reset();
  };

  // 检查是否启用了自动退出
  static isEnabled(): boolean {
    return localStorage.getItem("auto_logout") === "true";
  }
}

// 初始化自动退出管理器
export function initializeAutoLogout() {
  // 页面加载时启动
  if (typeof window !== "undefined" && AutoLogoutManager.isEnabled()) {
    AutoLogoutManager.start();
  }
}

// 管理器类已在顶部导出，无需重复导出
