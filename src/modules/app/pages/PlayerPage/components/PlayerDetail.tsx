import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Share2, MoreVertical, Heart, Disc, ListMusic, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import type { DetailTab, PlayMode, Song } from '@/modules/app/pages/PlayerPage/types';
import { formatTime } from '@/modules/app/pages/PlayerPage/utils';

/**
 * PlayerDetail
 * 播放详情页（黑胶唱片、歌词/评论/相似推荐）
 * 纯展示组件：通过 props 接收数据与交互回调，不包含业务逻辑或状态
 */
export interface PlayerDetailProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  isCurrentLiked: boolean;
  lyrics: any;
  comments: any[];
  detailTab: DetailTab;
  similarList: Song[];
  songs: Song[];
  onToggleLike: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onCyclePlayMode: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  getPlayModeText: () => string;
  setDetailTab: (tab: DetailTab) => void;
  onSelectSongById: (songId: string) => void;
}

export function PlayerDetail(props: PlayerDetailProps) {
  const {
    isOpen,
    onClose,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    isCurrentLiked,
    lyrics,
    comments,
    detailTab,
    similarList,
    songs,
    onToggleLike,
    onProgressClick,
    onPlayPause,
    onPrevious,
    onNext,
    onCyclePlayMode,
    onVolumeChange,
    onToggleMute,
    getPlayModeText,
    setDetailTab,
    onSelectSongById,
  } = props;

  const renderPlayModeIcon = () => {
    switch (playMode) {
      case 'shuffle':
        return <ListMusic className="h-6 w-6" />; // 使用列表图标表示随机/序列的占位
      case 'repeat':
        return <ListMusic className="h-6 w-6" />;
      default:
        return <ListMusic className="h-6 w-6" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 flex flex-col bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950"
        >
          {/* 顶部操作栏 */}
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-800/50 px-8 py-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                <ChevronDown className="h-6 w-6" />
              </button>
              <div>
                <h2 className="text-white">正在播放</h2>
                <p className="text-sm text-neutral-500">{currentSong?.album || ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onToggleLike} className={`rounded-lg p-2 transition-all ${isCurrentLiked ? 'bg-red-500/20 text-red-400' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                <Heart className={`h-5 w-5 ${isCurrentLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                <Download className="h-5 w-5" />
              </button>
              <button className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="flex-1 overflow-hidden">
            <div className="mx-auto grid h-full max-w-[1400px] grid-cols-2 gap-12 px-8 py-8">
              {/* 左侧：黑胶唱片 */}
              <div className="flex flex-col items-center justify-center">
                {/* 黑胶唱片容器 */}
                <div className="relative mb-12 aspect-square w-full max-w-[500px]">
                  {/* 唱针 */}
                  <motion.div className="absolute -top-8 right-[35%] z-20 origin-top-right" animate={{ rotate: isPlaying ? 0 : -25 }} transition={{ duration: 0.5 }}>
                    <div className="relative h-40 w-32">
                      <div className="absolute top-0 right-0 h-32 w-2 rounded-full bg-linear-to-b from-neutral-600 to-neutral-700 shadow-xl" />
                      <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-neutral-400" />
                      <div className="absolute top-0 right-0 h-4 w-4 rounded-full border-2 border-neutral-600 bg-neutral-700" />
                    </div>
                  </motion.div>

                  {/* 黑胶唱片外圈 */}
                  <motion.div className="absolute inset-0 rounded-full bg-linear-to-br from-neutral-900 to-black shadow-2xl" animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                    <div className="absolute inset-0 rounded-full">
                      {[...Array(30)].map((_, i) => (
                        <div key={i} className="absolute inset-0 rounded-full border border-neutral-800/30" style={{ margin: `${i * 3}px` }} />
                      ))}
                    </div>

                    {/* 封面区域 */}
                    <div className="absolute top-1/2 left-1/2 aspect-square w-[55%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-neutral-800 shadow-2xl">
                      <img src={currentSong?.cover || ''} alt={currentSong?.title || ''} className="h-full w-full object-cover" />
                    </div>

                    {/* 中心圆点 */}
                    <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-600 bg-linear-to-br from-neutral-700 to-neutral-900 shadow-inner" />
                  </motion.div>
                </div>

                {/* 歌曲信息 */}
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl text-white">{currentSong?.title || ''}</h1>
                  <p className="text-lg text-neutral-400">{currentSong?.artist || ''}</p>
                </div>

                {/* 进度条 */}
                <div className="mb-6 w-full max-w-[500px]">
                  <div onClick={onProgressClick} className="group mb-2 h-1.5 cursor-pointer rounded-full bg-neutral-800">
                    <div className="relative h-full rounded-full bg-linear-to-r from-amber-500 to-orange-600 transition-all" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}>
                      <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* 播放控制 */}
                <div className="flex items-center gap-6">
                  <button onClick={onCyclePlayMode} className="rounded-lg p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white" title={getPlayModeText()}>
                    {renderPlayModeIcon()}
                  </button>
                  <button onClick={onPrevious} className="rounded-lg p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                    <SkipBack className="h-6 w-6" />
                  </button>
                  <button onClick={onPlayPause} className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/50 transition-all hover:scale-105 hover:from-amber-600 hover:to-orange-700">
                    {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="ml-0.5 h-7 w-7 text-white" />}
                  </button>
                  <button onClick={onNext} className="rounded-lg p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                    <SkipForward className="h-6 w-6" />
                  </button>
                  <button className="rounded-lg p-2.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
                    <ListMusic className="h-6 w-6" />
                  </button>
                </div>

                {/* 音量控制 */}
                <div className="mt-6 flex w-48 items-center gap-3">
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
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-700 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              </div>

              {/* 右侧：歌词/评论/相似 */}
              <div className="flex flex-col overflow-hidden">
                {/* Tab导航 */}
                <div className="mb-6 flex items-center gap-8 border-b border-neutral-800">
                  <button onClick={() => setDetailTab('lyrics')} className={`relative pb-3 transition-all ${detailTab === 'lyrics' ? 'text-white' : 'text-neutral-400 hover:text-neutral-300'}`}>
                    歌词
                    {detailTab === 'lyrics' && <motion.div layoutId="detailTab" className="absolute right-0 bottom-0 left-0 h-0.5 bg-amber-500" />}
                  </button>
                  <button onClick={() => setDetailTab('comments')} className={`relative pb-3 transition-all ${detailTab === 'comments' ? 'text-white' : 'text-neutral-400 hover:text-neutral-300'}`}>
                    评论
                    {detailTab === 'comments' && <motion.div layoutId="detailTab" className="absolute right-0 bottom-0 left-0 h-0.5 bg-amber-500" />}
                  </button>
                  <button onClick={() => setDetailTab('similar')} className={`relative pb-3 transition-all ${detailTab === 'similar' ? 'text-white' : 'text-neutral-400 hover:text-neutral-300'}`}>
                    相似推荐
                    {detailTab === 'similar' && <motion.div layoutId="detailTab" className="absolute right-0 bottom-0 left-0 h-0.5 bg-amber-500" />}
                  </button>
                </div>

                {/* Tab内容 */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {detailTab === 'lyrics' && (
                      <motion.div key="lyrics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="space-y-6 pr-4">
                        {lyrics && Array.isArray(lyrics?.lines) && lyrics.lines.length > 0 ? (
                          <div className="space-y-2 py-8 text-center">
                            {lyrics.lines.map((l: any, idx: number) => (
                              <p key={idx} className="text-neutral-200">{l.text}</p>
                            ))}
                          </div>
                        ) : (
                          <div className="py-20 text-center">
                            <Disc className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                            <p className="text-neutral-500">暂无歌词</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {detailTab === 'comments' && (
                      <motion.div key="comments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="space-y-4 pr-4">
                        <div>
                          <h3 className="mb-4 text-sm text-neutral-400">评论</h3>
                          <div className="space-y-4">
                            {comments.length === 0 ? (
                              <div className="text-neutral-500">暂无评论</div>
                            ) : (
                              comments.map((c: any) => (
                                <div key={c.id} className="rounded-lg bg-neutral-800/30 p-4 transition-all hover:bg-neutral-800/50">
                                  <div className="mb-2 flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-500 to-orange-600" />
                                    <div className="flex-1">
                                      <p className="mb-1 text-sm text-neutral-300">{c.userName}</p>
                                      <p className="text-sm text-white">{c.content}</p>
                                      <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                                        <span>{c.createdAt}</span>
                                        <button className="transition-all hover:text-white">
                                          <Heart className="mr-1 inline h-3 w-3" />
                                          {c.likedCount}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {detailTab === 'similar' && (
                      <motion.div key="similar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="space-y-3 pr-4">
                        <h3 className="mb-4 text-sm text-neutral-400">与此歌曲相似</h3>
                        {similarList.map((song) => (
                          <div key={song.id} onClick={() => onSelectSongById(song.id)} className="group flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all hover:bg-neutral-800/50">
                            <div className="relative shrink-0">
                              <img src={song.cover} alt={song.title} className="h-14 w-14 rounded-lg object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-all group-hover:opacity-100">
                                <Play className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-white">{song.title}</p>
                              <p className="truncate text-sm text-neutral-400">{song.artist}</p>
                            </div>
                            <span className="text-sm text-neutral-500">{formatTime(song.duration)}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

