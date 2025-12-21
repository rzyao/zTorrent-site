import { AnnouncementType } from '../types';

interface FilterBarProps {
  value: AnnouncementType | 'all';
  onChange: (value: AnnouncementType | 'all') => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  const btn = (key: AnnouncementType | 'all', label: string) => (
    <button
      onClick={() => onChange(key)}
      className={`px-4 py-2 rounded-lg transition-all ${
        value === key
          ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white'
          : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2 flex-wrap">
      {btn('all', '全部公告')}
      {btn('event', '活动公告')}
      {btn('system', '系统公告')}
      {btn('rule', '规则更新')}
      {btn('maintenance', '维护通知')}
    </div>
  );
}

