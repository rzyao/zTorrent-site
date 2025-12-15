import { FeaturedTorrent } from "../components/FeaturedTorrent";
import { TorrentRow } from "../components/TorrentRow";
import { useParams } from "react-router-dom";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useHomeData } from "@/hooks/useHomeData";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSize } from "@/utils/format";

// 适配器：将后端 DTO 转换为 TorrentRow 所需格式
function adaptToCard(item: any) {
  if (!item) return null;
  return {
    id: item.id,
    thumbnail:
      item.cover ||
      item.poster ||
      item.img ||
      "https://via.placeholder.com/400x600",
    title: item.title || item.name || "未知标题",
    category: item.category || "其它",
    size: formatSize(item.size || 0),
    seeders: item.seeders || 0,
    leechers: item.leechers || 0,
    isFree: !!(item.isFree || item.promotion === "Free"),
    isVip: !!item.isVip,
    isHot: !!item.isHot,
    rating: item.rating || 0,
    comments: item.comments || 0,
  };
}

// 适配器：将后端 DTO 转换为 FeaturedTorrent 所需格式
function adaptToFeatured(item: any) {
  if (!item) return null;
  return {
    title: item.title || item.name || "未知标题",
    description: item.description || item.subject || "暂无简介", // subject 是很多 PT 站点的副标题字段
    backgroundImage:
      item.backdrop ||
      item.cover ||
      item.poster ||
      "https://via.placeholder.com/1920x1080",
    category: item.category || "其它",
    size: formatSize(item.size || 0),
    seeders: item.seeders || 0,
    leechers: item.leechers || 0,
    rating: item.rating || 0.0,
    uploadDate: item.uploadedAt
      ? new Date(item.uploadedAt).toLocaleDateString()
      : "未知日期",
    isFree: !!(item.isFree || item.promotion === "Free"),
  };
}

export default function HomePage() {
  const { category } = useParams();
  const pageTitle = category ? `${category} - 首页` : "首页";
  useDynamicTitle(pageTitle);

  // 获取数据
  const { featured, hot, latest, free, vip, isLoading } = useHomeData({
    category,
  });

  // 转换数据
  const featuredData = adaptToFeatured(featured.data);
  const hotList = (hot.data || []).map(adaptToCard).filter(Boolean);
  const latestList = (latest.data || []).map(adaptToCard).filter(Boolean);
  const freeList = (free.data || []).map(adaptToCard).filter(Boolean);
  const vipList = (vip.data || []).map(adaptToCard).filter(Boolean);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#0F171E] flex flex-col items-center justify-center gap-4">
        <Skeleton className="w-full h-[60vh] bg-gray-800" />
        <div className="w-full px-8 space-y-8">
          <Skeleton className="w-48 h-8 bg-gray-800" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                className="w-48 h-72 bg-gray-800 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 如果没有数据，且不处于加载状态
  if (!featuredData && hotList.length === 0 && latestList.length === 0) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center text-gray-400">
        该分类下暂无推荐内容
      </div>
    );
  }

  return (
    <>
      {featuredData ? (
        <FeaturedTorrent {...featuredData} />
      ) : (
        // 如果没有 Banner 数据但有列表数据，显示一个占位 Banner 或仅留白
        <div className="h-24 md:h-32" />
      )}

      <div className="relative -mt-24 space-y-8 pb-16 z-10">
        {/* 仅当有数据时渲染各板块 */}
        {hotList.length > 0 && (
          <TorrentRow title="本周热门" torrents={hotList as any[]} />
        )}
        {latestList.length > 0 && (
          <TorrentRow title="最新上传" torrents={latestList as any[]} />
        )}
        {freeList.length > 0 && (
          <TorrentRow title="免费下载" torrents={freeList as any[]} />
        )}
        {vipList.length > 0 && (
          <TorrentRow title="VIP专享" torrents={vipList as any[]} />
        )}
      </div>
    </>
  );
}
