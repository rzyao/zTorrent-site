// 下载器详情弹窗
// 说明：展示分类与下载路径，支持异步获取与删除分类；保持纯展示层，由父级控制数据与动作。

import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Download, Folder, HardDrive, Lock, MonitorDown, RefreshCw, Tag, X, XCircle } from 'lucide-react';
import { Downloader } from '../types';
import { formatBytes, getTypeColor } from '../utils';

interface Props {
  open: boolean;
  downloader: Downloader;
  expandedCategories: boolean;
  expandedPaths: boolean;
  fetchingCategories: boolean;
  fetchingPaths: boolean;
  onClose: () => void;
  onToggleCategories: () => void;
  onFetchCategories: () => void;
  onDeleteCategory: (index: number) => void;
  onTogglePaths: () => void;
  onFetchPaths: () => void;
}

export function DownloaderDetailModal({ open, downloader, expandedCategories, expandedPaths, fetchingCategories, fetchingPaths, onClose, onToggleCategories, onFetchCategories, onDeleteCategory, onTogglePaths, onFetchPaths }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部：标题与关闭 */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-white text-xl flex items-center gap-2">
            <Folder className="w-6 h-6" />
            下载器详情
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 基本信息 */}
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl p-5 border border-neutral-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-neutral-800/50 flex items-center justify-center ${getTypeColor(downloader.type)}`}>
                <MonitorDown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white text-lg">{downloader.name}</h3>
                <p className="text-neutral-400 text-sm">{downloader.type} {downloader.version}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">连接地址：</span>
                <p className="text-neutral-300 mt-1">{downloader.ssl ? 'https://' : 'http://'}{downloader.host}:{downloader.port}</p>
              </div>
              <div>
                <span className="text-neutral-500">用户名：</span>
                <p className="text-neutral-300 mt-1">{downloader.username}</p>
              </div>
              <div>
                <span className="text-neutral-500">状态：</span>
                <p className={`mt-1 inline-flex items-center gap-1 ${downloader.status === 'connected' ? 'text-green-400' : 'text-neutral-400'}`}>
                  {downloader.status === 'connected' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      已连接
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      未连接
                    </>
                  )}
                </p>
              </div>
              {downloader.ssl && (
                <div>
                  <span className="text-neutral-500">加密：</span>
                  <p className="text-green-400 mt-1 flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    SSL/TLS
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 分类列表 */}
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <button onClick={onToggleCategories} className="flex-1 flex items-center gap-3 hover:bg-neutral-800/30 transition-all rounded-lg -m-2 p-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <h3 className="text-white">分类列表</h3>
                  <p className="text-neutral-400 text-sm">{downloader.categories?.length || 0} 个分类</p>
                </div>
                <div className="ml-auto">
                  {expandedCategories ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </div>
              </button>
              <button onClick={onFetchCategories} disabled={fetchingCategories} className="ml-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white text-sm transition-all disabled:opacity-50">
                {fetchingCategories ? (<><RefreshCw className="w-4 h-4 animate-spin" /><span>获取中...</span></>) : (<><Download className="w-4 h-4" /><span>获取分类</span></>)}
              </button>
            </div>
            {expandedCategories && (
              <div className="px-5 pb-5 pt-2">
                {downloader.categories && downloader.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {downloader.categories.map((category, index) => (
                      <div key={index} className="group px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm flex items-center gap-2">
                        <span>{category}</span>
                        <button onClick={() => onDeleteCategory(index)} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400" title="删除分类">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm text-center py-4">暂无分类，点击"获取分类"按钮获取</p>
                )}
              </div>
            )}
          </div>

          {/* 下载路径列表 */}
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 rounded-xl border border-neutral-700/50 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <button onClick={onTogglePaths} className="flex-1 flex items-center gap-3 hover:bg-neutral-800/30 transition-all rounded-lg -m-2 p-2">
                <HardDrive className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <h3 className="text-white">下载路径</h3>
                  <p className="text-neutral-400 text-sm">{downloader.downloadPaths?.length || 0} 个路径</p>
                </div>
                <div className="ml-auto">
                  {expandedPaths ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </div>
              </button>
              <button onClick={onFetchPaths} disabled={fetchingPaths} className="ml-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg text-white text-sm transition-all disabled:opacity-50">
                {fetchingPaths ? (<><RefreshCw className="w-4 h-4 animate-spin" /><span>获取中...</span></>) : (<><Download className="w-4 h-4" /><span>获取路径</span></>)}
              </button>
            </div>
            {expandedPaths && (
              <div className="px-5 pb-5 pt-2">
                {downloader.downloadPaths && downloader.downloadPaths.length > 0 ? (
                  <div className="space-y-3">
                    {downloader.downloadPaths.map((pathInfo, index) => (
                      <div key={index} className="bg-neutral-800/30 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white mb-1">{pathInfo.name}</p>
                            <p className="text-neutral-400 text-sm font-mono">{pathInfo.path}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-neutral-400 text-xs mb-1">剩余空间</p>
                            <p className="text-purple-400">{formatBytes(pathInfo.freeSpace)}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${Math.min(100, (pathInfo.freeSpace / (5 * 1024 * 1024 * 1024 * 1024)) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm text-center py-4">暂无路径，点击"获取路径"按钮获取</p>
                )}
              </div>
            )}
          </div>

          {/* 使用说明提示 */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-300">
                <p className="mb-1">使用说明：</p>
                <ul className="space-y-1 text-amber-400/80">
                  <li>• 分类用于组织管理不同类型的种子文件</li>
                  <li>• 下载路径可以为不同分类设置独立的保存位置</li>
                  <li>• 在上传种子时可以选择对应的分类和路径</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 关闭按钮 */}
          <div className="flex justify-end pt-2">
            <button onClick={onClose} className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all">关闭</button>
          </div>
        </div>
      </div>
    </div>
  );
}

