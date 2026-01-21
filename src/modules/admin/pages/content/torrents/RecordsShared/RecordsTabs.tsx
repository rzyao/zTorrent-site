import { cn } from "@/utils/cn";
import { DownloadTab } from "./types";

interface RecordsTabsProps {
  activeKey: DownloadTab;
  onChange: (key: DownloadTab) => void;
  items?: { key: DownloadTab; label: string }[];
}

const defaultItems: { key: DownloadTab; label: string }[] = [
  { key: "published", label: "已发布" },
  { key: "seeding", label: "做种中" },
  { key: "downloading", label: "下载中" },
  { key: "completed", label: "已完成" },
  { key: "incomplete", label: "未完成" },
];

/**
 * 下载记录 Tabs 组件 (使用 Tailwind 样式)
 * 符合 AntD 风格的标签页切换
 */
export const RecordsTabs = ({ activeKey, onChange, items }: RecordsTabsProps) => {
  const tabItems = items || defaultItems;

  return (
    <div className="mb-4 border-b border-gray-200">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabItems.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "border-b-2 py-3 text-sm font-medium whitespace-nowrap transition-all",
              activeKey === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:border-gray-300 hover:text-neutral-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
