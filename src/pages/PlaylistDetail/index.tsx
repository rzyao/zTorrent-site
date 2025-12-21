import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  // 片单详情数据与行为统一由钩子管理
  const { loading, error, playlist, movies, isFollowing, toggleFollow, reload, openFilm } =
    usePlaylistDetail(playlistId);
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
      <div className="mt-8">
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
