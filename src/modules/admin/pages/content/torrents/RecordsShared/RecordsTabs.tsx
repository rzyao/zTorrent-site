import { Tabs } from "antd";
import { DownloadTab } from "./types";

interface RecordsTabsProps {
  activeKey: DownloadTab;
  onChange: (key: DownloadTab) => void;
  items?: { key: DownloadTab; label: string }[];
}

export const RecordsTabs = ({ activeKey, onChange, items }: RecordsTabsProps) => {
  const defaultItems = [
    { key: "published", label: "已发布" },
    { key: "seeding", label: "做种中" },
    { key: "downloading", label: "下载中" },
    { key: "completed", label: "已完成" },
    { key: "incomplete", label: "未完成" },
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={(k) => onChange(k as DownloadTab)}
      items={(items || defaultItems) as any}
    />
  );
};
