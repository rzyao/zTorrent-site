import { useCallback, useSyncExternalStore } from "react";

// 导航深度状态键
const NAV_DEPTH_KEY = "__nav_depth__";

// 模块级状态
let currentDepth = 0; // 当前导航深度
let maxDepth = 0; // 历史最大深度（用于判断 canGoForward）
let listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getCurrentDepth() {
  return currentDepth;
}

function getMaxDepth() {
  return maxDepth;
}

// 标记是否正在通过我们的按钮导航（用于 popstate 中判断是否拦截）
let isNavigatingByOurButton = false;
// 标记是否是 popstate 导航（后退/前进），用于告诉 recordNavigation 跳过
let isPopstateNavigation = false;
// 标记是否已初始化
let initialized = false;

// 初始化边界监听
(function initBoundary() {
  if (initialized) return;
  initialized = true;

  // 页面加载/刷新时，始终将深度重置为 0
  currentDepth = 0;
  maxDepth = 0;

  // 设置当前历史条目的深度标记
  history.replaceState({ ...history.state, [NAV_DEPTH_KEY]: 0 }, "");

  // 添加 beforeunload 事件监听
  // 当用户尝试离开页面（关闭标签、后退到外部等）时触发浏览器原生确认框
  // window.addEventListener("beforeunload", (e) => {
  //   // 阻止默认行为并设置返回值，触发浏览器确认框
  //   e.preventDefault();
  //   // 兼容性：某些浏览器需要设置 returnValue
  //   e.returnValue = "";
  //   return "";
  // });

  // 监听 popstate 事件（用于应用内导航状态管理）
  window.addEventListener("popstate", (e) => {
    // 标记这是一个 popstate 导航，recordNavigation 应该跳过
    isPopstateNavigation = true;

    // 如果是通过我们的按钮触发的，更新状态
    if (isNavigatingByOurButton) {
      isNavigatingByOurButton = false;
      // 从 state 中读取新的深度
      const newDepth = e.state?.[NAV_DEPTH_KEY] ?? 0;
      currentDepth = newDepth;
      emitChange();
      return;
    }

    // 获取目标深度
    const targetDepth = e.state?.[NAV_DEPTH_KEY];

    // 正常的浏览器后退/前进，更新深度
    if (typeof targetDepth === "number" && targetDepth >= 0) {
      currentDepth = targetDepth;
      emitChange();
    }
  });
})();

/**
 * 导航状态 Hook
 * 管理应用内的导航状态，支持前进/后退按钮
 */
export function useNavigationState() {
  const depth = useSyncExternalStore(subscribe, getCurrentDepth);
  const max = useSyncExternalStore(subscribe, getMaxDepth);

  // 可以后退：当前深度 > 0
  const canGoBack = depth > 0;
  // 可以前进：当前深度 < 最大深度
  const canGoForward = depth < max;

  const goBack = useCallback(() => {
    if (currentDepth > 0) {
      isNavigatingByOurButton = true;
      window.history.back();
    }
  }, []);

  const goForward = useCallback(() => {
    if (currentDepth < maxDepth) {
      isNavigatingByOurButton = true;
      window.history.forward();
    }
  }, []);

  // 记录新的导航（由 AppLayout 中的 NavigationStateReset 调用）
  const recordNavigation = useCallback(() => {
    // 如果是 popstate 导航（后退/前进），跳过记录
    if (isPopstateNavigation) {
      isPopstateNavigation = false;
      return;
    }

    // 新导航：深度 +1，重置前进栈
    currentDepth++;
    maxDepth = currentDepth;

    // 将深度存入 history.state
    history.replaceState({ ...history.state, [NAV_DEPTH_KEY]: currentDepth }, "");

    emitChange();
  }, []);

  return {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    recordNavigation,
  };
}


