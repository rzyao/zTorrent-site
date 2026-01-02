import { useEffect } from "react";
import NProgress from "nprogress";

// 配置 NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

// nprogress 是一个全局单例，所以我们只需要保证同一时间不要重复 start()
// 作为一个 component，它被挂载意味着 Suspense 正在 fallback，也就是路由正在加载
export function RouteProgressBar() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  // 这个组件不需要渲染任何实际的 DOM，
  // 它的作用只是在生命周期中触发 NProgress
  return null;
}
