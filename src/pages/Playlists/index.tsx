import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { Playlist } from "@/pages/Playlists/types";
import { usePlaylists } from "@/pages/Playlists/hooks/usePlaylists";
import { PlaylistCard } from "@/pages/Playlists/components/PlaylistCard";
import { PlaylistsControls } from "@/pages/Playlists/components/PlaylistsControls";
import { EmptyState } from "@/pages/Playlists/components/EmptyState";
import { PageContainer } from "@/layouts/PageContainer";

export function PlaylistsPage() {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    items,
    loading,
    error,
    page,
    setPage,
    pageSize,
    toggleFollow,
    incViews,
  } = usePlaylists();

  const handlePlaylistClick = (playlist: Playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <PageContainer>
      <PlaylistsControls
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onCreate={() => {}}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {items.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={handlePlaylistClick}
            onFollowToggle={toggleFollow}
          />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <EmptyState
          activeTab={activeTab}
          onCreate={() => {
            navigate("/edit/playlist");
          }}
        />
      )}
      {loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-neutral-600" />
          </div>
          <h3 className="text-white text-xl mb-2">加载中...</h3>
          <p className="text-neutral-500">正在获取片单列表</p>
        </div>
      )}
      {error && <div className="text-center py-6 text-red-400">{error}</div>}
    </PageContainer>
  );
}
