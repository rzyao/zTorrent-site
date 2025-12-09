// 添加下载器弹窗
// 说明：拆分出纯 UI 表单组件，通过 props 接收与修改表单值、关闭/提交事件；组件自身不持有业务状态。

import { AlertCircle, Lock, MonitorDown, Plus, Server, X, Eye, EyeOff } from 'lucide-react';
import { DownloaderForm, DownloaderType } from '../types';

interface Props {
  open: boolean;
  formData: DownloaderForm;
  showPassword: boolean;
  onTogglePassword: () => void;
  onChangeForm: (next: Partial<DownloaderForm>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddDownloaderModal({ open, formData, showPassword, onTogglePassword, onChangeForm, onSubmit, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部：标题与关闭 */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-white text-xl flex items-center gap-2">
            <Plus className="w-6 h-6" />
            添加下载器
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单主体 */}
        <div className="p-6 space-y-5">
          {/* 下载器名称 */}
          <div>
            <label className="block text-neutral-300 mb-2 text-sm">
              <Server className="w-4 h-4 inline mr-2" />
              下载器名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChangeForm({ name: e.target.value })}
              placeholder="例如：主服务器 qBittorrent"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 下载器类型 */}
          <div>
            <label className="block text-neutral-300 mb-2 text-sm">
              <MonitorDown className="w-4 h-4 inline mr-2" />
              下载器类型 *
            </label>
            <select
              value={formData.type}
              onChange={(e) => onChangeForm({ type: e.target.value as DownloaderType })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            >
              <option value="qBittorrent">qBittorrent</option>
              <option value="Transmission">Transmission</option>
              <option value="Deluge">Deluge</option>
              <option value="rTorrent">rTorrent</option>
            </select>
          </div>

          {/* 主机与端口 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-neutral-300 mb-2 text-sm">
                <Server className="w-4 h-4 inline mr-2" />
                主机地址 *
              </label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => onChangeForm({ host: e.target.value })}
                placeholder="192.168.1.100 或 example.com"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-2 text-sm">端口 *</label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) => onChangeForm({ port: parseInt(e.target.value) || 0 })}
                placeholder="8080"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 用户名与密码 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 mb-2 text-sm">用户名</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => onChangeForm({ username: e.target.value })}
                placeholder="admin"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-2 text-sm">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => onChangeForm({ password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={onTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* SSL 选项 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ssl"
              checked={formData.ssl}
              onChange={(e) => onChangeForm({ ssl: e.target.checked })}
              className="w-5 h-5 rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="ssl" className="text-neutral-300 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-400" />
              使用 SSL/TLS 加密连接
            </label>
          </div>

          {/* 提示信息：表单填写建议（纯文案） */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="mb-1">配置提示：</p>
                <ul className="space-y-1 text-blue-400/80">
                  <li>• qBittorrent 默认端口：8080，需在 Web UI 设置中启用</li>
                  <li>• Transmission 默认端口：9091</li>
                  <li>• 确保下载器的 Web UI 已启用并允许远程访问</li>
                  <li>• 如果使用内网地址，请确保网络连通性</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 提交按钮区 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onSubmit}
              disabled={!formData.name || !formData.host || !formData.port}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              添加下载器
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
