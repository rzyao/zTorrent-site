import { useState } from "react";
import type { DeadTorrent, TabType } from "./types";
import { useDeadTorrents } from "./hooks/useDeadTorrents";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { WarningAlert } from "./components/WarningAlert";
import { StatsCards } from "./components/StatsCards";
import { Toolbar } from "./components/Toolbar";
import { DeadTorrentsList } from "./components/DeadTorrentsList";

export function DeadTorrentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("hall");
  const [sortBy, setSortBy] = useState<"time" | "bounty" | "ratio">("bounty");

  // 断种大厅数据 - 所有断种的种子
  const hallTorrents: DeadTorrent[] = [
    {
      id: "1",
      title: "星际穿越 Interstellar (2014) 4K UHD BluRay HEVC",
      size: "96.5 GB",
      uploaded: "289.5 GB",
      downloaded: "145.2 GB",
      ratio: 1.99,
      deadTime: "15天8小时",
      potentialBonus: 75.0,
      lastSeedTime: "2024-11-23 14:30",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
      category: "电影",
      reason: "所有做种者都已停止",
      publisher: "MovieMaster",
      bounty: 2580.0, // 下载者悬赏的总金币
      bountyCount: 23, // 23个下载者悬赏
    },
    {
      id: "2",
      title: "盗梦空间 Inception (2010) 4K BluRay REMUX",
      size: "82.3 GB",
      uploaded: "164.6 GB",
      downloaded: "82.3 GB",
      ratio: 2.0,
      deadTime: "8天12小时",
      potentialBonus: 42.5,
      lastSeedTime: "2024-11-30 09:15",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
      category: "电影",
      reason: "所有做种者都已停止",
      publisher: "CinemaFan",
      bounty: 1850.0,
      bountyCount: 18,
    },
    {
      id: "3",
      title: "黑客帝国 The Matrix (1999) 4K HDR",
      size: "68.4 GB",
      uploaded: "136.8 GB",
      downloaded: "68.4 GB",
      ratio: 2.0,
      deadTime: "22天3小时",
      potentialBonus: 110.0,
      lastSeedTime: "2024-11-16 18:45",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop",
      category: "电影",
      reason: "所有做种者都已停止",
      publisher: "SciFiLover",
      bounty: 3200.0,
      bountyCount: 31,
    },
    {
      id: "4",
      title: "阿凡达：水之道 Avatar: The Way of Water (2022) 4K",
      size: "112.8 GB",
      uploaded: "225.6 GB",
      downloaded: "112.8 GB",
      ratio: 2.0,
      deadTime: "5天6小时",
      potentialBonus: 26.5,
      lastSeedTime: "2024-12-03 11:20",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
      category: "电影",
      reason: "所有做种者都已停止",
      publisher: "Avatar3D",
      bounty: 1560.0,
      bountyCount: 15,
    },
    {
      id: "5",
      title: "银翼杀手2049 Blade Runner 2049 (2017) 4K HEVC",
      size: "88.4 GB",
      uploaded: "44.2 GB",
      downloaded: "88.4 GB",
      ratio: 0.5,
      deadTime: "28天14小时",
      potentialBonus: 140.0,
      lastSeedTime: "2024-11-10 16:45",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
      category: "电影",
      reason: "所有做种者都已停止",
      publisher: "BladeRunner",
      bounty: 4120.0,
      bountyCount: 38,
    },
  ];

  // 我发布的断种数据
  const myPublishedTorrents: DeadTorrent[] = [
    {
      id: "101",
      title: "教父三部曲 The Godfather Trilogy (1972-1990) 4K Collection",
      size: "145.6 GB",
      uploaded: "1.2 TB",
      downloaded: "456.8 GB",
      ratio: 2.63,
      deadTime: "12天6小时",
      potentialBonus: 60.0,
      lastSeedTime: "2024-11-26 10:20",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop",
      category: "电影",
      reason: "硬盘故障",
      publisher: "MovieFan",
      bounty: 2890.0,
      bountyCount: 27,
    },
    {
      id: "102",
      title: "指环王三部曲 The Lord of the Rings Extended (2001-2003) 4K",
      size: "198.3 GB",
      uploaded: "892.4 GB",
      downloaded: "298.5 GB",
      ratio: 2.99,
      deadTime: "6天18小时",
      potentialBonus: 33.0,
      lastSeedTime: "2024-12-01 15:40",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1606603696914-1d77f6f004ce?w=300&h=450&fit=crop",
      category: "电影",
      reason: "服务器维护",
      publisher: "MovieFan",
      bounty: 3560.0,
      bountyCount: 34,
    },
  ];

  // 我下载的断种数据
  const myDownloadedTorrents: DeadTorrent[] = [
    {
      id: "201",
      title: "星际穿越 Interstellar (2014) 4K UHD BluRay HEVC",
      size: "96.5 GB",
      uploaded: "289.5 GB",
      downloaded: "96.5 GB",
      ratio: 3.0,
      deadTime: "15天8小时",
      potentialBonus: 75.0,
      lastSeedTime: "2024-11-23 14:30",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
      category: "电影",
      reason: "硬盘空间不足",
      publisher: "MovieMaster",
      bounty: 2580.0,
      bountyCount: 23,
    },
    {
      id: "202",
      title: "黑客帝国 The Matrix (1999) 4K HDR",
      size: "68.4 GB",
      uploaded: "205.2 GB",
      downloaded: "68.4 GB",
      ratio: 3.0,
      deadTime: "22天3小时",
      potentialBonus: 110.0,
      lastSeedTime: "2024-11-16 18:45",
      seeders: 0,
      poster:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop",
      category: "电影",
      reason: "客户端关闭",
      publisher: "SciFiLover",
      bounty: 3200.0,
      bountyCount: 31,
    },
  ];

  const { list: currentTorrents, stats } = useDeadTorrents(
    hallTorrents,
    myPublishedTorrents,
    myDownloadedTorrents,
    activeTab,
    sortBy
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950 ">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <Header />
        <Tabs activeTab={activeTab} onChange={setActiveTab} />
        <WarningAlert activeTab={activeTab} stats={stats} />
        <StatsCards activeTab={activeTab} stats={stats} />
        <Toolbar
          activeTab={activeTab}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <DeadTorrentsList list={currentTorrents} activeTab={activeTab} />
      </div>
    </div>
  );
}
