import { X, Plus, ListMusic } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { MyPlaylist, Song } from "../types";

interface AddToPlaylistModalProps {
  open: boolean;
  song: Song | null;
  myPlaylists: MyPlaylist[];
  onClose: () => void;
  onAdd: (playlistId: string) => void;
}

/**
 * “添加到歌单”对话框
 * - 纯展示组件，接受外部状态与回调
 */
export function AddToPlaylistModal({
  open,
  song,
  myPlaylists,
  onClose,
  onAdd,
}: AddToPlaylistModalProps) {
  const { t } = useLanguage();
  if (!open || !song) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl">{t('music.addToPlaylist')}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-neutral-900/50 rounded-lg flex items-center gap-3">
          <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-white truncate">{song.title}</p>
            <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {myPlaylists.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t('music.noPlaylists')}</p>
              <p className="text-sm mt-1">{t('music.createPlaylistHint')}</p>
            </div>
          ) : (
            myPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => onAdd(playlist.id)}
                className="w-full p-3 rounded-lg flex items-center gap-3 transition-all bg-neutral-900/50 hover:bg-neutral-800"
              >
                <img src={playlist.cover} alt={playlist.title} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white truncate">{playlist.title}</p>
                  <p className="text-neutral-400 text-sm">{t('music.songsCount', { count: playlist.songs.length })}</p>
                </div>
                <Plus className="w-5 h-5 text-neutral-400" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

