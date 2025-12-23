import { Play } from 'lucide-react';

/**
 * PageHeader
 * 纯展示：播放器页面顶部标题区
 * 无状态、无业务逻辑，仅负责渲染视觉结构
 */
export function PageHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Play className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl">播放器</h1>
          <p className="text-neutral-400 text-sm mt-1">管理你的音乐库，畅享个性化体验</p>
        </div>
      </div>
    </div>
  );
}

