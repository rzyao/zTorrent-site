import { LayoutList } from 'lucide-react';

export function TicketsHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <LayoutList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl">工单系统</h1>
          <p className="text-neutral-400 text-sm mt-1">提交问题、查看进度、管理工单</p>
        </div>
      </div>
    </div>
  );
}

