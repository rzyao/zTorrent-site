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

export function PTHomePage() {
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
  const announcements: Announcement[] = [];

  // 最热种子轮播数据
  const hotTorrents: HotTorrent[] = [];

  // 求种信息
  const requests: Request[] = [];

  // 精华推荐
  const recommendations: Recommendation[] = [];

  // 论坛热帖
  const forumPosts: ForumPost[] = [];

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
    setCurrentSlide(
      (prev) => (prev - 1 + hotTorrents.length) % hotTorrents.length
    );
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
    <div className="min-h-screen bg-[#0F171E] pt-16">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6">
        {/* 导航栏和按钮栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          {/* 导航栏 */}
          <div className="lg:col-span-8">
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300 whitespace-nowrap flex items-center gap-2 hover:from-amber-500/30 hover:to-orange-500/30 transition-all">
                  <Flame className="w-4 h-4" />
                  最新种子
                </button>
                <button className="px-4 py-2 rounded-lg bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-amber-500/50 hover:text-amber-300 transition-all">
                  <TrendingUp className="w-4 h-4" />
                  热门推荐
                </button>
                <button className="px-4 py-2 rounded-lg bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-amber-500/50 hover:text-amber-300 transition-all">
                  <Gift className="w-4 h-4" />
                  求种大厅
                </button>
                <button className="px-4 py-2 rounded-lg bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-amber-500/50 hover:text-amber-300 transition-all">
                  <MessageSquare className="w-4 h-4" />
                  社区论坛
                </button>
                <button className="px-4 py-2 rounded-lg bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-amber-500/50 hover:text-amber-300 transition-all">
                  <Sparkles className="w-4 h-4" />
                  限时活动
                </button>
                <button className="px-4 py-2 rounded-lg bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-amber-500/50 hover:text-amber-300 transition-all">
                  <Award className="w-4 h-4" />
                  排行榜
                </button>
              </div>
            </div>
          </div>

          {/* 按钮栏 */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-4">
              <div className="flex items-center gap-2 justify-end overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-300 whitespace-nowrap flex items-center gap-2 hover:from-green-500/30 hover:to-emerald-500/30 transition-all">
                  <Upload className="w-4 h-4" />
                  上传种子
                </button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300 whitespace-nowrap flex items-center gap-2 hover:from-amber-500/30 hover:to-orange-500/30 transition-all">
                  <Gift className="w-4 h-4" />
                  发布求种
                </button>
                <button className="px-3 py-2 rounded-lg bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 hover:border-red-500/50 hover:text-red-300 transition-all">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 rounded-lg bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 hover:border-blue-500/50 hover:text-blue-300 transition-all relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 顶部三列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* 左侧：站点公告 */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  站点公告
                </h2>
              </div>

              {/* 滚动容器包装器 */}
              <div className="relative">
                {/* 顶部渐变遮罩和图标 */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900/80 to-transparent z-10 pointer-events-none flex items-start justify-center pt-1">
                  <ChevronUp
                    className="w-4 h-4 text-amber-400/60 animate-bounce"
                    style={{ animationDuration: "2s" }}
                  />
                </div>

                {/* 滚动内容区域 */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600/60 hover:scrollbar-thumb-amber-500/80 scrollbar-track-neutral-800/60 px-1">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 rounded-lg bg-neutral-900/30 hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Badge
                          className={`${getAnnouncementTypeColor(
                            announcement.type
                          )} text-xs whitespace-nowrap`}
                        >
                          {announcement.type === "system" && "系统"}
                          {announcement.type === "event" && "活动"}
                          {announcement.type === "notice" && "通知"}
                        </Badge>
                        {announcement.isTop && (
                          <Badge className="bg-red-500 text-white text-xs border-0">
                            置顶
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-white text-sm group-hover:text-amber-400 transition-colors mb-2">
                        {announcement.title}
                      </h4>
                      <p className="text-neutral-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {announcement.time}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 底部渐变遮罩和图标 */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900/80 to-transparent z-10 pointer-events-none flex items-end justify-center pb-1">
                  <ChevronDown
                    className="w-4 h-4 text-amber-400/60 animate-bounce"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 中间：最热种子轮播 */}
          <div className="lg:col-span-6">
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors overflow-hidden h-full relative group">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-neutral-900/30" />
                    </div>

                    <div className="relative h-full flex flex-col justify-end p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/50">
                          {torrent.category}
                        </Badge>
                        {torrent.isFree && (
                          <Badge className="bg-green-500/30 text-green-300 border-green-500/50">
                            <Gift className="w-3 h-3 mr-1" />
                            FREE
                          </Badge>
                        )}
                        {torrent.isVip && (
                          <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/50">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP
                          </Badge>
                        )}
                        <Badge className="bg-red-500/30 text-red-300 border-red-500/50">
                          <Flame className="w-3 h-3 mr-1" />
                          HOT
                        </Badge>
                      </div>

                      <h2 className="text-white text-3xl mb-2">
                        {torrent.title}
                      </h2>
                      <p className="text-neutral-300 text-lg mb-4">
                        {torrent.subtitle}
                      </p>

                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-neutral-400">
                          大小:{" "}
                          <span className="text-white">{torrent.size}</span>
                        </span>
                        <span className="text-neutral-400">
                          做种:{" "}
                          <span className="text-green-400">
                            {torrent.seeders}
                          </span>
                        </span>
                        <span className="text-neutral-400">
                          下载:{" "}
                          <span className="text-red-400">
                            {torrent.leechers}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{torrent.rating}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 轮播控制按钮 */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* 轮播指示器 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {hotTorrents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? "bg-amber-400 w-8"
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
            <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-5 h-full">
              <h2 className="text-white text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                站点统计
              </h2>

              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30">
                  <div className="text-blue-400 text-3xl mb-1">
                    {siteStats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-neutral-400 text-sm">注册用户</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="text-green-400 text-xl mb-1">
                      {siteStats.torrents.toLocaleString()}
                    </div>
                    <div className="text-neutral-500 text-xs">种子数</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="text-purple-400 text-xl mb-1">
                      {siteStats.seeders.toLocaleString()}
                    </div>
                    <div className="text-neutral-500 text-xs">做种者</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="text-red-400 text-xl mb-1">
                      {siteStats.peers.toLocaleString()}
                    </div>
                    <div className="text-neutral-500 text-xs">下载者</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="text-amber-400 text-xl mb-1">
                      {siteStats.onlineUsers.toLocaleString()}
                    </div>
                    <div className="text-neutral-500 text-xs">在线用户</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6 bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="搜索种子标题、副标题、发布者..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-900/50 border-neutral-700/50 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <Button className="bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 hover:border-amber-500 hover:bg-amber-500/10 text-white px-6 transition-all">
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </div>
        </div>

        {/* 底部三列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 求种信息 */}
          <section className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                求种信息
                <Badge className="bg-amber-500/20 text-amber-400 text-xs border-amber-500/30">
                  {requests.filter((r) => r.status === "open").length} 个待完成
                </Badge>
              </h2>
            </div>

            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50 hover:border-amber-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white text-sm flex-1 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {request.title}
                    </h3>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {request.requester}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Award className="w-3 h-3" />
                      {request.reward}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {request.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {request.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 精华推荐 */}
          <section className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                精华推荐
              </h2>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex gap-3 p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50 hover:border-amber-500/30 transition-all cursor-pointer group"
                >
                  <img
                    src={rec.poster}
                    alt={rec.title}
                    className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs mb-2">
                      {rec.category}
                    </Badge>
                    <h3 className="text-white text-sm mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {rec.title}
                    </h3>
                    <p className="text-neutral-400 text-xs mb-2 line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        {rec.rating}
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        <Heart className="w-3 h-3" />
                        {rec.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {rec.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 论坛热帖 */}
          <section className="bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-400" />
                论坛热帖
              </h2>
            </div>

            <div className="space-y-3">
              {forumPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50 hover:bg-neutral-800/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {post.isPinned && (
                      <Pin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    {post.isHot && (
                      <Flame className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <h3 className="text-white text-sm flex-1 line-clamp-2 group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>
                  </div>

                  <Badge className="bg-blue-500/20 text-blue-400 text-xs border-blue-500/30 mb-2">
                    {post.forum}
                  </Badge>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={post.authorAvatar} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
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
        <section className="mt-6 bg-neutral-800/40 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:border-amber-500/50 transition-colors p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl flex items-center gap-2">
              <Film className="w-6 h-6 text-amber-400" />
              热门电影推荐
              <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/50">
                精选
              </Badge>
            </h2>
            <Button className="bg-neutral-900/30 border border-neutral-700/50 hover:border-amber-500 hover:bg-amber-500/10 text-white transition-all">
              查看更多
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {/* 电影 1 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600"
                    alt="星际穿越"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* 徽章 */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                    <Badge className="bg-green-500 text-white border-0">
                      <Gift className="w-3 h-3 mr-1" />
                      FREE
                    </Badge>
                  </div>

                  {/* 评分 */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.8</span>
                  </div>

                  {/* 悬浮信息 */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">2847</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">156</span>
                      </span>
                      <span className="text-neutral-400">68.5 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    星际穿越 Interstellar
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K HDR REMUX 杜比全景声
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 2 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600"
                    alt="沙丘2"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-red-500 text-white border-0">
                      <Flame className="w-3 h-3 mr-1" />
                      HOT
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.1</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">1876</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">543</span>
                      </span>
                      <span className="text-neutral-400">92.3 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    沙丘2 Dune: Part Two
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    IMAX 4K UHD 杜比视界
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 3 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=600"
                    alt="奥本海默"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-green-500 text-white border-0">
                      <Gift className="w-3 h-3 mr-1" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.4</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">2145</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">687</span>
                      </span>
                      <span className="text-neutral-400">98.7 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    奥本海默 Oppenheimer
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K UHD IMAX版本 HDR
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 4 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=600"
                    alt="盗梦空间"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.6</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">3254</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">234</span>
                      </span>
                      <span className="text-neutral-400">75.6 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    盗梦空间 Inception
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K UHD HDR10+ 杜比全景声
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 5 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600"
                    alt="黑暗骑士"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-red-500 text-white border-0">
                      <Flame className="w-3 h-3 mr-1" />
                      HOT
                    </Badge>
                    <Badge className="bg-green-500 text-white border-0">
                      <Gift className="w-3 h-3 mr-1" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.7</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">4123</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">412</span>
                      </span>
                      <span className="text-neutral-400">82.4 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    黑暗骑士 The Dark Knight
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K UHD REMUX 国英双语
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 6 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600"
                    alt="教父"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-purple-500 text-white border-0">
                      <Award className="w-3 h-3 mr-1" />
                      经典
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.9</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">2876</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">98</span>
                      </span>
                      <span className="text-neutral-400">65.3 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    教父 The Godfather
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K UHD 修复版 双语字幕
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 7 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600"
                    alt="肖申克的救赎"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                    <Badge className="bg-green-500 text-white border-0">
                      <Gift className="w-3 h-3 mr-1" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.9</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">5234</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">156</span>
                      </span>
                      <span className="text-neutral-400">71.2 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    肖申克的救赎 The Shawshank Redemption
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K UHD 修复版 国英双语
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 8 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1574267432644-f74f8cc3709f?w=600"
                    alt="银翼杀手2049"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-red-500 text-white border-0">
                      <Flame className="w-3 h-3 mr-1" />
                      HOT
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">8.9</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">1987</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">345</span>
                      </span>
                      <span className="text-neutral-400">88.9 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    银翼杀手2049 Blade Runner 2049
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K UHD HDR 杜比视界
                  </p>
                </div>
              </div>
            </div>

            {/* 电影 9 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-neutral-900/50 border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600"
                    alt="指环王"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-purple-500 text-white border-0">
                      <Award className="w-3 h-3 mr-1" />
                      经典
                    </Badge>
                    <Badge className="bg-green-500 text-white border-0">
                      <Gift className="w-3 h-3 mr-1" />
                      FREE
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm">9.5</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">3456</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">234</span>
                      </span>
                      <span className="text-neutral-400">156.7 GB</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm py-2">
                      <Download className="w-3 h-3 mr-1" />
                      立即下载
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    指环王三部曲 The Lord of the Rings Trilogy
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-1">
                    4K UHD 加长版 国英双语
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
