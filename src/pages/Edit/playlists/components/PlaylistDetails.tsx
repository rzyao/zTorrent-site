import { Button } from '@/components/ui/button';
import { AccessControl } from '@/components/AccessControl';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Calendar, Eye, Star, Film, Plus, GripVertical, Globe, Lock, Users } from 'lucide-react';
import type { Playlist, Movie } from '@/pages/Edit/playlists/types';
import { getVisibilityText } from '@/pages/Edit/playlists/utils';

interface PlaylistDetailsProps {
  /** 当前选中的片单 */
  playlist: Playlist;
  /** 进入编辑的回调 */
  onEdit: (playlist: Playlist) => void;
  /** 删除片单回调 */
  onDelete: (id: string) => void;
  /** 是否展示添加影片面板 */
  showAddMovie: boolean;
  /** 切换添加影片面板显示 */
  onToggleAddMovie: () => void;
  /** 添加影片回调 */
  onAddMovie: (movie: Movie) => void;
  /** 移除影片回调 */
  onRemoveMovie: (movieId: string) => void;
  /** 上/下移动影片回调 */
  onMoveMovie: (index: number, dir: 'up' | 'down') => void;
  /** 可用影片集合（当未搜索时使用） */
  available: Movie[];
  /** 搜索框受控值 */
  addQuery: string;
  /** 搜索框变更 */
  onAddQueryChange: (value: string) => void;
  /** 是否正在搜索 */
  isSearching: boolean;
  /** 搜索结果 */
  searchResults: Movie[];
}

/**
 * 片单详情组件：只负责展示当前片单与触发交互事件。
 * 内部包含两个子展示组件：添加影片面板与影片列表。
 */
