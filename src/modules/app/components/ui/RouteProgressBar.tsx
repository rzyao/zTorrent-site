import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import { useIsFetching } from "@tanstack/react-query";

// 配置 NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

// 引用计数，防止多个且嵌套的加载状态导致进度条提前结束或重复开始
let activeRequests = 0;
// 延时计时器，用于平滑过渡不同阶段（如 路由跳转 -> Suspense -> 数据请求）
let stopTimer: NodeJS.Timeout | null = null;

function start() {
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
  if (activeRequests === 0) {
    NProgress.start();
  }
  activeRequests++;
}

function done() {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    // 延迟结束，给下一个可能立即开始的请求留出时间窗口（debounce）
    // 这解决了 Suspense 结束和 useQuery 开始之间的微小空隙导致进度条闪烁的问题
    if (!stopTimer) {
      stopTimer = setTimeout(() => {
        if (activeRequests === 0) {
          NProgress.done();
        }
        stopTimer = null;
      }, 100); // 100ms 缓冲期
    }
  }
}

/**
 * Suspense Fallback 进度条
 * 当代码分割块（Lazy Chunk）正在加载时触发
 * 作为一个 component，它被挂载意味着 Suspense 正在 fallback
 */
export function RouteProgressBar() {
  // 使用 useLayoutEffect 确保在浏览器绘制前触发，避免快速加载时的闪烁或未触发
  useLayoutEffect(() => {
    start();
    return () => {
      done();
    };
  }, []);

  // 这个组件不需要渲染任何实际的 DOM
  return null;
}

/**
 * 全局导航进度条
 * 监听路由变化和数据请求状态
 * 应放置在 AppLayout 或顶层容器中
 */
export function GlobalProgressBar() {
  const location = useLocation();
  const isFetching = useIsFetching();

  // 1. 监听路由变化 (给予即时视觉反馈)
  useEffect(() => {
    // 路由变化时开始进度条
    start();

    // 设置一个定时器来结束这个"路由跳转"事件引起的进度条
    // 即使 Suspense 或 Fetch 没有立即发生，用户也会看到 500ms 的加载反馈
    const timer = setTimeout(() => {
      done();
    }, 500);

    return () => {
      // 如果在定时器触发前 location 又变了（快速点击），我们需要清理定时器并手动 done
      // 以保持引用计数平衡
      clearTimeout(timer);
      done();
    };
  }, [location.pathname, location.search]);

  // 2. 监听 React Query 数据获取状态
  // 当有后台请求时显示进度条
  useEffect(() => {
    // 只有当 fetching 从 0 变为 >0 时才通过 Effect 触发 start
    if (isFetching > 0) {
      start();
      return () => {
        done();
      };
    }
  }, [isFetching > 0]);

  return null;
}
