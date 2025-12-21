import {
  Film,
  Play,
  Star,
  Users,
  Eye,
  TrendingUp,
  HeartPlus,
  Clapperboard,
  UserRoundPlus,
  UserPlus,
  HeartPulse,
  HeartCrack,
  HeartHandshake,
} from "lucide-react";
import type { Playlist } from "../types";
import { formatDate } from "@/pages/Invite/utils";

interface Props {
  playlist: Playlist;
  onClick: (playlist: Playlist) => void;
  onFollowToggle: (id: string) => void;
}

export function PlaylistCard({ playlist, onClick, onFollowToggle }: Props) {
  return (
    <div
      className="group relative h-[260px] rounded-2xl overflow-hidden border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50 cursor-pointer flex flex-col"
      onClick={() => onClick(playlist)}
    >
      {/* 背景图层：海报作为背景并模糊处理 */}
      <div className="absolute inset-0 z-0">
        <img
          src={playlist.coverImage}
          alt=""
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-40 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-900/90 to-black/80" />
      </div>

      {/* 内容图层：占据主要位置 */}
      <div className="relative z-10 flex flex-col h-full p-5 flex-1">
        {/* 顶部：分类与评分 */}
        <div className="flex items-center justify-between mb-4">
          <div className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            Playlist
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            <span className="text-xs font-bold">{playlist.rating}</span>
          </div>
        </div>

        {/* 中部：标题与详细描述 */}
        <div className="flex-1 mb-4">
          <div className="text-white text-lg font-bold mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors duration-300">
            {playlist.title}
          </div>
          <p className="text-neutral-300 text-xs leading-relaxed line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
            {playlist.description || "一个充满惊喜的影片收藏，等待你的探索。"}
          </p>
        </div>

        {/* 底部：信息区域分两行展示 */}
        <div className="mt-auto space-y-3">
          {/* 第一行：创建者信息 */}
          <div className="flex items-center gap-2">
            {playlist.creatorAvatar ? (
              <div className="w-6 h-6 rounded-full bg-linear-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                {playlist.creatorAvatar}
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-neutral-500" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-neutral-200 text-[11px] font-medium leading-none mb-1 truncate max-w-[160px]">
                {playlist.creator}
              </span>
              <span className="text-neutral-500 text-[9px] leading-none">
                {formatDate(playlist.createdAt)}
              </span>
            </div>
          </div>

          {/* 第二行：统计数据（包含资源数、浏览量、关注数） */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-neutral-400">
            <div className="flex items-center gap-1">
              <Clapperboard className="w-4 h-4 text-green-500/70" />
              <span className="text-[10px] font-bold text-white/90">
                {playlist.moviesCount}
              </span>
            </div>
            <div className="w-[1px] h-3 bg-white/5" />
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-blue-500/70" />
              <span className="text-[10px] font-bold text-white/90">
                {playlist.viewsCount}
              </span>
            </div>
            <div className="w-[1px] h-3 bg-white/5" />
            <div className="flex items-center gap-1">
              <UserRoundPlus className="w-4 h-4 text-amber-500/70" />
              <span className="text-[10px] font-bold text-white/90">
                {playlist.followersCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
