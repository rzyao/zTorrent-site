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
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
      {/* 头部：图标 + 名称 + 版本 + 状态 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-neutral-800/50 flex items-center justify-center ${getTypeColor(
              downloader.type
            )}`}
          >
            <TypeIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white">{downloader.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-neutral-400 text-sm">
                {downloader.type}
              </span>
              {downloader.version && (
                <>
                  <span className="text-neutral-600">•</span>
                  <span className="text-neutral-500 text-sm">
                    {downloader.version}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${getStatusBadgeClass(
            downloader.status
          )}`}
        >
          {isConnected ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {getStatusText(downloader.status)}
        </span>
      </div>

      {/* 连接信息 */}
      <div className="bg-neutral-800/30 rounded-xl p-4 mb-4">
        <div className="flex flex-col justify-between gap-2 text-sm">
          <div>
            <span className="text-neutral-500">地址：</span>
            <span className="text-neutral-300 ml-1">
              {downloader.ssl ? "https://" : "http://"}
              {downloader.host}:{downloader.port}
            </span>
          </div>
          <div>
            <span className="text-neutral-500">用户名：</span>
            <span className="text-neutral-300 ml-1">{downloader.username}</span>
          </div>
        </div>
      </div>

      {/* 统计信息（仅在线时展示） */}
      {isConnected && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-neutral-800/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-neutral-400 text-xs">上传速度</span>
            </div>
            <p className="text-white">
              {formatSpeed(downloader.uploadSpeed || 0)}
            </p>
          </div>
          <div className="bg-neutral-800/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDown className="w-3.5 h-3.5 text-green-400" />
              <span className="text-neutral-400 text-xs">下载速度</span>
            </div>
            <p className="text-white">
              {formatSpeed(downloader.downloadSpeed || 0)}
            </p>
          </div>
          <div className="bg-neutral-800/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-neutral-400 text-xs">活动种子</span>
            </div>
            <p className="text-white">
              {downloader.activeTorrents} / {downloader.totalTorrents}
            </p>
          </div>
          <div className="bg-neutral-800/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-neutral-400 text-xs">剩余空间</span>
            </div>
            <p className="text-white">
              {formatBytes(downloader.freeSpace || 0)}
            </p>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => onTestConnection(downloader.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">测试连接</span>
        </button>
        <button
          onClick={() => onFetchInfo(downloader)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all"
        >
          <Folder className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(downloader)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(downloader.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-red-900/50 rounded-xl text-neutral-300 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
