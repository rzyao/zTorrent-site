import { useState } from 'react';
import { Upload, Download, CheckCircle, XCircle, Clock, ArrowUpDown, Search, Filter } from 'lucide-react';

interface Torrent {
  id: number;
  name: string;
  category: string;
  size: string;
  uploaded: string;
  downloaded: string;
  ratio: number;
  seeders: number;
  leechers: number;
  progress: number;
  uploadDate: string;
  completeDate?: string;
  status: 'seeding' | 'downloading' | 'completed' | 'incomplete' | 'uploaded';
}

const mockTorrents: Torrent[] = [
  {
    id: 1,
    name: '星际穿越 4K HDR REMUX 国英双语',
    category: '电影',
    size: '68.5 GB',
    uploaded: '125.8 GB',
    downloaded: '68.5 GB',
    ratio: 1.84,
    seeders: 2847,
    leechers: 156,
    progress: 100,
    uploadDate: '2024-11-10',
    completeDate: '2024-11-10',
    status: 'uploaded',
  },
  {
    id: 2,
    name: '权力的游戏 全八季 1080p BluRay',
    category: '剧集',
    size: '124.8 GB',
    uploaded: '89.2 GB',
    downloaded: '124.8 GB',
    ratio: 0.71,
    seeders: 2156,
    leechers: 89,
    progress: 100,
    uploadDate: '2024-10-15',
    completeDate: '2024-10-20',
    status: 'seeding',
  },
  {
    id: 3,
    name: '沙丘2 IMAX 4K HDR 杜比视界',
    category: '电影',
    size: '92.3 GB',
    uploaded: '45.8 GB',
    downloaded: '92.3 GB',
    ratio: 0.50,
    seeders: 1876,
    leechers: 543,
    progress: 100,
    uploadDate: '2024-09-28',
    completeDate: '2024-09-30',
    status: 'seeding',
  },
  {
    id: 4,
    name: '碟中谍8：致命清算 4K 抢先版',
    category: '电影',
    size: '45.6 GB',
    uploaded: '12.5 GB',
    downloaded: '28.9 GB',
    ratio: 0.43,
    seeders: 987,
    leechers: 1234,
    progress: 63,
    uploadDate: '2024-12-01',
    status: 'downloading',
  },
  {
    id: 5,
    name: '教父三部曲 4K UHD 修复版',
    category: '电影',
    size: '215.6 GB',
    uploaded: '324.5 GB',
    downloaded: '215.6 GB',
    ratio: 1.51,
    seeders: 1567,
    leechers: 234,
    progress: 100,
    uploadDate: '2024-08-12',
    completeDate: '2024-08-18',
    status: 'completed',
  },
  {
    id: 6,
    name: '蝙蝠侠：黑暗骑士 IMAX 4K UHD',
    category: '电影',
    size: '87.2 GB',
    uploaded: '8.7 GB',
    downloaded: '45.2 GB',
    ratio: 0.19,
    seeders: 1923,
    leechers: 234,
    progress: 52,
    uploadDate: '2024-11-28',
    status: 'downloading',
  },
  {
    id: 7,
    name: '指环王三部曲 4K UHD 加长版',
    category: '电影',
    size: '298.5 GB',
    uploaded: '89.2 GB',
    downloaded: '298.5 GB',
    ratio: 0.30,
    seeders: 3456,
    leechers: 789,
    progress: 100,
    uploadDate: '2024-07-20',
    completeDate: '2024-07-28',
    status: 'completed',
  },
  {
    id: 8,
    name: '蓝色星球III 4K HDR 全集',
    category: '纪录片',
    size: '156.3 GB',
    uploaded: '5.8 GB',
    downloaded: '89.5 GB',
    ratio: 0.06,
    seeders: 1542,
    leechers: 312,
    progress: 57,
    uploadDate: '2024-11-25',
    status: 'incomplete',
  },
];

