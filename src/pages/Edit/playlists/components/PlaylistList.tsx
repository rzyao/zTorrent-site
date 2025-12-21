import { Search, Globe, Lock, Users, ListVideo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Playlist } from "@/pages/Edit/playlists/types";
import { APPROVAL_STATUS_LABELS, APPROVAL_STATUS_COLORS } from "@/pages/Edit/playlists/types";
import { getVisibilityText } from "@/pages/Edit/playlists/utils";

interface PlaylistListProps {
  /** 片单列表数据 */
  playlists: Playlist[];
  /** 当前选中的片单 id（用于高亮） */
  selectedId: string | null;
  /** 搜索关键词（受控） */
  searchQuery: string;
  /** 搜索关键词变更回调 */
  onSearchChange: (value: string) => void;
  /** 选择片单项回调 */
  onSelect: (playlist: Playlist) => void;
}

/**
 * 左侧片单列表组件：纯展示与交互事件的组合。
 * 不包含任何业务逻辑（数据加载、映射、后端调用），
 * 通过 props 接收数据与事件，保证无状态、可复用、易测试。
 */
export function PlaylistList({
  playlists,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
}: PlaylistListProps) {
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4" />;
      case "private":
        return <Lock className="h-4 w-4" />;
      case "friends":
        return <Users className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const filtered = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm">
      <div className="border-b border-neutral-700/50 p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索片单..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 py-2.5 pr-4 pl-10 text-white placeholder-neutral-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
        </div>
      </div>

      <div className="scrollbar-themed max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <ListVideo className="mx-auto mb-3 h-12 w-12 text-neutral-600" />
            <p className="text-sm text-neutral-500">暂无片单</p>
          </div>
        ) : (
          filtered.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onSelect(playlist)}
              className={`cursor-pointer rounded-xl p-4 transition-all ${
                selectedId === playlist.id
                  ? "border border-amber-500/30 bg-linear-to-r from-amber-500/20 to-orange-600/20"
                  : "border border-neutral-700/50 bg-neutral-900/30 hover:border-neutral-600"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 truncate text-sm text-white">{playlist.title}</h3>
                  <p className="mb-2 line-clamp-2 text-xs text-neutral-400">
                    {playlist.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={`px-2 py-0.5 text-[10px] font-medium ${
                        playlist.visibility === "public"
                          ? "bg-green-500/20 text-green-400"
                          : playlist.visibility === "private"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {getVisibilityIcon(playlist.visibility)}
                      <span className="ml-1">{getVisibilityText(playlist.visibility)}</span>
                    </Badge>
                    <Badge
                      className={`border px-2 py-0.5 text-[10px] font-medium ${APPROVAL_STATUS_COLORS[playlist.approvalStatus]}`}
                    >
                      {APPROVAL_STATUS_LABELS[playlist.approvalStatus]}
                    </Badge>
                    <span className="text-xs whitespace-nowrap text-neutral-500">
                      {playlist.movies.length} 部影片
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
