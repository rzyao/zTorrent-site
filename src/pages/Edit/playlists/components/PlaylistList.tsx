import { Search, Globe, Lock, Users, ListVideo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Playlist } from '@/pages/Edit/playlists/types';
import { getVisibilityText } from '@/pages/Edit/playlists/utils';

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
export function PlaylistList({ playlists, selectedId, searchQuery, onSearchChange, onSelect }: PlaylistListProps) {
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'friends':
        return <Users className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const filtered = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
      <div className="p-4 border-b border-neutral-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索片单..."
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-themed ">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <ListVideo className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">暂无片单</p>
          </div>
        ) : (
          filtered.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onSelect(playlist)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${selectedId === playlist.id
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30'
                : 'bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600'
                }`}
            >
              <div className="flex gap-3">
                <img src={playlist.cover} alt={playlist.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm mb-1 truncate">{playlist.title}</h3>
                  <p className="text-neutral-400 text-xs line-clamp-2 mb-2">{playlist.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${playlist.visibility === 'public'
                      ? 'bg-green-500/20 text-green-400'
                      : playlist.visibility === 'private'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                      }`}>
                      {getVisibilityIcon(playlist.visibility)}
                      <span className="ml-1">{getVisibilityText(playlist.visibility)}</span>
                    </Badge>
                    <span className="text-neutral-500 text-xs">{playlist.movies.length} 部影片</span>
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

