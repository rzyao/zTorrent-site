import { ListMusic, Pause, Play, Repeat, Shuffle, Volume2, VolumeX, Heart, ChevronUp, SkipBack, SkipForward } from 'lucide-react';
import type { PlayMode, Song } from '@/pages/PlayerPage/types';

/**
 * PlayerBar
 * 底部播放控制栏（进度条、当前歌曲信息、播放/音量控制）
 * 纯展示组件：通过 props 接收数据与回调，不包含业务逻辑或状态
 */
export interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  isCurrentLiked: boolean;
  onOpenDetail: () => void;
  onToggleLike: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onCyclePlayMode: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  getPlayModeText: () => string;
  formatTime: (sec: number) => string;
}

export function PlayerBar(props: PlayerBarProps) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    isCurrentLiked,
    onOpenDetail,
    onToggleLike,
    onProgressClick,
    onPlayPause,
    onPrevious,
    onNext,
    onCyclePlayMode,
    onVolumeChange,
    onToggleMute,
    getPlayModeText,
    formatTime,
  } = props;

  const renderPlayModeIcon = () => {
    switch (playMode) {
      case 'shuffle':
        return <Shuffle className="w-5 h-5" />;
      case 'repeat':
        return <Repeat className="w-5 h-5" />;
      default:
        return <ListMusic className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-neutral-700/50 bg-linear-to-br from-neutral-900 to-stone-950 backdrop-blur-xl">
      {/* 进度条 */}
      <div onClick={onProgressClick} className="group relative h-1 cursor-pointer bg-neutral-800">
        <div
          className="relative h-full bg-linear-to-r from-amber-500 to-orange-600 transition-all"
          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
        >
          <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {/* 控制栏 */}
      <div className="px-4 py-3">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4">
          {/* 左侧：当前歌曲信息 */}
          <div
            className="-m-2 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg p-2 transition-all hover:bg-neutral-800/30"
            onClick={onOpenDetail}
          >
            <img src={currentSong?.cover || ''} alt={currentSong?.title || ''} className="h-14 w-14 rounded-lg object-cover shadow-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-white">{currentSong?.title || '未选择歌曲'}</p>
              <p className="truncate text-sm text-neutral-400">{currentSong?.artist || ''}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike();
              }}
              className={`rounded-lg p-2 transition-all ${isCurrentLiked ? 'text-red-400 hover:bg-red-500/20' : 'text-neutral-400 hover:bg-neutral-800 hover:text-red-400'}`}
            >
              <Heart className={`h-5 w-5 ${isCurrentLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* 中间：播放控制 */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <button onClick={onCyclePlayMode} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white" title={getPlayModeText()}>
                {renderPlayModeIcon()}
              </button>
              <button onClick={onPrevious} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                <SkipBack className="h-5 w-5" />
              </button>
              <button onClick={onPlayPause} className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-orange-700">
                {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="ml-0.5 h-5 w-5 text-white" />}
              </button>
              <button onClick={onNext} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                <SkipForward className="h-5 w-5" />
              </button>
              <button className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                <ListMusic className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 右侧：音量控制 */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <button onClick={onToggleMute} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-neutral-700 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <button onClick={onOpenDetail} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
