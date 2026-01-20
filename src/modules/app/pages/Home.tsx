import { useState, useEffect, useMemo } from "react";
import {
  Film,
  Tv,
  Music,
  BookOpen,
  Gamepad2,
  FileVideo,
  Disc,
  Package,
  Upload,
  Download,
  HardDrive,
  Users,
  MessageSquare,
  Clock,
  Star,
  TrendingUp,
  Gift,
  Crown,
  Flame,
  CheckCircle,
  AlertCircle,
  Search,
  Bell,
  Award,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Pin,
  Heart,
  ThumbsUp,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/modules/app/components/ui/badge";
import { Button } from "@/modules/app/components/ui/button";
import { Input } from "@/modules/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/app/components/ui/avatar";
import { Separator } from "@/modules/app/components/ui/separator";
import { PageContainer } from "@/modules/app/components/PageContainer";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useQuery } from "@tanstack/react-query";
import { ForumsTopicsService } from "@/api/services/ForumsTopicsService";
import { ForumsStatisticsService } from "@/api/services/ForumsStatisticsService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { useBountyTopics } from "./Home/hooks/useBountyTopics";
import { ListBountyTopicsDto } from "@/api/models/ListBountyTopicsDto";
import { Link } from "react-router-dom";
import { SiteStatsService } from "@/api/services/SiteStatsService";
import type { SiteStatsOverviewVo } from "@/api/models/SiteStatsOverviewVo";
import { TorrentsSearchService } from "@/api/services/TorrentsSearchService";
import { HotCarouselTorrentsDto } from "@/api/models/HotCarouselTorrentsDto";
import { PlaylistsFeaturedService } from "@/api/services/PlaylistsFeaturedService";
import type { FeaturedPlaylistsDto } from "@/api/models/FeaturedPlaylistsDto";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

interface HotTorrent {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  size: string;
  seeders: number;
  leechers: number;
  rating: number;
  isFree?: boolean;
  isVip?: boolean;
}

interface Announcement {
  id: string | number;
  title: string;
  type: "system" | "event" | "notice";
  time: string;
  isTop?: boolean;
}

// 首页“资源悬赏”改为后端悬赏进行中话题数据，移除本地 Request 类型

interface Recommendation {
  id: number;
  title: string;
  category: string;
  description: string;
  poster: string;
  recommender: string;
  rating: number;
  likes: number;
  comments: number;
  time: string;
}

interface ForumPost {
  id: number;
  title: string;
  forum: string;
  author: string;
  authorAvatar: string;
  replies: number;
  views: number;
  lastReply: string;
  isPinned?: boolean;
  isHot?: boolean;
}

