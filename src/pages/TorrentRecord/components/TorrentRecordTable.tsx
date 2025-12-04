import { Loader2, Clock, ArrowUpDown, Download } from 'lucide-react';
import { Torrent, TorrentStatus } from '../types';
import { STATUS_CONFIG } from '../constants';

interface TorrentRecordTableProps {
  isLoading: boolean;
  torrents: Torrent[];
  activeTab: TorrentStatus;
}

export function TorrentRecordTable({ isLoading, torrents, activeTab }: TorrentRecordTableProps) {
  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.default;
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-neutral-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-500" />
        <p>加载数据中...</p>
      </div>
    );
  }

  if (torrents.length === 0) {
    const statusText = STATUS_CONFIG[activeTab]?.text || '未知';
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-neutral-500">
        <Clock className="w-16 h-16 mb-4 opacity-50" />
        <p>暂无{statusText}记录</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden min-h-[400px]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-800/50 border-b border-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">种子名称</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">分类</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">大小</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">上传量</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">下载量</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">分享率</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">进度</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">做种/下载</th>
              <th className="px-6 py-4 text-left text-sm text-neutral-400">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {torrents.map((torrent) => {
              const statusConfig = getStatusConfig(torrent.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={torrent.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white hover:text-amber-400 cursor-pointer transition-colors max-w-md truncate">
                      {torrent.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      发布于 {torrent.uploadDate}
                      {torrent.completeDate && ` • 完成于 ${torrent.completeDate}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm rounded-full">
                      {torrent.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">{torrent.size}</td>
                  <td className="px-6 py-4 text-green-400">{torrent.uploaded}</td>
                  <td className="px-6 py-4 text-red-400">{torrent.downloaded}</td>
                  <td className="px-6 py-4">
                    <span className={torrent.ratio >= 1 ? 'text-green-400' : 'text-amber-400'}>
                      {torrent.ratio.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${torrent.progress === 100
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600'
                            }`}
                          style={{ width: `${torrent.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-neutral-400 min-w-[45px]">{torrent.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-green-400">
                        <ArrowUpDown className="w-4 h-4" />
                        {torrent.seeders}
                      </div>
                      <div className="flex items-center gap-1 text-red-400">
                        <Download className="w-4 h-4" />
                        {torrent.leechers}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{statusConfig.text}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
