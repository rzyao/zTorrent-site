import { useState, useEffect } from "react";
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
import dayjs from "dayjs";

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

interface Request {
  id: number;
  title: string;
  category: string;
  requester: string;
  reward: number;
  replies: number;
  status: "open" | "filled" | "closed";
  time: string;
}

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

  // 站点统计数据
  const siteStats = {
    totalUsers: 28547,
    torrents: 15680,
    seeders: 8234,
    peers: 1245,
    onlineUsers: 856,
  };

  // 公告数据 SWR
  const { data: announcementData } = useQuery({
    queryKey: ["home", "announcements"],
    queryFn: () => ForumsTopicsService.topicsControllerAnnouncements({ limit: 5 }),
  });

  const announcements: Announcement[] =
    announcementData?.data?.items?.map((item: any) => {
      let type: "system" | "event" | "notice" = "notice";
      if (item.isGlobalPinned) type = "system";
      else if (item.title.includes("活动")) type = "event";

      return {
        id: item.id,
        title: item.title,
        type,
        time: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm"),
        isTop: item.isPinned,
      };
    }) || [];

  // 最热种子轮播数据
  const hotTorrents: HotTorrent[] = [
    {
      id: 1,
      title: "星际穿越 Interstellar (2014)",
      subtitle: "4K HDR REMUX 国英双语 杜比全景声",
      image: "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=800",
      category: "电影",
      size: "68.5 GB",
      seeders: 2847,
      leechers: 156,
      rating: 9.8,
      isFree: true,
    },
    {
      id: 2,
      title: "沙丘2 Dune: Part Two (2024)",
      subtitle: "IMAX 4K UHD HDR 杜比视界 国英双语",
      image: "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=800",
      category: "电影",
      size: "92.3 GB",
      seeders: 1876,
      leechers: 543,
      rating: 9.1,
      isVip: true,
    },
    {
      id: 3,
      title: "奥本海默 Oppenheimer (2023)",
      subtitle: "4K UHD IMAX版本 HDR 杜比全景声",
      image: "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=800",
      category: "电影",
      size: "98.7 GB",
      seeders: 2145,
      leechers: 687,
      rating: 9.4,
      isFree: true,
    },
    {
      id: 4,
      title: "权力的游戏 Game of Thrones",
      subtitle: "S01-S08 Complete 1080p BluRay x265 HEVC",
      image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800",
      category: "电视剧",
      size: "124.8 GB",
      seeders: 2156,
      leechers: 89,
      rating: 9.5,
    },
  ];

  // 求种信息
  const requests: Request[] = [
    {
      id: 1,
      title: "求 诺兰电影合集 4K UHD 原盘",
      category: "电影",
      requester: "MovieFan",
      reward: 5000,
      replies: 12,
      status: "open",
      time: "2小时前",
    },
    {
      id: 2,
      title: "求 宫崎骏动画全集 日语原盘 高码率",
      category: "动漫",
      requester: "AnimeLover",
      reward: 3000,
      replies: 8,
      status: "open",
      time: "5小时前",
    },
    {
      id: 3,
      title: "求 Pink Floyd 无损专辑合集",
      category: "音乐",
      requester: "MusicGeek",
      reward: 2000,
      replies: 15,
      status: "filled",
      time: "1天前",
    },
    {
      id: 4,
      title: "求 BBC Earth 纪录片系列 4K HDR",
      category: "纪录片",
      requester: "DocuFan",
      reward: 4000,
      replies: 6,
      status: "open",
      time: "1天前",
    },
  ];

  // 精华推荐
  const recommendations: Recommendation[] = [
    {
      id: 1,
      title: "【强烈推荐】沙丘2 IMAX版本观影体验分享",
      category: "电影推荐",
      description:
        "刚看完沙丘2的IMAX版本，视听效果震撼！特别是杜比全景声的音效设计，配合IMAX画幅...",
      poster: "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400",
      recommender: "CinemaExpert",
      rating: 9.5,
      likes: 234,
      comments: 67,
      time: "3小时前",
    },
    {
      id: 2,
      title: "【精品】2024年度最佳纪录片TOP10",
      category: "纪录片推荐",
      description: "整理了今年最值得看的十部纪录片，从自然到人文，从历史到科技，每一部都是精品...",
      poster: "https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?w=400",
      recommender: "DocsCollector",
      rating: 9.8,
      likes: 456,
      comments: 89,
      time: "1天前",
    },
    {
      id: 3,
      title: "【音乐】黑胶唱片入坑指南及设备推荐",
      category: "音乐推荐",
      description: "作为一个玩黑胶五年的老烧友，今天给大家分享一下入门到进阶的设备选择心得...",
      poster: "https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=400",
      recommender: "VinylMaster",
      rating: 9.2,
      likes: 189,
      comments: 45,
      time: "2天前",
    },
  ];

  // 论坛热帖
  const forumPosts: ForumPost[] = [
    {
      id: 1,
      title: "【公告】圣诞节双倍上传活动细则及注意事项",
      forum: "站点公告",
      author: "Admin",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      replies: 234,
      views: 5678,
      lastReply: "10分钟前",
      isPinned: true,
    },
    {
      id: 2,
      title: "4K HDR电影的正确播放姿势 - 从硬件到软件全面解析",
      forum: "技术交流",
      author: "TechGuru",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      replies: 456,
      views: 12345,
      lastReply: "30分钟前",
      isHot: true,
    },
    {
      id: 3,
      title: "分享率低怎么办？提升分享率的十个实用技巧",
      forum: "新手指南",
      author: "HelpfulUser",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      replies: 789,
      views: 23456,
      lastReply: "1小时前",
      isHot: true,
    },
    {
      id: 4,
      title: "【资源】蓝光原盘 vs REMUX vs Web-DL 画质对比详解",
      forum: "资源讨论",
      author: "QualityExpert",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      replies: 234,
      views: 8901,
      lastReply: "2小时前",
    },
  ];

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
              {hotTorrents.map((torrent, index) => (
                <div
                  key={torrent.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
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
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentSlide ? "w-8 bg-amber-400" : "bg-white/50 hover:bg-white/70"
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
          </div>
        </div>
      </div>

      {/* 底部三列布局 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 求种信息 */}
        <section className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg text-white">
              <Gift className="h-5 w-5 text-amber-400" />
              求种信息
              <Badge className="border-amber-500/30 bg-amber-500/20 text-xs text-amber-400">
                {requests.filter((r) => r.status === "open").length} 个待完成
              </Badge>
            </h2>
          </div>

          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group cursor-pointer rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4 transition-all hover:border-amber-500/30"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 flex-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    {request.title}
                  </h3>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {request.requester}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Award className="h-3 w-3" />
                    {request.reward}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {request.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {request.time}
                  </span>
                </div>
              </div>
            ))}
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
            {forumPosts.map((post) => (
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

                <Badge className="mb-2 border-blue-500/30 bg-blue-500/20 text-xs text-blue-400">
                  {post.forum}
                </Badge>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{post.author}</span>
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
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
