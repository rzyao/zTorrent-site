import { Film, Play, Star, Users, Eye, TrendingUp, Heart } from 'lucide-react';
import type { Playlist } from '../../playlists/types';

interface Props {
  playlist: Playlist;
  onClick: (playlist: Playlist) => void;
  onFollowToggle: (id: string) => void;
}

export function PlaylistCard({ playlist, onClick, onFollowToggle }: Props) {
  return (
    <div
      className="group bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
      onClick={() => onClick(playlist)}
    >
      <div className="relative aspect-video overflow-hidden">
        {playlist.coverImage ? (
          <img
            src={playlist.coverImage}
            alt={playlist.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <Film className="w-10 h-10 text-neutral-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1.5">
          <Film className="w-4 h-4 text-amber-400" />
          <span className="text-white text-sm">{playlist.moviesCount} 部</span>
        </div>
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          <span className="text-white text-sm">{playlist.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-white text-lg mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
          {playlist.title}
        </h3>
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
          {playlist.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(playlist.tags ?? []).slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm shadow-lg shadow-amber-500/30">
            {playlist.creatorAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm truncate">{playlist.creator}</div>
            <div className="text-neutral-500 text-xs">创建者</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-sm">{playlist.followersCount}</span>
            </div>
            <div className="text-neutral-500 text-xs">关注</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-sm">{playlist.viewsCount}</span>
            </div>
            <div className="text-neutral-500 text-xs">浏览</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-sm">{playlist.moviesCount}</span>
            </div>
            <div className="text-neutral-500 text-xs">影片</div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFollowToggle(playlist.id);
          }}
          className={`w-full py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${playlist.isFollowing
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
            : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 hover:text-white'
            }`}
        >
          <Heart className={`w-4 h-4 ${playlist.isFollowing ? 'fill-current' : ''}`} />
          <span>{playlist.isFollowing ? '已关注' : '关注'}</span>
        </button>
      </div>
    </div>
  );
}

