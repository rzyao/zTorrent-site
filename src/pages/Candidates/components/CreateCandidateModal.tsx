import { X, Image as ImageIcon } from 'lucide-react';

export function CreateCandidateModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-linear-to-br from-neutral-800 to-stone-900 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-br from-neutral-800 to-stone-900 border-b border-neutral-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-white text-2xl">提交候选资源</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">资源标题</label>
            <input type="text" placeholder="请输入中文标题" className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">英文标题</label>
            <input type="text" placeholder="请输入英文标题" className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-400 text-sm mb-2 block">年份</label>
              <input type="text" placeholder="2024" className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-neutral-400 text-sm mb-2 block">分类</label>
              <select className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500">
                <option>动作</option>
                <option>科幻</option>
                <option>剧情</option>
                <option>喜剧</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">质量参数</label>
            <input type="text" placeholder="4K UHD BluRay HEVC" className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">资源描述</label>
            <textarea rows={4} placeholder="请详细描述资源内容..." className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 resize-none" />
          </div>
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">MediaInfo</label>
            <textarea rows={6} placeholder="请粘贴MediaInfo信息..." className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 resize-none font-mono text-xs" />
          </div>
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">海报URL</label>
            <div className="flex gap-2">
              <input type="text" placeholder="https://..." className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
              <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-colors">取消</button>
            <button className="flex-1 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white transition-all shadow-lg shadow-amber-500/30">提交候选</button>
          </div>
        </div>
      </div>
    </div>
  );
}
