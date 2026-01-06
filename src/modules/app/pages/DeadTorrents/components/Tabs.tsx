// 简单标签导航：负责渲染“断种大厅/我发布的/我下载的”三个视图切换
// 说明：仅处理交互与样式，业务逻辑由页面或外层 hook 管理
import type { TabType } from '../types';

export function Tabs({ activeTab, onChange }: { activeTab: TabType; onChange: (tab: TabType) => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 bg-neutral-800/40 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-1.5 inline-flex">
        <button
          onClick={() => onChange('hall')}
          className={`px-6 py-2.5 rounded-lg text-sm transition-all ${
            activeTab === 'hall'
              ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          }`}
        >
          断种大厅
        </button>
        <button
          onClick={() => onChange('myPublished')}
          className={`px-6 py-2.5 rounded-lg text-sm transition-all ${
            activeTab === 'myPublished'
              ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          }`}
        >
          我发布的
        </button>
        <button
          onClick={() => onChange('myDownloaded')}
          className={`px-6 py-2.5 rounded-lg text-sm transition-all ${
            activeTab === 'myDownloaded'
              ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          }`}
        >
          我下载的
        </button>
      </div>
    </div>
  );
}

