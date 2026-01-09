// 统计卡片组件
// 说明：展示下载器数量、在线数量、总上/下载速度，纯展示逻辑。

import { ArrowDown, ArrowUp, CheckCircle, Server } from "lucide-react";
import { Downloader } from "../types";
import { formatSpeed } from "../utils";

export function StatsCards({ downloaders }: { downloaders: Downloader[] }) {
  const online = downloaders.filter((d) => d.status === "connected");
  const totalUpload = online.reduce((sum, d) => sum + (d.uploadSpeed || 0), 0);
  const totalDownload = online.reduce((sum, d) => sum + (d.downloadSpeed || 0), 0);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-5 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-neutral-400">下载器总数</span>
          <Server className="h-4 w-4 text-amber-400" />
        </div>
        <p className="text-2xl text-white">{downloaders.length}</p>
      </div>
      <div className="rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-5 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-neutral-400">在线下载器</span>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </div>
        <p className="text-2xl text-white">{online.length}</p>
      </div>
      <div className="rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-5 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-neutral-400">总上传速度</span>
          <ArrowUp className="h-4 w-4 text-blue-400" />
        </div>
        <p className="text-2xl text-white">{formatSpeed(totalUpload)}</p>
      </div>
      <div className="rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-5 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-neutral-400">总下载速度</span>
          <ArrowDown className="h-4 w-4 text-green-400" />
        </div>
        <p className="text-2xl text-white">{formatSpeed(totalDownload)}</p>
      </div>
    </div>
  );
}
