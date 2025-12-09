import { Info } from 'lucide-react';

export function InfoCard() {
  return (
    <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-amber-400 mb-2">候选机制说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-neutral-300 text-sm">
            <div>
              <p className="text-amber-400/80 mb-1">📝 提交候选</p>
              <p className="text-xs text-neutral-400">发布资源预告，包含详细信息和截图</p>
            </div>
            <div>
              <p className="text-amber-400/80 mb-1">🗳️ 社区投票</p>
              <p className="text-xs text-neutral-400">24小时内，用户投票支持或反对</p>
            </div>
            <div>
              <p className="text-amber-400/80 mb-1">✅ 自动审核</p>
              <p className="text-xs text-neutral-400">支持率&gt; 70% 自动通过，获得上传权限</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
