import { Vote, Plus } from 'lucide-react';

export function Header({ onSubmitClick }: { onSubmitClick: () => void }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Vote className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl">候选资源</h1>
          <p className="text-neutral-400 text-sm mt-1">社区投票决定资源上传，确保内容质量</p>
        </div>
      </div>
      <button
        onClick={onSubmitClick}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30"
      >
        <Plus className="w-4 h-4" />
        提交候选
      </button>
    </div>
  );
}
