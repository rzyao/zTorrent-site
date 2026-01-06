import type { Artist, ViewMode } from "../types";

interface ArtistsSectionProps {
  artists: Artist[];
  viewMode: ViewMode;
}

/**
 * 歌手 Tab 内容（支持网格/列表两种视图）
 */
export function ArtistsSection({ artists, viewMode }: ArtistsSectionProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 p-6 hover:border-green-500/50 transition-all text-center cursor-pointer"
          >
            <img src={artist.avatar} alt={artist.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="text-white truncate mb-1">{artist.name}</h3>
            <p className="text-neutral-400 text-sm mb-2">
              {artist.followers.toLocaleString()} 粉丝
            </p>
            <p className="text-neutral-500 text-xs">{artist.songs} 首歌曲</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer border-b border-neutral-700/30 last:border-0"
        >
          <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
          <img src={artist.avatar} alt={artist.name} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-white">{artist.name}</p>
            <p className="text-neutral-400 text-sm">{artist.songs} 首歌曲</p>
          </div>
          <div className="text-right">
            <p className="text-neutral-400 text-sm">粉丝</p>
            <p className="text-white">{artist.followers.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

