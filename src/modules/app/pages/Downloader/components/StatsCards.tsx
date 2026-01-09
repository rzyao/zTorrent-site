// 统计卡片组件
// 说明：展示下载器数量、在线数量、总上/下载速度，纯展示逻辑。

import { ArrowDown, ArrowUp, CheckCircle, Server } from 'lucide-react';
import { Downloader } from '../types';
import { formatSpeed } from '.@/utils/cn';

export function StatsCards({ downloaders }: { downloaders: Downloader[] }) {
  const online = downloaders.filter(d => d.status === 'connected');
  const totalUpload = online.reduce((sum, d) => sum + (d.uploadSpeed || 0), 0);
  const totalDownload = online.reduce((sum, d) => sum + (d.downloadSpeed || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">下载器总数</span>
          <Server className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-white text-2xl">{downloaders.length}</p>
      </div>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">在线下载器</span>
          <CheckCircle className="w-4 h-4 text-green-400" />
        </div>
        <p className="text-white text-2xl">{online.length}</p>
      </div>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">总上传速度</span>
          <ArrowUp className="w-4 h-4 text-blue-400" />
        </div>
        <p className="text-white text-2xl">{formatSpeed(totalUpload)}</p>
      </div>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">总下载速度</span>
          <ArrowDown className="w-4 h-4 text-green-400" />
        </div>
        <p className="text-white text-2xl">{formatSpeed(totalDownload)}</p>
      </div>
    </div>
  );
}
