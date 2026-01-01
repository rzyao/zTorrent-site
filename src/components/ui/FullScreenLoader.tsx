import { motion } from "framer-motion";
import logo from "@/assets/logo.svg";

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
      {/* 背景光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="-h-[500px] -w-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo 动画 */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            filter: [
              "drop-shadow(0 0 15px rgba(245, 158, 11, 0.3))",
              "drop-shadow(0 0 30px rgba(245, 158, 11, 0.6))",
              "drop-shadow(0 0 15px rgba(245, 158, 11, 0.3))",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img src={logo} alt="zTorrent Logo" className="h-28 w-28 md:h-36 md:w-36" />
        </motion.div>

        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 bg-linear-to-r from-neutral-100 to-neutral-400 bg-clip-text text-2xl font-bold tracking-[0.25em] text-transparent md:text-3xl"
        >
          GuoYuan
        </motion.h1>

        {/* 进度条容器 */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "12rem" }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 h-1 overflow-hidden rounded-full bg-neutral-800"
        >
          {/* 进度条动画 */}
          <motion.div
            className="h-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* 加载文字 (可选) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-xs font-light tracking-widest text-neutral-500 uppercase"
        >
          LOADING RESOURCES
        </motion.p>
      </motion.div>
    </div>
  );
}
