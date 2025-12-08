import { useState } from 'react';
import { Seedling, AlertTriangle, TrendingDown, Clock, HardDrive, Users, Download as DownloadIcon, ArrowUpDown, Filter, Info } from 'lucide-react';

interface SeedingTorrent {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  size: string;
  seeders: number;
  leechers: number;
  uploadDate: string;
  health: number; // 健康度 0-100
  priority: 'critical' | 'high' | 'medium' | 'low';
  userSeeding: boolean; // 用户是否在做种
  userSeedingTime: string; // 用户做种时间
  uploadedSize: string; // 用户已上传大小
}

type SortOption = 'health' | 'seeders' | 'date' | 'size';
type FilterOption = 'all' | 'mySeeding' | 'notSeeding' | 'critical';

export function SeedingPage() {
  const [sortBy, setSortBy] = useState<SortOption>('health');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const mockTorrents: SeedingTorrent[] = [
    {
      id: '1',
      title: '经典老片合集 1980-1990 4K修复版',
      thumbnail: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400',
      category: '电影',
      size: '245.8 GB',
      seeders: 2,
      leechers: 15,
      uploadDate: '2023-08-15',
      health: 15,
      priority: 'critical',
      userSeeding: false,
      userSeedingTime: '-',
      uploadedSize: '0 GB',
    },
    {
      id: '2',
      title: '冷门纪录片系列 The Lost Stories 1080p',
      thumbnail: 'https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?w=400',
      category: '纪录片',
      size: '89.3 GB',
      seeders: 5,
      leechers: 8,
      uploadDate: '2024-01-20',
      health: 35,
      priority: 'high',
      userSeeding: true,
      userSeedingTime: '45天',
      uploadedSize: '156.3 GB',
    },
    {
      id: '3',
      title: '小众独立音乐合集 FLAC',
      thumbnail: 'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=400',
      category: '音乐',
      size: '12.7 GB',
      seeders: 8,
      leechers: 12,
      uploadDate: '2024-03-10',
      health: 42,
      priority: 'high',
      userSeeding: false,
      userSeedingTime: '-',
      uploadedSize: '0 GB',
    },
    {
      id: '4',
      title: '经典动画电影 宫崎骏作品集 4K',
      thumbnail: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400',
      category: '动漫',
      size: '178.5 GB',
      seeders: 12,
      leechers: 23,
      uploadDate: '2024-05-05',
      health: 58,
      priority: 'medium',
      userSeeding: true,
      userSeedingTime: '12天',
      uploadedSize: '89.2 GB',
    },
    {
      id: '5',
      title: '黑白经典电影合集 1920-1960',
      thumbnail: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=400',
      category: '电影',
      size: '156.9 GB',
      seeders: 3,
      leechers: 6,
      uploadDate: '2023-11-30',
      health: 28,
      priority: 'high',
      userSeeding: false,
      userSeedingTime: '-',
      uploadedSize: '0 GB',
    },
    {
      id: '6',
      title: '罕见演唱会录像 1970s Rock Legends',
      thumbnail: 'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=400',
      category: '音乐',
      size: '67.4 GB',
      seeders: 15,
      leechers: 18,
      uploadDate: '2024-06-18',
      health: 65,
      priority: 'medium',
      userSeeding: true,
      userSeedingTime: '8天',
      uploadedSize: '45.1 GB',
    },
    {
      id: '7',
      title: '地理探索纪录片 Planet Earth Extended',
      thumbnail: 'https://images.unsplash.com/photo-1613399421098-f943ea81f1c4?w=400',
      category: '纪录片',
      size: '198.2 GB',
      seeders: 1,
      leechers: 9,
      uploadDate: '2023-09-22',
      health: 10,
      priority: 'critical',
      userSeeding: false,
      userSeedingTime: '-',
      uploadedSize: '0 GB',
    },
    {
      id: '8',
      title: '科幻经典剧集 Twilight Zone 全集',
      thumbnail: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400',
      category: '剧集',
      size: '134.6 GB',
      seeders: 18,
      leechers: 11,
      uploadDate: '2024-07-12',
      health: 72,
      priority: 'low',
      userSeeding: false,
      userSeedingTime: '-',
      uploadedSize: '0 GB',
    },
  ];

  const getHealthColor = (health: number) => {
    if (health < 20) return 'text-red-400';
    if (health < 40) return 'text-orange-400';
    if (health < 60) return 'text-amber-400';
    return 'text-green-400';
  };

  const getHealthBg = (health: number) => {
    if (health < 20) return 'bg-red-500';
    if (health < 40) return 'bg-orange-500';
    if (health < 60) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低',
    };
    return labels[priority as keyof typeof labels];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'from-red-500/20 to-red-600/20 border-red-400/40 text-red-300',
      high: 'from-orange-500/20 to-orange-600/20 border-orange-400/40 text-orange-300',
      medium: 'from-amber-500/20 to-amber-600/20 border-amber-400/40 text-amber-300',
      low: 'from-green-500/20 to-green-600/20 border-green-400/40 text-green-300',
    };
    return colors[priority as keyof typeof colors];
  };

  const sortTorrents = (torrents: SeedingTorrent[]) => {
    return [...torrents].sort((a, b) => {
      switch (sortBy) {
        case 'health':
          return a.health - b.health;
        case 'seeders':
          return a.seeders - b.seeders;
        case 'date':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case 'size':
          return parseFloat(a.size) - parseFloat(b.size);
        default:
          return 0;
      }
    });
  };

  const filterTorrents = (torrents: SeedingTorrent[]) => {
    switch (filterBy) {
      case 'mySeeding':
        return torrents.filter(t => t.userSeeding);
      case 'notSeeding':
        return torrents.filter(t => !t.userSeeding);
      case 'critical':
        return torrents.filter(t => t.priority === 'critical' || t.priority === 'high');
      default:
        return torrents;
    }
  };

  const filteredAndSortedTorrents = sortTorrents(filterTorrents(mockTorrents));

  const stats = {
    total: mockTorrents.length,
    critical: mockTorrents.filter(t => t.priority === 'critical').length,
    mySeeding: mockTorrents.filter(t => t.userSeeding).length,
    needHelp: mockTorrents.filter(t => !t.userSeeding && (t.priority === 'critical' || t.priority === 'high')).length,
  };

  return (
    <div className="min-h-screen bg-[#0F171E] pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-amber-700/20 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Seedling className="w-8 h-8 text-amber-400" />
            <h1 className="text-amber-50">保种中心</h1>
          </div>
          <p className="text-amber-200/70">帮助保持珍贵资源的健康传播，共建优质分享环境</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <HardDrive className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-amber-300/60 text-sm">总种子数</div>
                <div className="text-amber-50">{stats.total}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600/10 to-red-700/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-red-300/60 text-sm">紧急保种</div>
                <div className="text-red-50">{stats.critical}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Seedling className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-green-300/60 text-sm">我的保种</div>
                <div className="text-green-50">{stats.mySeeding}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/10 to-orange-700/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-orange-300/60 text-sm">需要帮助</div>
                <div className="text-orange-50">{stats.needHelp}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-amber-200/80 text-sm">
              <p className="mb-2">保种是维护站点资源健康的重要方式。当种子做种人数较少时，资源可能面临失传风险。</p>
              <p>下载并长期保种这些资源，您将获得：<span className="text-amber-300">双倍上传量</span>、<span className="text-amber-300">魔力值奖励</span>以及<span className="text-amber-300">保种徽章</span>。</p>
            </div>
          </div>
        </div>

        {/* 筛选和排序 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm">筛选：</span>
            <button
              onClick={() => setFilterBy('all')}
              className={`px-3 py-1 rounded text-sm transition-all ${
                filterBy === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterBy('critical')}
              className={`px-3 py-1 rounded text-sm transition-all ${
                filterBy === 'critical'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              紧急保种
            </button>
            <button
              onClick={() => setFilterBy('mySeeding')}
              className={`px-3 py-1 rounded text-sm transition-all ${
                filterBy === 'mySeeding'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              我的保种
            </button>
            <button
              onClick={() => setFilterBy('notSeeding')}
              className={`px-3 py-1 rounded text-sm transition-all ${
                filterBy === 'notSeeding'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-[#0F171E]/50 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              未保种
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm">排序：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1 bg-[#0F171E] border border-amber-500/30 text-amber-300 rounded text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="health">健康度</option>
              <option value="seeders">做种人数</option>
              <option value="date">发布时间</option>
              <option value="size">文件大小</option>
            </select>
          </div>
        </div>

        {/* 种子列表 */}
        <div className="space-y-3">
          {filteredAndSortedTorrents.map((torrent) => (
            <div
              key={torrent.id}
              className="bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-4 hover:border-amber-400/40 transition-all"
            >
              <div className="flex gap-4">
                {/* 缩略图 */}
                <img
                  src={torrent.thumbnail}
                  alt={torrent.title}
                  className="w-32 h-20 object-cover rounded flex-shrink-0"
                />

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-amber-50 flex-1">{torrent.title}</h3>
                    <div className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${getPriorityColor(torrent.priority)} border`}>
                      优先级：{getPriorityLabel(torrent.priority)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-amber-400/60 mb-3">
                    <span>{torrent.category}</span>
                    <span>{torrent.size}</span>
                    <span>{torrent.uploadDate}</span>
                  </div>

                  {/* 健康度条 */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-amber-300">健康度</span>
                      <span className={`text-xs font-medium ${getHealthColor(torrent.health)}`}>
                        {torrent.health}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#0F171E]/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getHealthBg(torrent.health)} transition-all`}
                        style={{ width: `${torrent.health}%` }}
                      />
                    </div>
                  </div>

                  {/* 统计和状态 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-amber-300">{torrent.seeders}</span>
                        <span className="text-amber-400/60">做种</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DownloadIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-amber-300">{torrent.leechers}</span>
                        <span className="text-amber-400/60">下载</span>
                      </div>
                      {torrent.userSeeding && (
                        <>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-300">{torrent.userSeedingTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingDown className="w-4 h-4 text-amber-400 rotate-180" />
                            <span className="text-amber-300">{torrent.uploadedSize}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {torrent.userSeeding ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded text-sm">
                          保种中
                        </span>
                        <button className="px-4 py-1 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 rounded text-sm transition-all">
                          查看详情
                        </button>
                      </div>
                    ) : (
                      <button className="px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded text-sm transition-all">
                        立即保种
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedTorrents.length === 0 && (
          <div className="text-center py-12">
            <Seedling className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
            <p className="text-amber-300/50">暂无符合条件的种子</p>
          </div>
        )}
      </div>
    </div>
  );
}
