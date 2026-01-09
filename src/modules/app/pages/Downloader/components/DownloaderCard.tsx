// 单个下载器卡片组件
// 说明：负责渲染下载器的基本信息、统计信息与操作按钮，不持有业务状态。

import { Downloader } from "../types";
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Folder,
  HardDrive,
  Wifi,
  WifiOff,
  Activity,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  formatBytes,
  formatSpeed,
  getStatusBadgeClass,
  getStatusText,
  getTypeColor,
  getTypeIcon,
} from "../utils";

interface Props {
  downloader: Downloader;
  onTestConnection: (id: string) => void;
  onFetchInfo: (downloader: Downloader) => void;
  onEdit: (downloader: Downloader) => void;
  onDelete: (id: string) => void;
}

export function DownloaderCard({
  downloader,
  onTestConnection,
  onFetchInfo,
  onEdit,
  onDelete,
}: Props) {
  const TypeIcon = getTypeIcon(downloader.type);
  const isConnected = downloader.status === "connected";

  return (
    <div className="rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-6 backdrop-blur-sm">
      {/* 头部：图标 + 名称 + 版本 + 状态 */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800/50 ${getTypeColor(
              downloader.type,
            )}`}
          >
            <TypeIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-white">{downloader.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-neutral-400">{downloader.type}</span>
              {downloader.version && (
                <>
                  <span className="text-neutral-600">•</span>
                  <span className="text-sm text-neutral-500">{downloader.version}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <span
          className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs ${getStatusBadgeClass(
            downloader.status,
          )}`}
        >
          {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {getStatusText(downloader.status)}
        </span>
      </div>

      {/* 连接信息 */}
      <div className="mb-4 rounded-xl bg-neutral-800/30 p-4">
        <div className="flex flex-col justify-between gap-2 text-sm">
          <div>
            <span className="text-neutral-500">地址：</span>
            <span className="ml-1 text-neutral-300">
              {downloader.ssl ? "https://" : "http://"}
              {downloader.host}:{downloader.port}
            </span>
          </div>
          <div>
            <span className="text-neutral-500">用户名：</span>
            <span className="ml-1 text-neutral-300">{downloader.username}</span>
          </div>
        </div>
      </div>

      {/* 统计信息（仅在线时展示） */}
      {isConnected && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-neutral-800/30 p-3">
            <div className="mb-1 flex items-center gap-2">
              <ArrowUp className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs text-neutral-400">上传速度</span>
            </div>
            <p className="text-white">{formatSpeed(downloader.uploadSpeed || 0)}</p>
          </div>
          <div className="rounded-xl bg-neutral-800/30 p-3">
            <div className="mb-1 flex items-center gap-2">
              <ArrowDown className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs text-neutral-400">下载速度</span>
            </div>
            <p className="text-white">{formatSpeed(downloader.downloadSpeed || 0)}</p>
          </div>
          <div className="rounded-xl bg-neutral-800/30 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs text-neutral-400">活动种子</span>
            </div>
            <p className="text-white">
              {downloader.activeTorrents} / {downloader.totalTorrents}
            </p>
          </div>
          <div className="rounded-xl bg-neutral-800/30 p-3">
            <div className="mb-1 flex items-center gap-2">
              <HardDrive className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs text-neutral-400">剩余空间</span>
            </div>
            <p className="text-white">{formatBytes(downloader.freeSpace || 0)}</p>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => onTestConnection(downloader.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="text-sm">测试连接</span>
        </button>
        <button
          onClick={() => onFetchInfo(downloader)}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white"
        >
          <Folder className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEdit(downloader)}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(downloader.id)}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-neutral-300 transition-all hover:bg-red-900/50 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
