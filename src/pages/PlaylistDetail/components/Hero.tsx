import { ArrowLeft, Heart, Eye, Film, Star } from "lucide-react";
import type { PlaylistDetail } from "../types";

interface HeroProps {
  playlist: PlaylistDetail | null;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onBack: () => void;
}

// 片单页顶部横幅与操作区
// 拆分原因：
// - 将页面的头部展示（封面、标题、统计、按钮）独立为纯展示组件，便于复用与维护
// - 降低主页面文件体积与复杂度
// 片单页顶部横幅与操作区
// 拆分原因：
// - 将页面的头部展示（封面、标题、统计、按钮）独立为纯展示组件，便于复用与维护
// - 降低主页面文件体积与复杂度
export function Hero({ playlist, isFollowing, onToggleFollow, onBack }: HeroProps) {
  return (
    <div className="relative pt-24 pb-8 md:pt-32">
      {/* 返回按钮：相对于 Hero 容器定位，或者 sticky */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 px-4 pt-6 md:px-0 md:pt-8">
        <button
          onClick={onBack}
          className="pointer-events-auto sticky top-0 z-50 flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回片单</span>
        </button>
      </div>

      {/* 片单信息区：流式布局 */}
      <div className="relative z-10 w-full">
        {/* 标签 */}
        <div className="mb-4 flex items-center gap-3">
          {(playlist?.tags ?? []).map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full border border-amber-500/30 bg-linear-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-sm text-amber-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{playlist?.title ?? ""}</h1>

        {/* 统计 */}
        <div className="mb-4 flex flex-wrap items-center gap-6 text-neutral-300">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-orange-600">
              <span className="text-sm text-white">{playlist?.creatorAvatar ?? ""}</span>
            </div>
            <span>{playlist?.creator ?? ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>{playlist?.moviesCount ?? 0} 部影片</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>{Number(playlist?.followersCount ?? 0).toLocaleString()} 关注</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{Number(playlist?.viewsCount ?? 0).toLocaleString()} 浏览</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>
              {typeof playlist?.rating === "number"
                ? (playlist!.rating as number).toFixed(1)
                : "0.0"}
            </span>
          </div>
        </div>

        {/* 描述 */}
        <p className="mb-8 max-w-4xl text-lg leading-relaxed text-neutral-300">
          {playlist?.description ?? ""}
        </p>
      </div>
    </div>
  );
}
