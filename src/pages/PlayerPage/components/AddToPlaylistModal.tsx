import type { Playlist, Song } from '@/pages/PlayerPage/types';

export interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  playlists: Playlist[];
  onAdd: (playlistId: string) => void;
  onCreateNew: () => void;
}

export function AddToPlaylistModal(props: AddToPlaylistModalProps) {
  const { isOpen, onClose, song, playlists, onAdd, onCreateNew } = props;

  if (!isOpen) return null;

  const ownPlaylists = playlists.filter((p) => p.isOwn);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-800 to-stone-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl text-white">添加到歌单</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">✕</button>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-lg bg-neutral-900/50 p-3">
          <img src={song.cover} alt={song.title} className="h-12 w-12 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-white">{song.title}</p>
            <p className="truncate text-sm text-neutral-400">{song.artist}</p>
          </div>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {ownPlaylists.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-neutral-800/50" />
              <p>还没有创建歌单</p>
              <button onClick={onCreateNew} className="mt-3 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm text-white transition-all hover:from-amber-600 hover:to-orange-700">
                创建歌单
              </button>
            </div>
          ) : (
            ownPlaylists.map((playlist) => {
              const alreadyAdded = playlist.songs.find((s) => s.id === song.id);
              return (
                <button
                  key={playlist.id}
                  onClick={() => !alreadyAdded && onAdd(playlist.id)}
                  disabled={!!alreadyAdded}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 transition-all ${alreadyAdded ? 'cursor-not-allowed bg-neutral-800/50 opacity-50' : 'bg-neutral-900/50 hover:bg-neutral-800'}`}
                >
                  <img src={playlist.cover} alt={playlist.title} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-white">{playlist.title}</p>
                    <p className="text-sm text-neutral-400">{playlist.songs.length} 首歌曲</p>
                  </div>
                  {alreadyAdded && <span className="text-sm text-green-400">已添加</span>}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

