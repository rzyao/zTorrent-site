import { ArrowLeft, Heart, Share2, Eye, Film, Star, Play } from 'lucide-react';
import type { PlaylistDetail } from '../types';

interface HeroProps {
  playlist: PlaylistDetail | null;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onBack: () => void;
}

// 片单页顶部横幅与操作区
// 拆分原因：
// - 将页面的头部展示（封面、标题、统计、按钮）独立为纯展示组件，便于复用与维护
// - 降低主页面文件体积与复杂度
export function Hero({ playlist, isFollowing, onToggleFollow, onBack }: HeroProps) {
  return (
    <div className="relative h-[500px]">
      {/* 返回按钮浮层 */}
      <div className="absolute inset-0 px-8 pt-24 pointer-events-none">
        <button
          onClick={onBack}
          className="sticky top-0 z-50 px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-all flex items-center gap-2 backdrop-blur-sm pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回片单</span>
        </button>
      </div>

      {/* 背景封面与遮罩 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${playlist?.coverImage ?? ''})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/80 to-transparent" />

      {/* 片单信息区 */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto">
          {/* 标签 */}
          <div className="flex items-center gap-3 mb-4">
            {(playlist?.tags ?? []).map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-5xl text-white mb-4">{playlist?.title ?? ''}</h1>

          {/* 统计 */}
          <div className="flex items-center gap-6 mb-4 text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white text-sm">{playlist?.creatorAvatar ?? ''}</span>
              </div>
              <span>{playlist?.creator ?? ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span>{playlist?.moviesCount ?? 0} 部影片</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{Number(playlist?.followersCount ?? 0).toLocaleString()} 关注</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{Number(playlist?.viewsCount ?? 0).toLocaleString()} 浏览</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{typeof playlist?.rating === 'number' ? (playlist!.rating as number).toFixed(1) : '0.0'}</span>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-gray-300 text-lg max-w-4xl mb-6 leading-relaxed">{playlist?.description ?? ''}</p>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onToggleFollow}
              className={`px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 ${isFollowing
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                }`}
            >
              <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
              <span>{isFollowing ? '已关注' : '关注片单'}</span>
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>分享</span>
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>播放全部</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

