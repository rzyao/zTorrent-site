import {
  Upload,
  Gift,
  Heart,
  Bell,
  Star,
  TrendingUp,
  MessageSquare,
  Clock,
  Award,
  Sparkles,
  Users,
  BookOpen,
  Settings,
  Share2,
  Bookmark,
  Download,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

/**
 * HomeActionBar - 首页底部操作栏
 * 包含多种颜色类型的功能按钮
 */
export function HomeActionBar() {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // 检查浏览器历史记录状态
    const checkNavigationState = () => {
      setCanGoBack(window.history.length > 1);
      // Note: 无法直接检测是否可以前进，但我们可以跟踪状态
    };

    checkNavigationState();

    // 监听popstate事件（浏览器前进后退）
    window.addEventListener("popstate", checkNavigationState);

    return () => {
      window.removeEventListener("popstate", checkNavigationState);
    };
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  const handleGoForward = () => {
    window.history.forward();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="sticky bottom-0 z-30 border-t border-amber-500/20 bg-linear-to-t from-[#0F171E] via-[#0F171E] to-[#0F171E]/95 shadow-2xl backdrop-blur-sm">
      <div className="w-full px-4 py-4 md:px-8">
        {/* 按钮组 */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {/* 导航按钮组 */}
          <div className="flex items-center gap-2">
            {/* 后退按钮 - 蓝灰色 */}
            <Button
              onClick={handleGoBack}
              disabled={!canGoBack}
              className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-3 py-2 text-gray-300 transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-800/70 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-700/50 disabled:hover:text-gray-300 disabled:hover:shadow-none"
              title="后退"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* 前进按钮 - 蓝灰色 */}
            <Button
              onClick={handleGoForward}
              className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-3 py-2 text-gray-300 transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-800/70 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
              title="前进"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* 首页按钮 - 琥珀色 */}
            <Button
              onClick={handleGoHome}
              className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-3 py-2 text-gray-300 transition-all duration-300 hover:border-amber-500/50 hover:bg-neutral-800/70 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
              title="返回首页"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>

          {/* 分隔线 */}
          <div className="hidden h-8 w-px bg-neutral-700/50 md:block" />

          {/* 主要功能按钮 */}
          <div className="flex items-center gap-2">
            {/* 上传种子 - 绿色 */}
            <Button className="h-auto border border-green-500 bg-linear-to-r from-green-500 to-emerald-500 px-4 py-2 text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:from-green-600 hover:to-emerald-600">
              <Upload className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">上传</span>
            </Button>

            {/* 发布求种 - 琥珀色 */}
            <Button className="h-auto border border-amber-500 bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-amber-600 hover:to-orange-600">
              <Gift className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">求种</span>
            </Button>

            {/* 最新种子 - 蓝色 */}
            <Button className="h-auto border border-blue-500 bg-linear-to-r from-blue-500 to-indigo-500 px-4 py-2 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-600 hover:to-indigo-600">
              <Clock className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">最新</span>
            </Button>

            {/* 热门推荐 - 红色 */}
            <Button className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-red-500/50 hover:bg-neutral-800/70 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20">
              <TrendingUp className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">热门</span>
            </Button>
          </div>

          {/* 分隔线 */}
          <div className="hidden h-8 w-px bg-neutral-700/50 md:block" />

          {/* 社区功能按钮 */}
          <div className="flex items-center gap-2">
            {/* 社区论坛 - 紫色 */}
            <Button className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-purple-500/50 hover:bg-neutral-800/70 hover:text-purple-400 hover:shadow-lg hover:shadow-purple-500/20">
              <MessageSquare className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">论坛</span>
            </Button>

            {/* 限时活动 - 粉色 */}
            <Button className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-pink-500/50 hover:bg-neutral-800/70 hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/20">
              <Sparkles className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">活动</span>
            </Button>

            {/* 排行榜 - 黄色 */}
            <Button className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-yellow-500/50 hover:bg-neutral-800/70 hover:text-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20">
              <Award className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">排行</span>
            </Button>

            {/* 在线用户 - 青色 */}
            <Button className="hidden h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-cyan-500/50 hover:bg-neutral-800/70 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 sm:flex">
              <Users className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">用户</span>
            </Button>
          </div>

          {/* 分隔线 */}
          <div className="hidden h-8 w-px bg-neutral-700/50 md:block" />

          {/* 工具按钮 */}
          <div className="flex items-center gap-2">
            {/* 收藏 - 红色心形 */}
            <Button className="h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-red-500/50 hover:bg-neutral-800/70 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20">
              <Heart className="h-4 w-4" />
            </Button>

            {/* 通知 - 带徽章 */}
            <Button className="relative h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-800/70 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-red-500 to-orange-500 text-xs text-white shadow-lg shadow-red-500/50">
                3
              </span>
            </Button>

            {/* 书签 - 靛青色 */}
            <Button className="hidden h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-indigo-500/50 hover:bg-neutral-800/70 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 sm:flex">
              <Bookmark className="h-4 w-4" />
            </Button>

            {/* 刷新 - 橙色 */}
            <Button
              onClick={handleRefresh}
              className="hidden h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-orange-500/50 hover:bg-neutral-800/70 hover:text-orange-400 hover:shadow-lg hover:shadow-orange-500/20 sm:flex"
              title="刷新"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* 设置 - 灰色 */}
            <Button className="hidden h-auto border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 text-gray-300 transition-all duration-300 hover:border-gray-500/50 hover:bg-neutral-800/70 hover:text-gray-400 hover:shadow-lg hover:shadow-gray-500/20 sm:flex">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
