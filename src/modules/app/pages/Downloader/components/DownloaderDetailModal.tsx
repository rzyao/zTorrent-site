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
import { formatBytes, getTypeColor } from ".@/utils/cn";

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
    <div className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-3xl w-full max-h-[85vh] flex flex-col m-4">
        {/* 头部：标题与关闭 */}
        <div className="sticky top-0 bg-linear-to-r from-amber-500 to-orange-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-white text-xl flex items-center gap-2">
            <Folder className="w-6 h-6" />
            为下载器 [{downloader.name}] 设置预设的下载路径和标签
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto scrollbar-themed">
          {/* 基本信息 */}
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl p-5 border border-neutral-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-neutral-800/50 flex items-center justify-center ${getTypeColor(
                    downloader.type
                  )}`}
                >
                  <MonitorDown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium">
                    {downloader.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-400 text-sm">
                      {downloader.type} {downloader.version}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start gap-20 p-4 bg-neutral-900/30 rounded-lg border border-neutral-800/50">
              <div>
                <span className="text-neutral-500 text-xs block mb-1">
                  连接地址
                </span>
                <div
                  className="text-neutral-300 font-mono text-sm truncate"
                  title={`${downloader.ssl ? "https://" : "http://"}${
                    downloader.host
                  }:${downloader.port}`}
                >
                  {downloader.ssl ? "https://" : "http://"}
                  {downloader.host}:{downloader.port}
                </div>
              </div>
              <div>
                <span className="text-neutral-500 text-xs block mb-1">
                  用户名
                </span>
                <div className="text-neutral-300 font-mono text-sm truncate">
                  {downloader.username}
                </div>
              </div>
              <div>
                <span className="text-neutral-500 text-xs block mb-1">
                  安全传输
                </span>
                <div className="flex items-center gap-1.5">
                  {downloader.ssl ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 text-sm">已启用 SSL</span>
                    </>
                  ) : (
                    <span className="text-neutral-500 text-sm">未启用</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 标签列表 */}
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <button
                onClick={onToggleTags}
                className="flex-1 flex items-center gap-3 hover:bg-neutral-800/30 transition-all rounded-lg -m-2 p-2"
              >
                <Tag className="w-5 h-5 text-amber-400" />
                <div className="text-left flex items-center gap-2">
                  <h3 className="text-white">标签列表</h3>
                  <span className="text-neutral-400 text-sm">|</span>
                  <p className="text-neutral-400 text-sm">
                    {downloader.tags?.length || 0} 个标签
                  </p>
                </div>
                <div className="ml-auto">
                  {expandedTags ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>
              <button
                onClick={onFetchTags}
                disabled={fetchingTags}
                className="ml-3 flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white text-sm transition-all disabled:opacity-50"
              >
                {fetchingTags ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>获取中...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>获取标签</span>
                  </>
                )}
              </button>
            </div>
            {expandedTags && (
              <div className="px-5 pb-5 pt-2">
                {downloader.tags && downloader.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {downloader.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="group px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm flex items-center gap-2"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => onDeleteTag(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                          title="删除标签"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm text-center py-4">
                    暂无标签，点击"获取标签"按钮获取
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 下载路径列表 */}
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <button
                onClick={onTogglePaths}
                className="flex-1 flex items-center gap-3 hover:bg-neutral-800/30 transition-all rounded-lg -m-2 p-2"
              >
                <HardDrive className="w-5 h-5 text-purple-400" />
                <div className="text-left flex items-center gap-2">
                  <h3 className="text-white">下载路径</h3>
                  <span className="text-neutral-400 text-sm">|</span>
                  <p className="text-neutral-400 text-sm">
                    {downloader.downloadPaths?.length || 0} 个路径
                  </p>
                </div>
                <div className="ml-auto">
                  {expandedPaths ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>
              <button
                onClick={onFetchPaths}
                disabled={fetchingPaths}
                className="ml-3 flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg text-white text-sm transition-all disabled:opacity-50"
              >
                {fetchingPaths ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>获取中...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>获取路径</span>
                  </>
                )}
              </button>
            </div>
            {expandedPaths && (
              <div className="px-5 pb-5 pt-2">
                {downloader.downloadPaths &&
                downloader.downloadPaths.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {downloader.downloadPaths.map((pathInfo, index) => (
                      <div
                        key={index}
                        className="group px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-sm flex items-center gap-2 cursor-help transition-colors hover:bg-purple-500/20"
                        title={`路径: ${pathInfo.path}\n剩余空间: ${formatBytes(
                          pathInfo.freeSpace
                        )}`}
                      >
                        <span className="font-medium">
                          {pathInfo.name || "Path"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePath(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 ml-1"
                          title="删除路径"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm text-center py-4">
                    暂无路径，点击"获取路径"按钮获取
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 使用说明提示 */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
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
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
