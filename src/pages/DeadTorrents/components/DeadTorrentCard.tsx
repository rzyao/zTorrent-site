// 单条断种卡片组件：负责展示海报、基础信息、统计与悬赏操作
import { AlertCircle, Clock, Coins, Download, RefreshCw, TrendingUp, Upload, Users, XCircle } from 'lucide-react';
import type { DeadTorrent, TabType } from '../types';

export function DeadTorrentCard({ torrent, activeTab }: { torrent: DeadTorrent; activeTab: TabType }) {
  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-red-500/30 overflow-hidden hover:border-red-500/50 transition-all group">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* 海报 */}
        <div className="relative w-full md:w-28 shrink-0">
          <div className="aspect-2/3 rounded-lg overflow-hidden">
            <img
              src={torrent.poster}
              alt={torrent.title}
              className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* 信息区域 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white line-clamp-1 mb-1">{torrent.title}</h3>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>{torrent.category}</span>
                <span>•</span>
                <span>{torrent.size}</span>
                <span>•</span>
                <span className="text-red-400">断种 {torrent.deadTime}</span>
                {activeTab !== 'myPublished' && (
                  <>
                    <span>•</span>
                    <span className="text-neutral-400">发布者: {torrent.publisher}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 断种原因 */}
          <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-400 text-xs mb-1">断种原因</p>
                <p className="text-red-300 text-sm">{torrent.reason}</p>
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Upload className="w-3.5 h-3.5 text-green-400" />
              <div>
                <p className="text-neutral-500">已上传</p>
                <p className="text-white">{torrent.uploaded}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Download className="w-3.5 h-3.5 text-red-400" />
              <div>
                <p className="text-neutral-500">已下载</p>
                <p className="text-white">{torrent.downloaded}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <div>
                <p className="text-neutral-500">分享率</p>
                <p className="text-white">{torrent.ratio.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <div>
                <p className="text-neutral-500">最后做种</p>
                <p className="text-white text-xs">{torrent.lastSeedTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 悬赏显示与操作 */}
        <div className="flex flex-col items-center justify-center md:w-40 shrink-0 p-4 bg-linear-to-br from-amber-500/10 to-orange-600/10 rounded-xl border border-amber-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-6 h-6 text-amber-400" />
            <span className="text-3xl text-amber-400">{torrent.bounty.toFixed(0)}</span>
          </div>
          <p className="text-xs text-neutral-400 text-center mb-1">悬赏总额</p>
          <div className="flex items-center gap-1 text-xs text-amber-400/70 mb-3">
            <Users className="w-3 h-3" />
            <span>{torrent.bountyCount} 人悬赏</span>
          </div>

          {activeTab === 'hall' && (
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-green-500/30">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>恢复做种</span>
            </button>
          )}
          {activeTab === 'myPublished' && (
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-green-500/30">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>恢复</span>
            </button>
          )}
          {activeTab === 'myDownloaded' && (
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-amber-500/30">
              <Coins className="w-3.5 h-3.5" />
              <span>追加悬赏</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
