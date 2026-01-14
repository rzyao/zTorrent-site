import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Service,
  FavoriteActionDto,
  FavoriteItemDto,
  FavoriteListDto,
  FavoriteTargetType,
} from "@/api";
import { FavoriteButton } from "@/modules/app/components/FavoriteButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/app/components/ui/tabs";
import { Loader2, Film, Music, List, Tv, File } from "lucide-react";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { Link } from "react-router-dom";

const TABS = [
  { value: "all", label: "全部", icon: null },
  { value: FavoriteTargetType.TORRENT, label: "种子", icon: File },
  { value: FavoriteTargetType.MOVIE, label: "电影", icon: Film },
  { value: FavoriteTargetType.SERIES, label: "剧集", icon: Tv },
  { value: FavoriteTargetType.PLAYLIST, label: "歌单", icon: List },
];

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites", "list", activeTab, page],
    queryFn: async () => {
      const targetType = activeTab === "all" ? undefined : (activeTab as FavoriteTargetType);
      const requestBody: FavoriteListDto = {
        page,
        limit: pageSize,
        targetType,
      };
      const resp = await Service.favoritesControllerList(requestBody);
      // Assuming automatic unwrapping or response structure
      return resp.data;
    },
  });

  const items = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">我的收藏</h1>
        <div className="text-sm text-neutral-400">共 {total} 项</div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 inline-flex max-w-full overflow-x-auto border border-neutral-800 bg-neutral-900 p-1">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-md px-4 py-2 transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">加载失败，请稍后重试</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">暂无收藏</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((item: FavoriteItemDto) => (
                <FavoriteItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}

function FavoriteItemCard({ item }: { item: FavoriteItemDto }) {
  // Simple link logic (can be refined)
  const getLink = () => {
    switch (item.targetType) {
      case FavoriteItemDto.targetType.MOVIE:
        return `/app/movies/${item.targetId}`;
      case FavoriteItemDto.targetType.SERIES:
        return `/app/series/${item.targetId}`;
      case FavoriteItemDto.targetType.TORRENT:
        return `/app/torrents/${item.targetId}`;
      case FavoriteItemDto.targetType.PLAYLIST:
        return `/app/playlists/${item.targetId}`;
      default:
        return "#";
    }
  };

  const coverUrl = item.targetCover?.url || item.targetCover?.poster || ""; // Adapt based on actual record structure

  return (
    <div className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all hover:border-amber-500/50">
      <Link to={getLink()} className="relative block aspect-2/3 overflow-hidden">
        <ImageWithFallback
          src={coverUrl || "https://via.placeholder.com/300x450?text=No+Cover"}
          alt={item.targetTitle || "Unknown"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </Link>

      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton
          targetType={item.targetType}
          targetId={item.targetId}
          variant="icon"
          className="bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        />
      </div>

      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-white" title={item.targetTitle}>
          {item.targetTitle || "未知标题"}
        </h3>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="capitalize">{item.targetType}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
