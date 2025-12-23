import { useState } from "react";
import { useFavorite } from "@/hooks/useFavorite";
import { FavoriteActionDto } from "@/api";
import { useNavigate } from "react-router-dom";
import { Bell, UserPlus, Heart, Share2 } from "lucide-react";
import ActionBtn from "@/components/ActionBtn";
import { cn } from "@/components/ui/utils";
import { Hero } from "@/pages/PlaylistDetail/components/Hero";
import { Toolbar } from "@/pages/PlaylistDetail/components/Toolbar";
import { GridView } from "@/pages/PlaylistDetail/components/GridView";
import { ListView } from "@/pages/PlaylistDetail/components/ListView";
import { usePlaylistDetail } from "@/pages/PlaylistDetail/hooks/usePlaylistDetail";
import { PageContainer } from "@/components/PageContainer";

interface PlaylistDetailPageProps {
  playlistId: string;
  onBack: () => void;
  onFilmClick?: (filmId: string) => void;
}

export function PlaylistDetailPage({ playlistId, onBack, onFilmClick }: PlaylistDetailPageProps) {
  const navigate = useNavigate();
  // 页面交互状态仅保留视图与排序
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"order" | "rating" | "year">("order");

  // 本地 Mock 状态，仅用于演示 (模仿 InfoBar)
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 片单详情数据与行为统一由钩子管理
  const { loading, error, playlist, movies, isFollowing, toggleFollow, reload, openFilm } =
    usePlaylistDetail(playlistId);

  // 收藏状态 - 使用详情接口返回的 isFavorited 作为初始值，避免重复请求 check 接口
  const {
    isFavorite,
    toggle: toggleFavorite,
    isLoading: isFavoriteLoading,
  } = useFavorite({
    targetType: FavoriteActionDto.targetType.PLAYLIST,
    targetId: playlistId,
    initialValue: playlist?.isFavorited,
    enabled: !!playlist, // 只有详情加载完成后才启用
  });

  const sortedMovies = (() => {
    const list = [...movies];
    switch (sortBy) {
      case "rating":
        return list.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
      case "year":
        return list.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
      case "order":
      default:
        return list.sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0));
    }
  })();
  // 数据获取与行为逻辑已迁移至钩子

  return (
    <PageContainer
      backgroundImage={playlist?.coverImage}
      backgroundAlt={playlist?.title}
      className="pb-20" // 底部留白
    >
      {/* 头部内容 */}
      <Hero
        playlist={playlist}
        isFollowing={isFollowing}
        onToggleFollow={toggleFollow}
        onBack={onBack}
      />

      {/* 影片列表区域 */}
      <div className="mt-8 space-y-6">
        {/* ==== 交互按钮组 (参考 SeriesDetail InfoBar) ==== */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 第一组：用户交互 */}
          <div className="flex items-center gap-3">
            {/* 订阅 (Primary CTA) */}
            <ActionBtn
              onClick={() => setIsSubscribed(!isSubscribed)}
              variant="amber"
              mode={isSubscribed ? "solid" : "ghost"}
              size="md"
              className="px-4"
              icon={
                <Bell className={cn("h-5 w-5 transition-colors", isSubscribed && "fill-current")} />
              }
            >
              {isSubscribed ? "已订阅" : "订阅"}
            </ActionBtn>

            {/* 关注 (Secondary) - 映射到 API 的 isFollowing */}
            <ActionBtn
              onClick={toggleFollow}
              variant="blue"
              mode={isFollowing ? "solid" : "ghost"}
              size="md"
              className="px-4"
              icon={
                <UserPlus
                  className={cn("h-5 w-5 transition-colors", isFollowing && "fill-current")}
                />
              }
            >
              {isFollowing ? "已关注" : "关注"}
            </ActionBtn>

            {/* 收藏 (Secondary) */}
            <ActionBtn
              onClick={() => toggleFavorite()}
              variant="red"
              mode={isFavorite ? "solid" : "ghost"}
              size="md"
              className="px-4"
              loading={isFavoriteLoading}
              icon={
                <UserPlus
                  className={cn("h-5 w-5 transition-colors", isFavorite && "fill-current")}
                />
              }
            >
              {isFavoriteLoading
                ? isFavorite
                  ? "取消中"
                  : "收藏中"
                : isFavorite
                  ? "已收藏"
                  : "收藏"}
            </ActionBtn>
          </div>

          {/* 垂直分割线 */}
          <div className="hidden h-8 w-px bg-white/20 lg:block" />

          {/* 第二组：社交分享 */}
          <div className="flex items-center gap-3">
            <ActionBtn
              variant="neutral"
              mode="ghost"
              size="md"
              className="px-4"
              icon={<Share2 className="h-5 w-5" />}
            >
              分享
            </ActionBtn>
          </div>
        </div>
        {/* 工具栏 */}
        <Toolbar
          sortBy={sortBy}
          viewMode={viewMode}
          onChangeSort={(v) => setSortBy(v)}
          onChangeViewMode={(v) => setViewMode(v)}
          moviesCount={sortedMovies.length}
        />

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <span>{error}</span>
            <button
              onClick={() => reload()}
              className="rounded border border-red-500/50 bg-red-500/20 px-3 py-1 text-red-200 transition-colors hover:bg-red-500/30"
            >
              重试
            </button>
          </div>
        )}
        {loading && <div className="mb-6 text-neutral-400">正在加载片单数据…</div>}

        {/* 网格视图 */}
        {viewMode === "grid" && !loading && (
          <GridView movies={sortedMovies as any} onOpenFilm={openFilm} />
        )}

        {/* 列表视图 */}
        {viewMode === "list" && !loading && (
          <ListView movies={sortedMovies as any} onOpenFilm={openFilm} />
        )}
      </div>
    </PageContainer>
  );
}
