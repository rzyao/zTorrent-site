import { Heart, FolderHeart, Library } from 'lucide-react';
import type { LibraryView } from '@/modules/app/pages/PlayerPage/types';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * LibrarySidebar
 * 纯展示：左侧导航侧栏（我喜欢/收藏/歌单）
 * 通过 props 接收当前视图与计数，以及点击回调
 */
export interface LibrarySidebarProps {
  view: LibraryView;
  likedCount: number;
  albumsCount: number;
  playlistsCount: number;
  onSelectLiked: () => void;
  onSelectAlbums: () => void;
  onSelectPlaylists: () => void;
}

export function LibrarySidebar(props: LibrarySidebarProps) {
  const { view, likedCount, albumsCount, playlistsCount, onSelectAlbums, onSelectLiked, onSelectPlaylists } = props;
  const { t } = useLanguage();
  return (
    <div className="w-56 shrink-0">
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-2xl border border-neutral-700/50 p-4 sticky top-24">
        <h3 className="text-neutral-400 text-sm mb-3 px-2">{t('player.myMusic')}</h3>
        <nav className="space-y-1">
          <button
            onClick={onSelectLiked}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'liked'
              ? 'bg-linear-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <Heart className={`w-4 h-4 ${view === 'liked' ? 'fill-current' : ''}`} />
            <span className="text-sm">{t('player.liked')}</span>
            <span className="ml-auto text-xs">{likedCount}</span>
          </button>
          <button
            onClick={onSelectAlbums}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'albums'
              ? 'bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <FolderHeart className="w-4 h-4" />
            <span className="text-sm">{t('player.favorites')}</span>
            <span className="ml-auto text-xs">{albumsCount}</span>
          </button>
          <button
            onClick={onSelectPlaylists}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'playlists' || view === 'playlist-detail'
              ? 'bg-linear-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <Library className="w-4 h-4" />
            <span className="text-sm">{t('player.playlists')}</span>
            <span className="ml-auto text-xs">{playlistsCount}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

