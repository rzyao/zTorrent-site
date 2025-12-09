import { useState } from 'react';
import {
  HardDrive,
  TrendingUp,
  Download,
  Upload,
  Clock,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
} from 'lucide-react';

interface Torrent {
  id: string;
  title: string;
  size: string;
  uploaded: string;
  downloaded: string;
  ratio: number;
  seedTime: string;
  bonus: number; // 额外奖励金币
  seeders: number;
  leechers: number;
  status: 'normal' | 'warning' | 'good';
  poster: string;
  category: string;
}

export function SeedingPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'bonus' | 'ratio' | 'time'>('bonus');

  // 模拟数据
  const mockTorrents: Torrent[] = [
    {
      id: '1',
      title: '沙丘2 Dune: Part Two (2024) 4K UHD BluRay HEVC',
      size: '85.6 GB',
      uploaded: '156.8 GB',
      downloaded: '23.5 GB',
      ratio: 6.67,
      seedTime: '32天15小时',
      bonus: 156.8, // 每天5金币
      seeders: 45,
      leechers: 12,
      status: 'good',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      category: '电影',
    },
    {
      id: '2',
      title: '奥本海默 Oppenheimer (2023) 4K UHD BluRay REMUX',
      size: '92.3 GB',
      uploaded: '423.6 GB',
      downloaded: '128.4 GB',
      ratio: 3.30,
      seedTime: '65天8小时',
      bonus: 325.5,
      seeders: 89,
      leechers: 34,
      status: 'good',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
      category: '电影',
    },
    {
      id: '3',
      title: '瞬息全宇宙 Everything Everywhere All at Once (2022) 4K HDR',
      size: '78.9 GB',
      uploaded: '78.9 GB',
      downloaded: '15.6 GB',
      ratio: 5.06,
      seedTime: '18天3小时',
      bonus: 90.0,
      seeders: 67,
      leechers: 18,
      status: 'normal',
      poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
      category: '电影',
    },
    {
      id: '4',
      title: '银翼杀手2049 Blade Runner 2049 (2017) 4K HEVC',
      size: '88.4 GB',
      uploaded: '44.2 GB',
      downloaded: '88.4 GB',
      ratio: 0.50,
      seedTime: '6天12小时',
      bonus: 32.5,
      seeders: 38,
      leechers: 5,
      status: 'warning',
      poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
      category: '电影',
    },
    {
      id: '5',
      title: '蝙蝠侠：黑暗骑士 The Dark Knight (2008) 4K REMUX',
      size: '76.2 GB',
      uploaded: '228.6 GB',
      downloaded: '45.8 GB',
      ratio: 4.99,
      seedTime: '42天6小时',
      bonus: 211.0,
      seeders: 123,
      leechers: 28,
      status: 'good',
      poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
      category: '电影',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return (
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <CheckCircle className="w-3 h-3" />
            健康
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <AlertCircle className="w-3 h-3" />
            注意
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-neutral-400 text-xs">
            <CheckCircle className="w-3 h-3" />
            正常
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">保种列表</h1>
              <p className="text-neutral-400 text-sm mt-1">
                正在做种的资源，持续做种可获得额外奖励
              </p>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">总做种数</span>
              <HardDrive className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-2xl">{mockTorrents.length}</p>
          </div>
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">累计奖励</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-white text-2xl">
              {mockTorrents.reduce((sum, t) => sum + t.bonus, 0).toFixed(1)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">平均分享率</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white text-2xl">
              {(mockTorrents.reduce((sum, t) => sum + t.ratio, 0) / mockTorrents.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">总上传量</span>
              <Upload className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-white text-2xl">1.01 TB</p>
          </div>
        </div>

        {/* 筛选和排序 */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="bonus">奖励排序</option>
              <option value="ratio">分享率排序</option>
              <option value="time">做种时间排序</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800/40 border border-neutral-700/50 rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索种子..."
              className="bg-transparent border-none outline-none text-white text-sm"
            />
          </div>
        </div>

        {/* 种子列表 */}
        <div className="space-y-4">
          {mockTorrents.map((torrent) => (
            <div
              key={torrent.id}
              className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden hover:border-green-500/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* 海报 */}
                <div className="relative w-full md:w-24 flex-shrink-0">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={torrent.poster}
                      alt={torrent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 信息区域 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white line-clamp-1 mb-1">{torrent.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span>{torrent.category}</span>
                        <span>•</span>
                        <span>{torrent.size}</span>
                        <span>•</span>
                        {getStatusBadge(torrent.status)}
                      </div>
                    </div>
                  </div>

                  {/* 统计数据 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Upload className="w-3.5 h-3.5 text-green-400" />
                      <div>
                        <p className="text-neutral-500">上传</p>
                        <p className="text-white">{torrent.uploaded}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Download className="w-3.5 h-3.5 text-red-400" />
                      <div>
                        <p className="text-neutral-500">下载</p>
                        <p className="text-white">{torrent.downloaded}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      <div>
                        <p className="text-neutral-500">分享率</p>
                        <p className={`${torrent.ratio >= 1 ? 'text-green-400' : 'text-amber-400'}`}>
                          {torrent.ratio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <div>
                        <p className="text-neutral-500">做种时长</p>
                        <p className="text-white">{torrent.seedTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* 做种人数 */}
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-neutral-400">
                      做种: <span className="text-green-400">{torrent.seeders}</span>
                    </span>
                    <span className="text-neutral-400">
                      下载: <span className="text-amber-400">{torrent.leechers}</span>
                    </span>
                  </div>
                </div>

                {/* 奖励显示 */}
                <div className="flex flex-col items-center justify-center md:w-32 flex-shrink-0 p-4 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="text-2xl text-amber-400">{torrent.bonus.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-neutral-400 text-center">额外奖励</p>
                  <p className="text-xs text-amber-400/70 mt-1">+5.0/天</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockTorrents.length === 0 && (
          <div className="text-center py-16">
            <HardDrive className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">暂无做种记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
