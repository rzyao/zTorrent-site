import { ListMusic, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Playlist } from "@/modules/app/pages/PlayerPage/types";
import { ConfirmModal } from "@/modules/app/components/ConfirmModal";

/**
 * PlaylistsView
 * 纯展示：我的歌单卡片列表
 * 通过 props 接收歌单列表与点击回调
 */
export interface PlaylistsViewProps {
  playlists: Playlist[];
  onCreate: () => void;
  onOpen: (playlistId: string) => void;
  onDelete: (playlistId: string) => void;
}

export function PlaylistsView(props: PlaylistsViewProps) {
  const { onCreate, onDelete, onOpen, playlists } = props;
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl text-white">
          <ListMusic className="h-5 w-5 text-purple-400" />
          我的歌单
          <span className="text-sm text-neutral-500">({playlists.length})</span>
        </h2>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2 text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-orange-700"
        >
          <Plus className="h-4 w-4" />
          新建歌单
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => onOpen(playlist.id)}
            className="group relative cursor-pointer rounded-xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-4 transition-all hover:border-purple-500/50"
          >
            <div className="relative mb-3">
              <img
                src={playlist.cover}
                alt={playlist.title}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-all group-hover:opacity-100">
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 transition-all hover:bg-purple-600">
                  <Play className="ml-0.5 h-6 w-6 text-white" />
                </button>
              </div>
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-white">{playlist.title}</h3>
                <p className="truncate text-sm text-neutral-400">{playlist.creator}</p>
                <p className="mt-1 text-xs text-neutral-500">{playlist.songs.length} 首歌曲</p>
              </div>
              {playlist.isOwn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(playlist.id);
                  }}
                  className="rounded-lg p-1.5 text-neutral-500 transition-all hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={!!confirmDeleteId}
        onOpenChange={(v) => !v && setConfirmDeleteId(null)}
        title="确认删除歌单"
        description="确定要删除这个歌单吗？此操作无法撤销。"
        onConfirm={() => {
          if (confirmDeleteId) onDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        variant="destructive"
      />
    </div>
  );
}
