import { FeaturedTorrent } from "@/modules/app/components/FeaturedTorrent";
import { TorrentRow } from "@/modules/app/components/TorrentRow";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";

const featuredTorrent = {
  title: "星际穿越 Interstellar (2014)",
  description:
    "在地球即将毁灭之际，前宇航员库珀必须离开家人，带领一支探险队穿越虫洞，寻找人类的新家园。这是一场关于时间、空间和爱的史诗级冒险。4K HDR REMUX 国英双语 杜比全景声",
  backgroundImage:
    "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  category: "科幻电影",
  size: "68.5 GB",
  seeders: 2847,
  leechers: 156,
  rating: 9.8,
  uploadDate: "2024-11-10",
  isFree: true,
};

const freeTorrents = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "星际穿越 4K HDR REMUX 国英双语",
    category: "电影",
    size: "68.5 GB",
    seeders: 2847,
    leechers: 156,
    isFree: true,
    isHot: true,
    rating: 9.8,
    comments: 234,
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "权力的游戏 全八季 1080p BluRay",
    category: "剧集",
    size: "124.8 GB",
    seeders: 2156,
    leechers: 89,
    isFree: true,
    isHot: true,
    rating: 9.5,
    comments: 567,
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "蝙蝠侠：黑暗骑士 IMAX 4K UHD",
    category: "电影",
    size: "87.2 GB",
    seeders: 1923,
    leechers: 234,
    isFree: true,
    rating: 9.7,
    comments: 189,
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "蓝色星球III 4K HDR 全集",
    category: "纪录片",
    size: "156.3 GB",
    seeders: 1542,
    leechers: 312,
    isFree: true,
    rating: 9.6,
    comments: 145,
  },
  {
    id: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "肖申克的救赎 4K UHD 修复版",
    category: "电影",
    size: "72.1 GB",
    seeders: 1398,
    leechers: 67,
    isFree: true,
    rating: 9.8,
    comments: 423,
  },
  {
    id: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1587731556938-38755b4803a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Pink Floyd - Dark Side FLAC",
    category: "音乐",
    size: "3.8 GB",
    seeders: 1687,
    leechers: 45,
    isFree: true,
    rating: 9.9,
    comments: 78,
  },
];

const hotTorrents = [
  {
    id: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "碟中谍8：致命清算 4K 抢先版",
    category: "电影",
    size: "45.6 GB",
    seeders: 987,
    leechers: 1234,
    isHot: true,
    rating: 8.7,
    comments: 512,
  },
  {
    id: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "瑞克和莫蒂 S07 1080p WEB-DL",
    category: "动漫",
    size: "18.9 GB",
    seeders: 1245,
    leechers: 298,
    isHot: true,
    rating: 9.4,
    comments: 267,
  },
  {
    id: 9,
    thumbnail:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "怪奇物语 全五季 4K UHD HDR",
    category: "剧集",
    size: "342.7 GB",
    seeders: 645,
    leechers: 178,
    isHot: true,
    rating: 9.2,
    comments: 234,
  },
  {
    id: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "沙丘2 IMAX 4K HDR 杜比视界",
    category: "电影",
    size: "92.3 GB",
    seeders: 1876,
    leechers: 543,
    isHot: true,
    rating: 9.1,
    comments: 321,
  },
  {
    id: 11,
    thumbnail:
      "https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "我们的星球 第二季 4K",
    category: "纪录片",
    size: "78.5 GB",
    seeders: 892,
    leechers: 234,
    isHot: true,
    rating: 9.3,
    comments: 156,
  },
  {
    id: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "奥本海默 4K UHD IMAX版本",
    category: "电影",
    size: "98.7 GB",
    seeders: 2145,
    leechers: 687,
    isHot: true,
    rating: 9.4,
    comments: 445,
  },
];

const vipTorrents = [
  {
    id: 13,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "教父三部曲 4K UHD 修复版",
    category: "电影",
    size: "215.6 GB",
    seeders: 1567,
    leechers: 234,
    isVip: true,
    rating: 9.9,
    comments: 678,
  },
  {
    id: 14,
    thumbnail:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "绝命毒师 全五季 4K UHD",
    category: "剧集",
    size: "287.4 GB",
    seeders: 2341,
    leechers: 456,
    isVip: true,
    rating: 9.7,
    comments: 892,
  },
  {
    id: 15,
    thumbnail:
      "https://images.unsplash.com/photo-1587731556938-38755b4803a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "The Beatles 全集 FLAC 24bit",
    category: "音乐",
    size: "45.2 GB",
    seeders: 987,
    leechers: 123,
    isVip: true,
    rating: 9.8,
    comments: 234,
  },
  {
    id: 16,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "指环王三部曲 4K UHD 加长版",
    category: "电影",
    size: "298.5 GB",
    seeders: 3456,
    leechers: 789,
    isVip: true,
    rating: 9.9,
    comments: 1234,
  },
  {
    id: 17,
    thumbnail:
      "https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "BBC Earth 纪录片合集 4K",
    category: "纪录片",
    size: "567.8 GB",
    seeders: 1234,
    leechers: 345,
    isVip: true,
    rating: 9.6,
    comments: 567,
  },
  {
    id: 18,
    thumbnail:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "黑道家族 全集 1080p BluRay",
    category: "剧集",
    size: "178.9 GB",
    seeders: 876,
    leechers: 234,
    isVip: true,
    rating: 9.5,
    comments: 345,
  },
];

const movieTorrents = [
  {
    id: 19,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "盗梦空间 4K UHD BluRay",
    category: "电影",
    size: "76.3 GB",
    seeders: 1892,
    leechers: 345,
    rating: 9.6,
    comments: 456,
  },
  {
    id: 20,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "阿凡达：水之道 3D 4K",
    category: "电影",
    size: "124.7 GB",
    seeders: 2567,
    leechers: 678,
    rating: 9.2,
    comments: 789,
  },
  {
    id: 21,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "壮志凌云2：独行侠 4K IMAX",
    category: "电影",
    size: "89.4 GB",
    seeders: 1734,
    leechers: 456,
    rating: 9.3,
    comments: 567,
  },
  {
    id: 22,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "黑客帝国三部曲 4K UHD",
    category: "电影",
    size: "198.5 GB",
    seeders: 2134,
    leechers: 543,
    rating: 9.4,
    comments: 678,
  },
  {
    id: 23,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "低俗小说 4K 修复版",
    category: "电影",
    size: "67.8 GB",
    seeders: 1456,
    leechers: 234,
    rating: 9.5,
    comments: 345,
  },
  {
    id: 24,
    thumbnail:
      "https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "辛德勒的名单 4K UHD",
    category: "电影",
    size: "78.9 GB",
    seeders: 1234,
    leechers: 189,
    rating: 9.8,
    comments: 456,
  },
];

export default function AdultPage() {
  useDynamicTitle("首页");
  const [params, setParams] = useSearchParams();
  const initial = params.get("category") || "全部";
  const [activeCategory, setActiveCategory] = useState(initial);
  return (
    <>
      <FeaturedTorrent {...featuredTorrent} />
      <div className="relative -mt-24 space-y-8 pb-16">
        <TorrentRow title="免费下载" torrents={freeTorrents} />
        <TorrentRow title="本周热门" torrents={hotTorrents} />
        <TorrentRow title="VIP专享" torrents={vipTorrents} />
        <TorrentRow title="精选电影" torrents={movieTorrents} />
      </div>
    </>
  );
}
