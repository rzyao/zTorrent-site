// 编辑下载器弹窗
// 说明：与添加弹窗结构一致，但标题与提交按钮不同；通过 props 接收数据与事件。
// 使用 Portal 渲染到 body，使遮罩层全屏且弹窗在屏幕中央。

import { createPortal } from "react-dom";
import { Edit, Lock, MonitorDown, Server, X, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DownloaderForm, DownloaderType } from "../types";

interface Props {
  open: boolean;
  formData: DownloaderForm;
  showPassword: boolean;
  onTogglePassword: () => void;
  onChangeForm: (next: Partial<DownloaderForm>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function EditDownloaderModal({
  open,
  formData,
  showPassword,
  onTogglePassword,
  onChangeForm,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部：标题与关闭 */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-white text-xl flex items-center gap-2">
            <Edit className="w-6 h-6" />
            编辑下载器
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
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
            <Select
              value={formData.type}
              onValueChange={(value) =>
                onChangeForm({ type: value as DownloaderType })
              }
            >
              <SelectTrigger className="w-full h-12 px-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:border-amber-500">
                <SelectValue placeholder="选择下载器类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qBittorrent">qBittorrent</SelectItem>
                <SelectItem value="Transmission">Transmission</SelectItem>
                <SelectItem value="Deluge">Deluge</SelectItem>
                <SelectItem value="rTorrent">rTorrent</SelectItem>
              </SelectContent>
            </Select>
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
              <label className="block text-neutral-300 mb-2 text-sm">
                端口 *
              </label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) =>
                  onChangeForm({ port: parseInt(e.target.value) || 0 })
                }
                placeholder="8080"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 用户名与密码 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 mb-2 text-sm">
                用户名
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => onChangeForm({ username: e.target.value })}
                placeholder="admin"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-2 text-sm">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => onChangeForm({ password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={onTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SSL 选项 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ssl-edit"
              checked={formData.ssl}
              onChange={(e) => onChangeForm({ ssl: e.target.checked })}
              className="w-5 h-5 rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-amber-500"
            />
            <label
              htmlFor="ssl-edit"
              className="text-neutral-300 text-sm flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-green-400" />
              使用 SSL/TLS 加密连接
            </label>
          </div>

          {/* 提交按钮区 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onSubmit}
              disabled={!formData.name || !formData.host || !formData.port}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit className="w-5 h-5" />
              保存修改
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-all"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
