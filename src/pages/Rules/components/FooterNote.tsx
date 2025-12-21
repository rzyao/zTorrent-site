import React from 'react';
import { Info } from 'lucide-react';

/**
 * 页面底部声明模块
 *
 * 说明：保留原有文案与样式，独立为组件以便后续更新版本信息。
 */
export const FooterNote: React.FC = () => {
  return (
    <div className="mt-8 p-6 rounded-2xl bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm border border-neutral-700/50">
      <div className="flex items-start gap-4">
        <Info className="w-6 h-6 text-amber-400 shrink-0" />
        <div>
          <h3 className="text-white mb-2">最终解释权</h3>
          <p className="text-neutral-400 text-sm leading-relaxed mb-3">
            本站保留对规则的最终解释权和修改权。规则更新后将在首页公告，用户应及时关注。
          </p>
          <p className="text-neutral-500 text-xs">最后更新时间：2024年12月8日 | 版本：v3.3</p>
        </div>
      </div>
    </div>
  );
};

