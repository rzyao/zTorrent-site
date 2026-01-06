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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { HomeActionBar } from "./HomeActionBar";

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
  id: number;
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

export default function DesignPage() {
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

  // 公告数据
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "【重要】关于加强版权保护的公告",
      type: "system",
      time: "2024-12-14 10:30",
      isTop: true,
    },
    {
      id: 2,
      title: "【活动】圣诞节双倍上传活动开启",
      type: "event",
      time: "2024-12-13 15:20",
      isTop: true,
    },
    {
      id: 3,
      title: "【通知】服务器维护 - 12月20日凌晨2点",
      type: "notice",
      time: "2024-12-12 18:45",
    },
    {
      id: 4,
      title: "【公告】新增4K专区，欢迎上传优质资源",
      type: "notice",
      time: "2024-12-10 09:15",
    },
    {
      id: 5,
      title: "【活动】邀请好友送魔力值活动",
      type: "event",
      time: "2024-12-08 14:20",
    },
  ];

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

  return (
    <div className="flex min-h-screen flex-col bg-[#0F171E] pt-16">
      <div className="mx-auto w-full max-w-[1920px] flex-1 px-4 py-6 md:px-8">
        {/* 顶部搜索栏 */}
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-linear-to-r from-neutral-800/40 via-neutral-800/60 to-neutral-800/40 p-4 shadow-lg shadow-amber-500/10 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:shadow-amber-500/20">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="搜索种子标题、副标题、发布者..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-neutral-700/50 bg-neutral-900/50 text-lg text-white transition-all placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <Button className="h-12 border-0 bg-linear-to-r from-amber-500 to-orange-500 px-8 text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-500/50">
              <Search className="mr-2 h-5 w-5" />
              搜索
            </Button>
          </div>
        </div>

        {/* 快速导航 */}
        <div className="mb-6">
          <div className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-4 backdrop-blur-sm transition-colors hover:border-amber-500/50">
            <div className="scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 flex items-center gap-2 overflow-x-auto">
              <button className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-linear-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 whitespace-nowrap text-amber-300 transition-all hover:from-amber-500/30 hover:to-orange-500/30">
                <Flame className="h-4 w-4" />
                最新种子
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-900/30 px-4 py-2 whitespace-nowrap text-neutral-300 transition-all hover:border-amber-500/50 hover:text-amber-300">
                <TrendingUp className="h-4 w-4" />
                热门推荐
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-900/30 px-4 py-2 whitespace-nowrap text-neutral-300 transition-all hover:border-amber-500/50 hover:text-amber-300">
                <Gift className="h-4 w-4" />
                求种大厅
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-900/30 px-4 py-2 whitespace-nowrap text-neutral-300 transition-all hover:border-amber-500/50 hover:text-amber-300">
                <MessageSquare className="h-4 w-4" />
                社区论坛
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-900/30 px-4 py-2 whitespace-nowrap text-neutral-300 transition-all hover:border-amber-500/50 hover:text-amber-300">
                <Sparkles className="h-4 w-4" />
                限时活动
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-900/30 px-4 py-2 whitespace-nowrap text-neutral-300 transition-all hover:border-amber-500/50 hover:text-amber-300">
                <Award className="h-4 w-4" />
                排行榜
              </button>
            </div>
          </div>
        </div>

        {/* 顶部三列布局 */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 左侧：站点公告 */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5 backdrop-blur-sm transition-colors hover:border-amber-500/50">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg text-white">
                  <Bell className="h-5 w-5 text-amber-400" />
                  站点公告
                </h2>
              </div>

              {/* 滚动容器包装器 */}
              <div className="relative">
                {/* 顶部渐变遮罩和图标 */}
                <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex h-8 items-start justify-center bg-linear-to-b from-neutral-900/80 to-transparent pt-1">
                  <ChevronUp
                    className="h-4 w-4 animate-bounce text-amber-400/60"
                    style={{ animationDuration: "2s" }}
                  />
                </div>

                {/* 滚动内容区域 */}
                <div className="scrollbar-thin scrollbar-thumb-amber-600/60 hover:scrollbar-thumb-amber-500/80 scrollbar-track-neutral-800/60 max-h-[400px] space-y-2 overflow-y-auto px-1">
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

                {/* 底部渐变遮罩和图标 */}
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 flex h-8 items-end justify-center bg-linear-to-t from-neutral-900/80 to-transparent pb-1">
                  <ChevronDown
                    className="h-4 w-4 animate-bounce text-amber-400/60"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 中间：最热种子轮播 */}
          <div className="lg:col-span-6">
            <div className="group relative h-full overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40 backdrop-blur-sm transition-colors hover:border-amber-500/50">
              {/* 轮播内容 */}
              <div className="relative h-[400px]">
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
                      className={`h-2 w-2 rounded-full transition-all ${index === currentSlide
                          ? "w-8 bg-amber-400"
                          : "bg-white/50 hover:bg-white/70"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：站点统计 */}
          <div className="lg:col-span-3">
            <div className="h-full rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5 backdrop-blur-sm transition-colors hover:border-amber-500/50">
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
          <section className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5 backdrop-blur-sm transition-colors hover:border-amber-500/50">
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
          <section className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5 backdrop-blur-sm transition-colors hover:border-amber-500/50">
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
          <section className="rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5 backdrop-blur-sm transition-colors hover:border-amber-500/50">
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
                  className="group cursor-pointer rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-3 transition-all hover:bg-neutral-800/50"
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

        {/* 热门电影九宫格 */}
        <section className="mt-6 rounded-xl border border-neutral-700/50 bg-neutral-800/40 p-5 backdrop-blur-sm transition-colors hover:border-amber-500/50">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl text-white">
              <Film className="h-6 w-6 text-amber-400" />
              热门电影推荐
              <Badge className="border-amber-500/50 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-300">
                精选
              </Badge>
            </h2>
            <Button className="border border-neutral-700/50 bg-neutral-900/30 text-white transition-all hover:border-amber-500 hover:bg-amber-500/10">
              查看更多
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {/* 电影 1 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600"
                    alt="星际穿越"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* 徽章 */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-linear-to-r from-amber-500 to-orange-600 text-white">
                      <Crown className="mr-1 h-3 w-3" />
                      VIP
                    </Badge>
                    <Badge className="border-0 bg-green-500 text-white">
                      <Gift className="mr-1 h-3 w-3" />
                      FREE
                    </Badge>
                  </div>

                  {/* 评分 */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.8</span>
                  </div>

                  {/* 悬浮信息 */}
                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">2847</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">156</span>
                      </span>
                      <span className="text-neutral-400">68.5 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    星际穿越 Interstellar
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K HDR REMUX 杜比全景声</p>
                </div>
              </div>
            </div>

            {/* 电影 2 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600"
                    alt="沙丘2"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-red-500 text-white">
                      <Flame className="mr-1 h-3 w-3" />
                      HOT
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.1</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">1876</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">543</span>
                      </span>
                      <span className="text-neutral-400">92.3 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    沙丘2 Dune: Part Two
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">IMAX 4K UHD 杜比视界</p>
                </div>
              </div>
            </div>

            {/* 电影 3 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=600"
                    alt="奥本海默"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-green-500 text-white">
                      <Gift className="mr-1 h-3 w-3" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.4</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">2145</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">687</span>
                      </span>
                      <span className="text-neutral-400">98.7 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    奥本海默 Oppenheimer
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K UHD IMAX版本 HDR</p>
                </div>
              </div>
            </div>

            {/* 电影 4 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=600"
                    alt="盗梦空间"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-linear-to-r from-amber-500 to-orange-600 text-white">
                      <Crown className="mr-1 h-3 w-3" />
                      VIP
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.6</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">3254</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">234</span>
                      </span>
                      <span className="text-neutral-400">75.6 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    盗梦空间 Inception
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K UHD HDR10+ 杜比全景声</p>
                </div>
              </div>
            </div>

            {/* 电影 5 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600"
                    alt="黑暗骑士"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-red-500 text-white">
                      <Flame className="mr-1 h-3 w-3" />
                      HOT
                    </Badge>
                    <Badge className="border-0 bg-green-500 text-white">
                      <Gift className="mr-1 h-3 w-3" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.7</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">4123</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">412</span>
                      </span>
                      <span className="text-neutral-400">82.4 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    黑暗骑士 The Dark Knight
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K UHD REMUX 国英双语</p>
                </div>
              </div>
            </div>

            {/* 电影 6 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600"
                    alt="教父"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-purple-500 text-white">
                      <Award className="mr-1 h-3 w-3" />
                      经典
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.9</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">2876</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">98</span>
                      </span>
                      <span className="text-neutral-400">65.3 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    教父 The Godfather
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K UHD 修复版 双语字幕</p>
                </div>
              </div>
            </div>

            {/* 电影 7 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600"
                    alt="肖申克的救赎"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-linear-to-r from-amber-500 to-orange-600 text-white">
                      <Crown className="mr-1 h-3 w-3" />
                      VIP
                    </Badge>
                    <Badge className="border-0 bg-green-500 text-white">
                      <Gift className="mr-1 h-3 w-3" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.9</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">5234</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">156</span>
                      </span>
                      <span className="text-neutral-400">71.2 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    肖申克的救赎 The Shawshank Redemption
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K UHD 修复版 国英双语</p>
                </div>
              </div>
            </div>

            {/* 电影 8 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1574267432644-f74f8cc3709f?w=600"
                    alt="银翼杀手2049"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-red-500 text-white">
                      <Flame className="mr-1 h-3 w-3" />
                      HOT
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">8.9</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">1987</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">345</span>
                      </span>
                      <span className="text-neutral-400">88.9 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    银翼杀手2049 Blade Runner 2049
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K UHD HDR 杜比视界</p>
                </div>
              </div>
            </div>

            {/* 电影 9 */}
            <div className="group transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110">
              <div className="relative overflow-hidden rounded-lg border border-neutral-700/50 bg-neutral-900/50 shadow-lg transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="relative aspect-2/3">
                  <img
                    src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600"
                    alt="指环王"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="border-0 bg-purple-500 text-white">
                      <Award className="mr-1 h-3 w-3" />
                      经典
                    </Badge>
                    <Badge className="border-0 bg-green-500 text-white">
                      <Gift className="mr-1 h-3 w-3" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-white">9.5</span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">3456</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">234</span>
                      </span>
                      <span className="text-neutral-400">156.7 GB</span>
                    </div>
                    <Button className="w-full bg-linear-to-r from-amber-500 to-orange-600 py-2 text-sm text-white hover:from-amber-600 hover:to-orange-700">
                      <Download className="mr-1 h-3 w-3" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm text-white transition-colors group-hover:text-amber-400">
                    指环王三部曲 The Lord of the Rings Trilogy
                  </h3>
                  <p className="line-clamp-1 text-xs text-neutral-400">4K UHD 加长版 国英双语</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 底部操作栏 */}
      <HomeActionBar />
    </div>
  );
}
