// 页面头部组件
// 说明：纯展示组件，仅通过 props 接收事件回调；不包含业务状态，从而提升复用性与可测试性。

import { Download, Plus } from 'lucide-react';

export function Header({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white text-3xl">下载器管理</h1>
            <p className="text-neutral-400 text-sm mt-1">管理您的BT客户端连接，远程控制下载任务</p>
          </div>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all shadow-lg shadow-amber-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>添加下载器</span>
        </button>
      </div>
    </div>
  );
}

