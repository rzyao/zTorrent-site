// 下载器详情弹窗
// 说明：展示分类与下载路径，支持异步获取与删除分类；保持纯展示层，由父级控制数据与动作。
// 使用 Portal 渲染到 body，使遮罩层全屏且弹窗在屏幕中央。

import { createPortal } from "react-dom";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Folder,
  HardDrive,
  Lock,
  MonitorDown,
  RefreshCw,
  Tag,
  X,
  XCircle,
} from "lucide-react";
import { Downloader } from "../types";
import { formatBytes, getTypeColor } from "../utils";

interface Props {
  open: boolean;
  downloader: Downloader;
  expandedTags: boolean;
  expandedPaths: boolean;
  fetchingTags: boolean;
  fetchingPaths: boolean;
  onClose: () => void;
  onToggleTags: () => void;
  onFetchTags: () => void;
  onDeleteTag: (index: number) => void;
  onTogglePaths: () => void;
  onFetchPaths: () => void;
  onDeletePath: (index: number) => void;
}

export function DownloaderDetailModal({
  open,
  downloader,
  expandedTags,
  expandedPaths,
  fetchingTags,
  fetchingPaths,
  onClose,
  onToggleTags,
  onFetchTags,
  onDeleteTag,
  onTogglePaths,
  onFetchPaths,
  onDeletePath,
}: Props) {
  if (!open) return null;
  return createPortal(
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="m-4 flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-700 bg-neutral-900">
        {/* 头部：标题与关闭 */}
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl bg-linear-to-r from-amber-500 to-orange-600 px-6 py-5">
          <h2 className="flex items-center gap-2 text-xl text-white">
            <Folder className="h-6 w-6" />
            为下载器 [{downloader.name}] 设置预设的下载路径和标签
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white transition-all hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-themed flex-1 space-y-5 overflow-y-auto p-6">
          {/* 基本信息 */}
          <div className="rounded-xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-5">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800/50 ${getTypeColor(
                    downloader.type,
                  )}`}
                >
                  <MonitorDown className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{downloader.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">
                      {downloader.type} {downloader.version}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start gap-20 rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-4">
              <div>
                <span className="mb-1 block text-xs text-neutral-500">连接地址</span>
                <div
                  className="truncate font-mono text-sm text-neutral-300"
                  title={`${downloader.ssl ? "https://" : "http://"}${
                    downloader.host
                  }:${downloader.port}`}
                >
                  {downloader.ssl ? "https://" : "http://"}
                  {downloader.host}:{downloader.port}
                </div>
              </div>
              <div>
                <span className="mb-1 block text-xs text-neutral-500">用户名</span>
                <div className="truncate font-mono text-sm text-neutral-300">
                  {downloader.username}
                </div>
              </div>
              <div>
                <span className="mb-1 block text-xs text-neutral-500">安全传输</span>
                <div className="flex items-center gap-1.5">
                  {downloader.ssl ? (
                    <>
                      <Lock className="h-3.5 w-3.5 text-green-400" />
                      <span className="text-sm text-green-400">已启用 SSL</span>
                    </>
                  ) : (
                    <span className="text-sm text-neutral-500">未启用</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 标签列表 */}
          <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40">
            <div className="flex items-center justify-between p-5">
              <button
                onClick={onToggleTags}
                className="-m-2 flex flex-1 items-center gap-3 rounded-lg p-2 transition-all hover:bg-neutral-800/30"
              >
                <Tag className="h-5 w-5 text-amber-400" />
                <div className="flex items-center gap-2 text-left">
                  <h3 className="text-white">标签列表</h3>
                  <span className="text-sm text-neutral-400">|</span>
                  <p className="text-sm text-neutral-400">{downloader.tags?.length || 0} 个标签</p>
                </div>
                <div className="ml-auto">
                  {expandedTags ? (
                    <ChevronUp className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  )}
                </div>
              </button>
              <button
                onClick={onFetchTags}
                disabled={fetchingTags}
                className="ml-3 flex items-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm text-white transition-all hover:from-amber-600 hover:to-orange-700 disabled:opacity-50"
              >
                {fetchingTags ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>获取中...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>获取标签</span>
                  </>
                )}
              </button>
            </div>
            {expandedTags && (
              <div className="px-5 pt-2 pb-5">
                {downloader.tags && downloader.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {downloader.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-300"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => onDeleteTag(index)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                          title="删除标签"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-neutral-500">
                    暂无标签，点击"获取标签"按钮获取
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 下载路径列表 */}
          <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40">
            <div className="flex items-center justify-between p-5">
              <button
                onClick={onTogglePaths}
                className="-m-2 flex flex-1 items-center gap-3 rounded-lg p-2 transition-all hover:bg-neutral-800/30"
              >
                <HardDrive className="h-5 w-5 text-purple-400" />
                <div className="flex items-center gap-2 text-left">
                  <h3 className="text-white">下载路径</h3>
                  <span className="text-sm text-neutral-400">|</span>
                  <p className="text-sm text-neutral-400">
                    {downloader.downloadPaths?.length || 0} 个路径
                  </p>
                </div>
                <div className="ml-auto">
                  {expandedPaths ? (
                    <ChevronUp className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  )}
                </div>
              </button>
              <button
                onClick={onFetchPaths}
                disabled={fetchingPaths}
                className="ml-3 flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-600 px-4 py-2 text-sm text-white transition-all hover:from-purple-600 hover:to-pink-700 disabled:opacity-50"
              >
                {fetchingPaths ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>获取中...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>获取路径</span>
                  </>
                )}
              </button>
            </div>
            {expandedPaths && (
              <div className="px-5 pt-2 pb-5">
                {downloader.downloadPaths && downloader.downloadPaths.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {downloader.downloadPaths.map((pathInfo, index) => (
                      <div
                        key={index}
                        className="group flex cursor-help items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-300 transition-colors hover:bg-purple-500/20"
                        title={`路径: ${pathInfo.path}\n剩余空间: ${formatBytes(
                          pathInfo.freeSpace,
                        )}`}
                      >
                        <span className="font-medium">{pathInfo.name || "Path"}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePath(index);
                          }}
                          className="ml-1 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                          title="删除路径"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-neutral-500">
                    暂无路径，点击"获取路径"按钮获取
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 使用说明提示 */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div className="text-sm text-amber-300">
                <p className="mb-1">使用说明：</p>
                <ul className="space-y-1 text-amber-400/80">
                  <li>• 标签用于组织管理不同类型的种子文件</li>
                  <li>• 下载路径可以为不同标签设置独立的保存位置</li>
                  <li>• 在上传种子时可以选择对应的标签和路径</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 底部：关闭按钮 */}
        <div className="flex justify-end rounded-b-2xl border-t border-neutral-800 bg-neutral-900/50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 px-6 py-2.5 text-white transition-all hover:bg-neutral-700"
          >
            关闭
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
