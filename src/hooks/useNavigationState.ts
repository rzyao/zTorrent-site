import { useCallback, useSyncExternalStore } from "react";

// 模块级状态
let forwardStackCount = 0;
let internalNavigationCount = 0;
let isNavigatingByButton = false;
let listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getForwardStackCount() {
  return forwardStackCount;
}

function getInternalNavigationCount() {
  return internalNavigationCount;
}

// 首次加载时创建边界，阻止用户通过浏览器后退按钮退出项目
(function initBoundary() {
  const BOUNDARY_KEY = "__app_boundary__";

  // 检查当前状态是否已经是边界
  if (history.state?.[BOUNDARY_KEY]) return;

  // 1. 先 pushState 创建一个边界状态
  history.pushState({ [BOUNDARY_KEY]: true }, "");

  // 2. 监听 popstate，当退到边界时阻止继续后退
  window.addEventListener("popstate", (e) => {
    // 如果当前 state 是边界状态，说明用户试图退出项目
    if (e.state?.[BOUNDARY_KEY]) {
      // 再次 pushState 把用户"弹"回来
      history.pushState({ [BOUNDARY_KEY]: true }, "");
    }
  });
})();

/**
 * 导航状态 Hook
 */
export function useNavigationState() {
  const currentForwardCount = useSyncExternalStore(
    subscribe,
    getForwardStackCount
  );
  const currentInternalCount = useSyncExternalStore(
    subscribe,
    getInternalNavigationCount
  );

  const canGoBack = currentInternalCount - currentForwardCount > 0;
  const canGoForward = currentForwardCount > 0;

  const goBack = useCallback(() => {
    if (internalNavigationCount - forwardStackCount > 0) {
      isNavigatingByButton = true;
      forwardStackCount++;
      emitChange();
      window.history.back();
    }
  }, []);

  const goForward = useCallback(() => {
    if (forwardStackCount > 0) {
      isNavigatingByButton = true;
      forwardStackCount--;
      emitChange();
      window.history.forward();
    }
  }, []);

  const recordNavigation = useCallback(() => {
    if (isNavigatingByButton) {
      isNavigatingByButton = false;
      return;
    }
    internalNavigationCount++;
    forwardStackCount = 0;
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