export function PlaylistDetails(props: PlaylistDetailsProps) {
  const { playlist, onEdit, onDelete, showAddMovie, onToggleAddMovie, onAddMovie, onRemoveMovie, onMoveMovie, available, addQuery, onAddQueryChange, isSearching, searchResults } = props;

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

  return (
    <div className="space-y-6">
      {/* 片单头部 */}
      <div className="flex items-start gap-4">
        <img src={playlist.cover} alt={playlist.title} className="w-32 h-32 rounded-xl object-cover" />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-white text-2xl mb-2">{playlist.title}</h2>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${playlist.visibility === 'public' ? 'bg-green-500/20 text-green-400' : playlist.visibility === 'private' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {getVisibilityIcon(playlist.visibility)}
                  <span className="ml-1">{getVisibilityText(playlist.visibility)}</span>
                </Badge>
                <span className="text-neutral-400 text-sm flex items-center gap-1">
                  <Film className="w-4 h-4" />
                  {playlist.movies.length} 部影片
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {/* 编辑片单按钮：需要更新权限 */}
              <AccessControl
                requiredPermissions={['playlist:update']}
                name="编辑片单"
                fallback={
                  <Button size="sm" disabled className="bg-neutral-700 text-neutral-400">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑
                  </Button>
                }
              >
                <Button size="sm" onClick={() => onEdit(playlist)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </Button>
              </AccessControl>
              {/* 删除片单按钮：需要删除权限 */}
              <AccessControl
                requiredPermissions={['playlist:delete']}
                name="删除片单"
                fallback={
                  <Button size="sm" variant="outline" disabled className="border-neutral-700 text-neutral-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                }
              >
                <Button size="sm" variant="outline" onClick={() => onDelete(playlist.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AccessControl>
            </div>
          </div>
          <p className="text-neutral-400 text-sm mb-3">{playlist.description}</p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              创建于 {playlist.createdAt}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {playlist.views} 次观看
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {playlist.likes} 个点赞
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 影片列表与添加 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">片单影片</h3>
          {/* 添加影片入口：需要条目添加权限 */}
          <AccessControl
            requiredPermissions={['playlist:item.add']}
            name="添加影片"
            fallback={
              <Button size="sm" disabled className="bg-neutral-700 text-neutral-400">
                <Plus className="w-4 h-4 mr-2" />
                添加影片
              </Button>
            }
          >
            <Button size="sm" onClick={onToggleAddMovie} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              添加影片
            </Button>
          </AccessControl>
        </div>

        {showAddMovie && (
          <AddMoviePanel
            available={available}
            addQuery={addQuery}
            onAddQueryChange={onAddQueryChange}
            isSearching={isSearching}
            searchResults={searchResults}
            onAddMovie={onAddMovie}
          />
        )}

        {playlist.movies.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-700 rounded-xl">
            <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm mb-3">片单中还没有影片</p>
            <AccessControl
              requiredPermissions={['playlist:item.add']}
              name="添加影片"
              fallback={
                <Button size="sm" disabled className="bg-neutral-700 text-neutral-400">
                  <Plus className="w-4 h-4 mr-2" />
                  添加第一部影片
                </Button>
              }
            >
              <Button size="sm" onClick={onToggleAddMovie} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                添加第一部影片
              </Button>
            </AccessControl>
          </div>
        ) : (
          <MoviesList movies={playlist.movies} onMove={onMoveMovie} onRemove={onRemoveMovie} />
        )}
      </div>
    </div>
  );
}

interface AddMoviePanelProps {
  available: Movie[];
  addQuery: string;
  onAddQueryChange: (value: string) => void;
  isSearching: boolean;
  searchResults: Movie[];
  onAddMovie: (movie: Movie) => void;
}

/**
 * 添加影片面板：无状态、受控的搜索与选择列表。
 */
function AddMoviePanel({ available, addQuery, onAddQueryChange, isSearching, searchResults, onAddMovie }: AddMoviePanelProps) {
  return (
    <div className="mb-6 p-6 rounded-xl bg-neutral-900/30 border border-amber-500/30">
      <h4 className="text-white mb-4">从影片库选择</h4>
      <div className="relative mb-4">
        <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" aria-hidden>
          <path fill="currentColor" d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
        </svg>
        <input
          type="text"
          value={addQuery}
          onChange={(e) => onAddQueryChange(e.target.value)}
          placeholder="搜索影片标题或原名..."
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>
      {isSearching && <p className="text-neutral-500 text-sm mb-3">正在搜索...</p>}
      {addQuery.trim() && !isSearching && searchResults.length === 0 && (
        <p className="text-neutral-500 text-sm mb-3">暂无匹配影片</p>
      )}
      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto scrollbar-themed">
        {(addQuery.trim() ? searchResults : available).map((movie) => (
          <div key={movie.id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50 hover:border-amber-500/30 transition-all">
            <img src={movie.poster} alt={movie.title} className="w-12 h-16 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <h5 className="text-white text-sm truncate">{movie.title}</h5>
              <p className="text-neutral-400 text-xs truncate">{movie.originalTitle} ({movie.year})</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-amber-400 text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {movie.rating}
                </span>
                <span className="text-neutral-500 text-xs">{movie.torrentCount} 个版本</span>
              </div>
            </div>
            <AccessControl
              requiredPermissions={['playlist:item.add']}
              name="添加影片"
              fallback={<Button size="sm" disabled className="bg-neutral-700 text-neutral-400">添加</Button>}
            >
              <Button size="sm" onClick={() => onAddMovie(movie)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">添加</Button>
            </AccessControl>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MoviesListProps {
  movies: Movie[];
  onMove: (index: number, dir: 'up' | 'down') => void;
  onRemove: (movieId: string) => void;
}

/**
 * 影片列表：只负责展示与触发移动/移除事件。
 */
function MoviesList({ movies, onMove, onRemove }: MoviesListProps) {
  return (
    <div className="space-y-3">
      {movies.map((movie, index) => (
        <div key={movie.id} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all group">
          <div className="cursor-move text-neutral-600 group-hover:text-neutral-400">
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="text-neutral-500 text-sm w-6">{index + 1}</span>
          <img src={movie.poster} alt={movie.title} className="w-12 h-16 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm mb-1 truncate">{movie.title}</h4>
            <p className="text-neutral-400 text-xs mb-2 truncate">{movie.originalTitle}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <Badge className="bg-neutral-800 text-neutral-300">{movie.category}</Badge>
              <span>{movie.year}</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {movie.rating}
              </span>
              <span>{movie.torrentCount} 个版本</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AccessControl
              requiredPermissions={['playlist:order.update']}
              name="上移"
              fallback={<Button size="sm" variant="ghost" disabled className="text-neutral-400">上移</Button>}
            >
              <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white" onClick={() => onMove(index, 'up')}>上移</Button>
            </AccessControl>
            <AccessControl requiredPermissions={['playlist:order.update']} name="下移" fallback={<Button size="sm" variant="ghost" disabled className="text-neutral-400">下移</Button>}>
              <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white" onClick={() => onMove(index, 'down')}>下移</Button>
            </AccessControl>
          </div>
          <AccessControl requiredPermissions={['playlist:item.remove']} name="移除影片" fallback={
            <Button size="sm" variant="ghost" disabled className="opacity-0 group-hover:opacity-100 text-neutral-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          }>
            <Button size="sm" variant="ghost" onClick={() => onRemove(movie.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AccessControl>
        </div>
      ))}
    </div>
  );
}