export default function HomePage() {
  useDynamicTitle("首页");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // 站点统计数据 - 接入后端接口 POST /site/stats/overview
  const {
    data: statsResponse,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["home", "siteStatsOverview"],
    queryFn: () => SiteStatsService.siteStatsControllerOverview({}),
    staleTime: 60_000,
  });
  const siteStats: SiteStatsOverviewVo = (statsResponse?.data as SiteStatsOverviewVo) ?? {
    totalUsers: 0,
    torrents: 0,
    seeders: 0,
    peers: 0,
    onlineUsers: 0,
  };

  // 公告数据 SWR
  const { data: announcementData } = useQuery({
    queryKey: ["home", "announcements"],
    queryFn: () => ForumsTopicsService.topicsControllerAnnouncements({ limit: 5 }),
  });

  const announcements: Announcement[] =
    announcementData?.data?.items?.map((item: any) => {
      const tags: string[] =
        Array.isArray(item?.tags)
          ? item.tags.map((t: any) => String(t?.name ?? t))
          : Array.isArray(item?.tagNames)
            ? item.tagNames.map((n: any) => String(n))
            : [];
      let type: "system" | "event" | "notice" = "notice";
      if (item.isGlobalPinned) {
        type = "system";
      } else if (tags.includes("活动")) {
        type = "event";
      } else if (tags.includes("通知")) {
        type = "notice";
      }
      return {
        id: item.id,
        title: item.title,
        type,
        time: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm"),
        isTop: item.isPinned,
      };
    }) || [];

  // 论坛热帖数据（真实接口）- 使用统计接口 POST /forums/statistics/hot-topics
  // 说明：
  // - windowHours=1 按小时级窗口计算近期新增回复数，满足“最近1小时热度”要求
  // - limit=6 控制首页展示条数
  // - includeArchived=false 默认不包含归档话题
  const {
    data: hotTopicsResponse,
    isLoading: hotLoading,
    error: hotError,
  } = useQuery({
    queryKey: ["home", "hotTopics", 6, 1],
    queryFn: () =>
      ForumsStatisticsService.statisticsControllerGetHotTopics({
        limit: 6,
        windowHours: 1,
        includeArchived: false,
      }),
  });

  // 将接口返回的 ForumTopic[] 映射为首页展示所需的轻量字段
  // 保留：标题、回复数、浏览量、置顶/热门状态、最后回复时间
  const hotTopics = (hotTopicsResponse?.data ?? []) as any[];
  const hotTopicItems: ForumPost[] = useMemo(
    () =>
      hotTopics.map((t: any, idx: number) => ({
        id: Number(t?.id ?? idx + 1),
        title: String(t?.title ?? ""),
        forum: "", // 接口未返回分类名称，这里留空，不做兼容显示
        author: "", // 接口未返回作者名称，这里留空，不做兼容显示
        authorAvatar: "", // 接口未返回头像，这里留空
        replies: Number(t?.replyCount ?? 0),
        views: Number(t?.views ?? 0),
        lastReply: t?.lastReplyAt ? dayjs(t.lastReplyAt).fromNow() : "-",
        isPinned: Boolean(t?.isPinned ?? false),
        isHot: Boolean(t?.isTrending ?? false),
      })),
    [hotTopics],
  );

  // 最热种子轮播数据 - 接入后端接口 POST /torrents/search/hot-carousel
  const {
    data: hotCarouselResponse,
    isLoading: carouselLoading,
    error: carouselError,
  } = useQuery({
    queryKey: ["home", "hotCarousel", 4, HotCarouselTorrentsDto.orderBy.HOT_DOWNLOADS, 7],
    queryFn: () =>
      TorrentsSearchService.torrentSearchControllerHotCarousel({
        limit: 4,
        orderBy: HotCarouselTorrentsDto.orderBy.HOT_DOWNLOADS,
        days: 7,
      }),
    staleTime: 60_000,
  });
  const carouselItems = (hotCarouselResponse?.data ?? []) as any[];
  const hotTorrents: HotTorrent[] = useMemo(
    () =>
      carouselItems.map((t: any, idx: number) => ({
        id: Number(t?.id ?? idx + 1),
        title: String(t?.title ?? t?.name ?? ""),
        subtitle: String(t?.subTitle ?? t?.subtitle ?? ""),
        image:
          String(
            t?.poster ??
            t?.coverUrl ??
            t?.thumbnailUrl ??
            "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=800",
          ),
        category: String(t?.category?.name ?? t?.categoryName ?? ""),
        size: String(t?.sizeHuman ?? t?.size ?? ""),
        seeders: Number(t?.seeders ?? t?.seederCount ?? 0),
        leechers: Number(t?.leechers ?? t?.leecherCount ?? 0),
        rating: Number(t?.rating ?? t?.score ?? 0),
        isFree: Boolean(t?.isFree ?? t?.freeleech ?? false),
        isVip: Boolean(t?.isVip ?? t?.vipOnly ?? false),
      })),
    [carouselItems],
  );

  // 资源悬赏（悬赏进行中话题）- 后端数据
  // 默认页码=1、limit=8、sort=latest；由后端统一判定“进行中”
  const {
    items: bountyTopics,
    total: bountyTotal,
    isLoading: bountyLoading,
    error: bountyError,
  } = useBountyTopics({ page: 1, limit: 8, sort: ListBountyTopicsDto.sort.LATEST });

  // 精华片单推荐 - 接入后端接口 POST /playlists/featured/list
  const {
    data: featuredResponse,
    isLoading: featuredLoading,
    error: featuredError,
  } = useQuery({
    queryKey: ["home", "featuredPlaylists", 3, "featured", "movie", "sort"],
    queryFn: () =>
      PlaylistsFeaturedService.playlistFeaturedControllerList({
        limit: 3,
        categoryKey: "featured",
        type: "movie",
        orderBy: "sort",
      } as FeaturedPlaylistsDto),
    staleTime: 300_000,
  });
  const featuredItems = (featuredResponse?.data ?? []) as any[];
  const recommendations: Recommendation[] = useMemo(
    () =>
      featuredItems.map((p: any, idx: number) => ({
        id: Number(p?.id ?? idx + 1),
        title: String(p?.title ?? ""),
        category: String(p?.categoryKey ?? p?.type ?? "精选"),
        description: String(p?.description ?? ""),
        poster: String(p?.poster ?? p?.coverUrl ?? p?.thumbnailUrl ?? ""),
        recommender: String(p?.ownerName ?? p?.recommender ?? "编辑精选"),
        rating: Number(p?.rating ?? 0),
        likes: Number(p?.likes ?? 0),
        comments: Number(p?.comments ?? 0),
        time: p?.updatedAt
          ? dayjs(p.updatedAt).fromNow()
          : p?.createdAt
            ? dayjs(p.createdAt).fromNow()
            : "",
      })),
    [featuredItems],
  );

  // 原本的“论坛热帖”本地数据已移除，改为使用 hotTopicItems（真实接口数据）

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % hotTorrents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hotTorrents.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % hotTorrents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + hotTorrents.length) % hotTorrents.length);
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case "system":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "event":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "notice":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "filled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "closed":
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "求种中";
      case "filled":
        return "已完成";
      case "closed":
        return "已关闭";
      default:
        return "未知";
    }
  };
  /* 卡片背景色从bg-linear-to-br from-neutral-800/60 to-stone-900/60修改为bg-neutral-800/40 */
  return (
    <PageContainer className="max-w-[1920px] px-4 py-6 md:px-14">
      {/* 顶部三列布局 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 左侧：站点公告 */}
        <div className="lg:col-span-3">
          <div className="h-full rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg text-white">
                <Bell className="h-5 w-5 text-amber-400" />
                站点公告
              </h2>
            </div>

            <div className="max-h-[310px] space-y-2 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-700/50 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="group cursor-pointer rounded-lg bg-neutral-900/30 p-3 transition-colors hover:bg-neutral-800/50"
                >
                  <div className="mb-2 flex items-start gap-2">
                    <Badge
                      className={`${getAnnouncementTypeColor(
                        announcement.type,
                      )} text-xs whitespace-nowrap`}
                    >
                      {announcement.type === "system" && "系统"}
                      {announcement.type === "event" && "活动"}
                      {announcement.type === "notice" && "通知"}
                    </Badge>
                    {announcement.isTop && (
                      <Badge className="border-0 bg-red-500 text-xs text-white">置顶</Badge>
                    )}
                  </div>
                  <h4 className="mb-2 text-sm text-white transition-colors group-hover:text-amber-400">
                    {announcement.title}
                  </h4>
                  <p className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="h-3 w-3" />
                    {announcement.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 中间：最热种子轮播 */}
        <div className="lg:col-span-6">
          <div className="group relative h-full overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
            {/* 轮播内容 */}
            <div className="relative h-[400px]">
              {carouselLoading && (
                <div className="flex h-full items-center justify-center">
                  <div className="h-40 w-3/4 animate-pulse rounded-xl border border-neutral-700/50 bg-neutral-900/30" />
                </div>
              )}
              {!!carouselError && (
                <div className="flex h-full items-center justify-center text-sm text-red-400">
                  加载失败：{String((carouselError as any)?.message || "请稍后重试")}
                </div>
              )}
              {!carouselLoading && !carouselError && hotTorrents.length === 0 && (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  暂无轮播数据
                </div>
              )}
              {hotTorrents.map((torrent, index) => (
                <div
                  key={torrent.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${torrent.image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/70 to-neutral-900/30" />
                  </div>

                  <div className="relative flex h-full flex-col justify-end p-8">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge className="border-blue-500/50 bg-blue-500/30 text-blue-300">
                        {torrent.category}
                      </Badge>
                      {torrent.isFree && (
                        <Badge className="border-green-500/50 bg-green-500/30 text-green-300">
                          <Gift className="mr-1 h-3 w-3" />
                          FREE
                        </Badge>
                      )}
                      {torrent.isVip && (
                        <Badge className="border-amber-500/50 bg-amber-500/30 text-amber-300">
                          <Crown className="mr-1 h-3 w-3" />
                          VIP
                        </Badge>
                      )}
                      <Badge className="border-red-500/50 bg-red-500/30 text-red-300">
                        <Flame className="mr-1 h-3 w-3" />
                        HOT
                      </Badge>
                    </div>

                    <h2 className="mb-2 text-3xl text-white">{torrent.title}</h2>
                    <p className="mb-4 text-lg text-neutral-300">{torrent.subtitle}</p>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-neutral-400">
                        大小: <span className="text-white">{torrent.size}</span>
                      </span>
                      <span className="text-neutral-400">
                        做种: <span className="text-green-400">{torrent.seeders}</span>
                      </span>
                      <span className="text-neutral-400">
                        下载: <span className="text-red-400">{torrent.leechers}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white">{torrent.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* 轮播控制按钮 */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* 轮播指示器 */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {hotTorrents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-amber-400" : "bg-white/50 hover:bg-white/70"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：站点统计 */}
        <div className="lg:col-span-3">
          <div className="h-full rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg text-white">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              站点统计
            </h2>

            {statsLoading && (
              <div className="space-y-4">
                <div className="h-20 animate-pulse rounded-lg border border-neutral-700/50 bg-neutral-900/30" />
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={`stats-skeleton-${i}`}
                      className="h-16 animate-pulse rounded-lg border border-neutral-700/50 bg-neutral-900/30"
                    />
                  ))}
                </div>
              </div>
            )}
            {!!statsError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                加载失败：{String((statsError as any)?.message || "请稍后重试")}
              </div>
            )}
            {!statsLoading && !statsError && (
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-500/30 bg-linear-to-br from-blue-500/20 to-cyan-600/20 p-4 text-center">
                  <div className="mb-1 text-3xl text-blue-400">
                    {siteStats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-400">注册用户</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 text-center">
                    <div className="mb-1 text-xl text-green-400">
                      {siteStats.torrents.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">种子数</div>
                  </div>
                  <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 text-center">
                    <div className="mb-1 text-xl text-purple-400">
                      {siteStats.seeders.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">做种者</div>
                  </div>
                  <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 text-center">
                    <div className="mb-1 text-xl text-red-400">
                      {siteStats.peers.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">下载者</div>
                  </div>
                  <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 text-center">
                    <div className="mb-1 text-xl text-amber-400">
                      {siteStats.onlineUsers.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">在线用户</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部三列布局 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 资源悬赏 */}
        <section className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg text-white">
              <Gift className="h-5 w-5 text-amber-400" />
              资源悬赏
              <Badge className="border-amber-500/30 bg-amber-500/20 text-xs text-amber-400">
                {bountyTotal} 个进行中
              </Badge>
            </h2>
          </div>

          <div className="space-y-3">
            {bountyLoading && (
              <>
                {/* 加载骨架：占位卡片 */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-16 animate-pulse rounded-lg border border-neutral-700/50 bg-neutral-900/30"
                  />
                ))}
              </>
            )}
            {!!bountyError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                加载失败：{String((bountyError as any)?.message || "请稍后重试")}
              </div>
            )}
            {!bountyLoading && !bountyError && bountyTopics.length === 0 && (
              <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4 text-sm text-neutral-400">
                暂无进行中的悬赏话题
              </div>
            )}
            {bountyTopics.map((topic) => (
              <div
                key={topic.id}
                className="group cursor-pointer rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4 transition-all hover:border-amber-500/30"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 flex-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    {topic.title}
                  </h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    进行中
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Award className="h-3 w-3" />
                    {topic.bounty?.amount ?? "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {topic.replyCount ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {topic.views ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {topic.updatedAt ? dayjs(topic.updatedAt).fromNow() : "-"}
                  </span>
                </div>
              </div>
            ))}
            {/* 查看更多：跳转到论坛最新话题页 */}
            {!bountyLoading && !bountyError && bountyTopics.length > 0 && (
              <div className="pt-2">
                <Link to="/forum/latest">
                  <Button variant="outline" className="w-full border-amber-500/30 text-amber-400">
                    查看更多悬赏话题
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 精华推荐 */}
        <section className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg text-white">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              精华推荐
            </h2>
          </div>

          <div className="space-y-4">
            {featuredLoading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`featured-skeleton-${i}`}
                    className="h-28 animate-pulse rounded-lg border border-neutral-700/50 bg-neutral-900/30"
                  />
                ))}
              </>
            )}
            {!!featuredError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                加载失败：{String((featuredError as any)?.message || "请稍后重试")}
              </div>
            )}
            {!featuredLoading && !featuredError && recommendations.length === 0 && (
              <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4 text-sm text-neutral-400">
                暂无精选片单
              </div>
            )}
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="group flex cursor-pointer gap-3 rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 transition-all hover:border-amber-500/30"
              >
                <img
                  src={rec.poster}
                  alt={rec.title}
                  className="h-28 w-20 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Badge className="mb-2 border-purple-500/30 bg-purple-500/20 text-xs text-purple-400">
                    {rec.category}
                  </Badge>
                  <h3 className="mb-2 line-clamp-2 text-sm text-white transition-colors group-hover:text-amber-400">
                    {rec.title}
                  </h3>
                  <p className="mb-2 line-clamp-2 text-xs text-neutral-400">{rec.description}</p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      {rec.rating}
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                      <Heart className="h-3 w-3" />
                      {rec.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {rec.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 论坛热帖 */}
        <section className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg text-white">
              <Flame className="h-5 w-5 text-red-400" />
              论坛热帖
            </h2>
          </div>

          <div className="space-y-3">
            {hotLoading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`hot-skeleton-${i}`}
                    className="h-16 animate-pulse rounded-lg border border-neutral-700/50 bg-neutral-900/30"
                  />
                ))}
              </>
            )}
            {!!hotError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                加载失败：{String((hotError as any)?.message || "请稍后重试")}
              </div>
            )}
            {!hotLoading && !hotError && hotTopicItems.length === 0 && (
              <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4 text-sm text-neutral-400">
                暂无热门话题（最近1小时）
              </div>
            )}
            {hotTopicItems.map((post) => (
              <div
                key={post.id}
                className="group cursor-pointer rounded-lg bg-neutral-900/30 p-3 transition-all hover:bg-neutral-800/50"
              >
                <div className="mb-2 flex items-start gap-2">
                  {post.isPinned && <Pin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />}
                  {post.isHot && <Flame className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
                  <h3 className="line-clamp-2 flex-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    {post.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    {post.lastReply !== "-" && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.lastReply}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {!hotLoading && !hotError && hotTopicItems.length > 0 && (
              <div className="pt-2">
                <Link to="/forum/hot">
                  <Button variant="outline" className="w-full border-amber-500/30 text-amber-400">
                    查看更多热帖
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
