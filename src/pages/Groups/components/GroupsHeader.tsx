/**
 * 页面头部展示组件（纯展示，无业务逻辑）。
 * 保持与原页面 UI 完全一致。
 */
import { Users } from 'lucide-react';
import React from 'react';

export const GroupsHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-amber-700/20 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-amber-400" />
          <h1 className="text-amber-50">制作组中心</h1>
        </div>
        <p className="text-amber-200/70">发现优秀的制作组，加入志同道合的团队，共同创造精品内容</p>
      </div>
    </div>
  );
};

