import { TrendingUp, Info, Bell } from 'lucide-react';

export function ProcessCard() {
  return (
    <div className="mb-6 p-6 rounded-2xl bg-linear-to-br from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-500/30">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-amber-400 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            候选资源流程：提交 → 投票 → 自动发布
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <span className="text-amber-400">1</span>
                </div>
                <div>
                  <h4 className="text-amber-300 mb-1.5">发布候选</h4>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    提交完整的资源信息（标题、海报、MediaInfo等），状态标记为
                    <span className="text-amber-400"> [投票中]</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <span className="text-amber-400">2</span>
                </div>
                <div>
                  <h4 className="text-amber-300 mb-1.5">社区投票</h4>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    24小时内，所有用户可投
                    <span className="text-green-400"> 支持 </span>
                    或
                    <span className="text-red-400"> 反对</span>，实时统计投票结果
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <span className="text-amber-400">3</span>
                </div>
                <div>
                  <h4 className="text-amber-300 mb-1.5">自动化决策</h4>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    <span className="text-green-400">通过：</span>支持率≥70%，自动发布为正式种子<br />
                    <span className="text-red-400">驳回：</span>反对票过多或重复资源
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-500/20 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <p className="text-neutral-400 text-xs">
              <span className="text-amber-400">通知系统：</span>
              投票结束后自动发送通知，通过者资源自动发布，驳回者可查看原因并重新提交
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
