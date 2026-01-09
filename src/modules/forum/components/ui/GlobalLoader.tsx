import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.svg";
import { useGlobalLoader } from "@/stores/globalLoaderStore";

/**
 * 全局加载器组件（单例）
 * 应挂载在应用根部，通过 useGlobalLoader store 控制显示/隐藏
 */
export function GlobalLoader() {
  const isVisible = useGlobalLoader((state) => state.isVisible);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
        >
          {/* 背景光效 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo 动画 - 使用 CSS 动画 */}
            <div className="animate-float">
              <img
                src={logo}
                alt="Logo"
                className="h-28 w-28 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] md:h-36 md:w-36"
              />
            </div>

            {/* 标题 */}
            <h1 className="mt-8 bg-linear-to-r from-neutral-100 to-neutral-400 bg-clip-text text-2xl font-bold tracking-[0.25em] text-transparent md:text-3xl">
              GuoYuan
            </h1>

            {/* 进度条 - 使用 CSS 动画，GPU 加速 */}
            <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-neutral-800">
              <div className="animate-progress-slide h-full w-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500" />
            </div>

            {/* 加载文字 */}
            <p className="mt-4 text-xs font-light tracking-widest text-neutral-500 uppercase opacity-50">
              LOADING RESOURCES
            </p>
          </div>

          {/* CSS 动画定义 */}
          <style>{`
            @keyframes float {
              0%, 100% {
                transform: translateY(0);
                filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.3));
              }
              50% {
                transform: translateY(-15px);
                filter: drop-shadow(0 0 30px rgba(245, 158, 11, 0.6));
              }
            }
            
            @keyframes progress-slide {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
            
            .animate-float {
              animation: float 3s ease-in-out infinite;
              will-change: transform, filter;
            }
            
            .animate-progress-slide {
              animation: progress-slide 1.5s linear infinite;
              will-change: transform;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 加载器触发器：挂载时开始加载，卸载时结束
 * 用于 Suspense fallback
 */
export function GlobalLoaderTrigger() {
  const { startLoading, finishLoading } = useGlobalLoader();

  useEffect(() => {
    startLoading();
    return () => finishLoading();
  }, [startLoading, finishLoading]);

  return null;
}
