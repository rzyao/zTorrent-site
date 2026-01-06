import { Search } from 'lucide-react';

/**
 * 搜索栏组件
 * - 受控输入，通过 `onChange` 将值传回容器，容器负责防抖
 */
export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="px-6 py-4 border-b border-neutral-700/50 flex items-center gap-3 bg-neutral-800/30">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索主题、发件人或内容"
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900/50 border border-neutral-700/50 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>
    </div>
  );
}

