import { Search } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * 顶部搜索框
 * - 保持与原页面一致的视觉样式
 * - 当前仅维护搜索词，不执行过滤（兼容原行为）
 */
export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();
  return (
    <div className="relative w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('music.searchPlaceholder')}
        className="w-full pl-10 pr-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-all"
      />
    </div>
  );
}