export function TorrentHistoryPage() {
  const [activeTab, setActiveTab] = useState<'uploaded' | 'seeding' | 'downloading' | 'completed' | 'incomplete'>('seeding');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTorrents = mockTorrents.filter(torrent => {
    const matchesTab = torrent.status === activeTab;
    const matchesSearch = torrent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      torrent.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    uploaded: mockTorrents.filter(t => t.status === 'uploaded').length,
    seeding: mockTorrents.filter(t => t.status === 'seeding').length,
    downloading: mockTorrents.filter(t => t.status === 'downloading').length,
    completed: mockTorrents.filter(t => t.status === 'completed').length,
    incomplete: mockTorrents.filter(t => t.status === 'incomplete').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'text-purple-400';
      case 'seeding':
        return 'text-green-400';
      case 'downloading':
        return 'text-blue-400';
      case 'completed':
        return 'text-amber-400';
      case 'incomplete':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Upload className="w-4 h-4" />;
      case 'seeding':
        return <ArrowUpDown className="w-4 h-4" />;
      case 'downloading':
        return <Download className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'incomplete':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploaded':
        return '已发布';
      case 'seeding':
        return '做种中';
      case 'downloading':
        return '下载中';
      case 'completed':
        return '已完成';
      case 'incomplete':
        return '未完成';
      default:
        return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F171E] pt-6 pb-12 px-4 md:px-8">
      <div className="max-w-[1920px] mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">种子记录</h1>
          <p className="text-neutral-400">查看您的种子发布、下载和做种历史记录</p>
        </div>

        {/* 标签切换 */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-1 mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('uploaded')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg transition-all ${activeTab === 'uploaded'
              ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-white border border-purple-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              <span>发布种子</span>
              <span className="ml-1 text-xs">({stats.uploaded})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('seeding')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg transition-all ${activeTab === 'seeding'
              ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 text-white border border-green-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <span>当前做种</span>
              <span className="ml-1 text-xs">({stats.seeding})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('downloading')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg transition-all ${activeTab === 'downloading'
              ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-white border border-blue-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span>当前下载</span>
              <span className="ml-1 text-xs">({stats.downloading})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg transition-all ${activeTab === 'completed'
              ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-white border border-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>完成种子</span>
              <span className="ml-1 text-xs">({stats.completed})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('incomplete')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg transition-all ${activeTab === 'incomplete'
              ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 text-white border border-red-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>未完成种子</span>
              <span className="ml-1 text-xs">({stats.incomplete})</span>
            </div>
          </button>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="搜索种子名称或分类..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <button className="px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white hover:border-amber-500/50 transition-all flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>筛选</span>
          </button>
        </div>

        {/* 种子列表 */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          {filteredTorrents.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>暂无{getStatusText(activeTab)}记录</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800/50 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">种子名称</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">分类</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">大小</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">上传量</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">下载量</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">分享率</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">进度</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">做种/下载</th>
                    <th className="px-6 py-4 text-left text-sm text-neutral-400">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredTorrents.map((torrent) => (
                    <tr key={torrent.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white hover:text-amber-400 cursor-pointer transition-colors max-w-md truncate">
                          {torrent.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          发布于 {torrent.uploadDate}
                          {torrent.completeDate && ` • 完成于 ${torrent.completeDate}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm rounded-full">
                          {torrent.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-300">{torrent.size}</td>
                      <td className="px-6 py-4 text-green-400">{torrent.uploaded}</td>
                      <td className="px-6 py-4 text-red-400">{torrent.downloaded}</td>
                      <td className="px-6 py-4">
                        <span className={torrent.ratio >= 1 ? 'text-green-400' : 'text-amber-400'}>
                          {torrent.ratio.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${torrent.progress === 100
                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                : 'bg-gradient-to-r from-amber-500 to-orange-600'
                                }`}
                              style={{ width: `${torrent.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-neutral-400 min-w-[45px]">{torrent.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-green-400">
                            <ArrowUpDown className="w-4 h-4" />
                            {torrent.seeders}
                          </div>
                          <div className="flex items-center gap-1 text-red-400">
                            <Download className="w-4 h-4" />
                            {torrent.leechers}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${getStatusColor(torrent.status)}`}>
                          {getStatusIcon(torrent.status)}
                          <span>{getStatusText(torrent.status)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
