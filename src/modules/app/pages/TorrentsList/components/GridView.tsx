import { TorrentCard } from "@/modules/app/pages/TorrentsList/components/TorrentCard";
import type { Torrent } from "../types";

interface GridViewProps {
  /** 展示列表数据（已做前端筛选/排序派生） */
  items: Torrent[];
  /** 分类标签词典映射 */
  getCategoryLabel: (key?: string) => string | undefined;
  /** 下载触发（容器传入，调用 `useTorrentDownload`） */
  onDownload: (id: string, title: string) => void;
  /** 根据视图模式选择封面字段 */
  getCoverSrc: (item: Torrent) => string;
}

/**
 * GridView
 * 职责：网格卡片列表（复用 `TorrentCard`）
 * 说明：纯UI组件，所有数据和事件通过 props 输入。
 */
export function GridView({
  items,
  getCategoryLabel,
  onDownload,
  getCoverSrc,
}: GridViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4 mt-4 mb-18">
      {items.map((torrent) => (
        <TorrentCard
          key={torrent.id}
          id={torrent.id}
          thumbnail={getCoverSrc(torrent)}
          title={torrent.title}
          subTitle={torrent.subTitle}
          category={getCategoryLabel(torrent.category) || torrent.category}
          size={torrent.size}
          seeders={torrent.seeders}
          leechers={torrent.leechers}
          isFree={torrent.isFree}
          isVip={torrent.isVip}
          isHot={torrent.isHot}
          rating={torrent.rating}
          comments={torrent.comments}
          doubanUrl={torrent.doubanUrl}
          onDownloadByIdTitle={onDownload}
        />
      ))}
    </div>
  );
}
