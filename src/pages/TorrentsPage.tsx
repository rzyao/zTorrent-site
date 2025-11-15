import { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Download,
  Upload,
  Star,
  MessageSquare,
  HardDrive,
  Calendar,
  ChevronDown,
  Grid3x3,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/assets/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';

interface Torrent {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  size: string;
  seeders: number;
  leechers: number;
  completed: number;
  uploader: string;
  uploadDate: string;
  isFree?: boolean;
  isVip?: boolean;
  isHot?: boolean;
  rating?: number;
  comments: number;
}

const categories = [
  { name: '全部', count: 2849 },
  { name: '电影', count: 856 },
  { name: '电视剧', count: 623 },
  { name: '纪录片', count: 218 },
  { name: '动漫', count: 342 },
  { name: '音乐', count: 189 },
  { name: '游戏', count: 156 },
  { name: '软件', count: 98 },
  { name: '电子书', count: 245 },
];

const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'seeders', label: '做种数' },
  { value: 'size', label: '文件大小' },
  { value: 'completed', label: '完成数' },
  { value: 'rating', label: '评分' },
];

const mockTorrents: Torrent[] = [
  {
    id: 1,
    title: '星际穿越 Interstellar (2014) 4K HDR REMUX 国英双语 中英字幕 BluRay',
    category: '电影',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400',
    size: '68.5 GB',
    seeders: 2847,
    leechers: 156,
    completed: 8542,
    uploader: 'MovieMaster',
    uploadDate: '2024-11-10',
    isFree: true,
    isHot: true,
    rating: 9.8,
    comments: 234,
  },
  {
    id: 2,
    title: '权力的游戏 Game of Thrones (2011-2019) 全八季 1080p BluRay x265',
    category: '剧集',
    thumbnail: 'https://images.unsplash.com/photo-1710429112585-68a9c850a8a3?w=400',
    size: '124.8 GB',
    seeders: 2156,
    leechers: 89,
    completed: 12547,
    uploader: 'TVLover',
    uploadDate: '2024-11-09',
    isVip: true,
    isHot: true,
    rating: 9.5,
    comments: 567,
  },
  {
    id: 3,
    title: '蝙蝠侠：黑暗骑士 The Dark Knight (2008) IMAX版 4K UHD BluRay',
    category: '电影',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400',
    size: '87.2 GB',
    seeders: 1923,
    leechers: 234,
    completed: 6789,
    uploader: 'HDMaster',
    uploadDate: '2024-11-08',
    isFree: true,
    rating: 9.7,
    comments: 189,
  },
  {
    id: 4,
    title: 'Pink Floyd - The Dark Side of the Moon (2023 Remaster) FLAC 24bit/192kHz',
    category: '音乐',
    thumbnail: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?w=400',
    size: '3.8 GB',
    seeders: 1687,
    leechers: 45,
    completed: 4521,
    uploader: 'AudioPhile',
    uploadDate: '2024-11-08',
    isFree: true,
    rating: 9.9,
    comments: 78,
  },
  {
    id: 5,
    title: '蓝色星球III Planet Earth III (2024) 4K HDR 全集 国英双语 中英字幕',
    category: '纪录片',
    thumbnail: 'https://images.unsplash.com/photo-1759521528494-fd6ceb6049e3?w=400',
    size: '156.3 GB',
    seeders: 1542,
    leechers: 312,
    completed: 3456,
    uploader: 'NatureDoc',
    uploadDate: '2024-11-07',
    isVip: true,
    isHot: true,
    rating: 9.6,
    comments: 145,
  },
  {
    id: 6,
    title: '肖申克的救赎 The Shawshank Redemption (1994) 4K UHD 修复版',
    category: '电影',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400',
    size: '72.1 GB',
    seeders: 1398,
    leechers: 67,
    completed: 9876,
    uploader: 'ClassicFilm',
    uploadDate: '2024-11-07',
    isFree: true,
    rating: 9.8,
    comments: 423,
  },
  {
    id: 7,
    title: '瑞克和莫蒂 Rick and Morty S07 (2024) 1080p WEB-DL 中英字幕',
    category: '动漫',
    thumbnail: 'https://images.unsplash.com/photo-1710429112585-68a9c850a8a3?w=400',
    size: '18.9 GB',
    seeders: 1245,
    leechers: 298,
    completed: 2341,
    uploader: 'AnimeFan',
    uploadDate: '2024-11-06',
    isHot: true,
    rating: 9.4,
    comments: 267,
  },
  {
    id: 8,
    title: 'Adobe Creative Cloud 2024 完整套装 (Win/Mac) 完美破解版',
    category: '软件',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400',
    size: '24.5 GB',
    seeders: 1156,
    leechers: 445,
    completed: 5678,
    uploader: 'SoftwareKing',
    uploadDate: '2024-11-06',
    isVip: true,
    rating: 8.9,
    comments: 89,
  },
];

export default function TorrentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 筛选和排序逻辑
  const filteredTorrents = mockTorrents.filter((torrent) => {
    if (selectedCategory !== '全部' && torrent.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !torrent.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredTorrents.length / itemsPerPage);
  const displayTorrents = filteredTorrents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 bg-[#0F171E] border-b border-gray-800 z-30">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索种子、标题、IMDb..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border-gray-700 text-white pl-11 pr-4 py-6 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500"
              />
            </div>

            {/* 排序和视图切换 */}
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-900 border border-gray-700 text-white pl-4 pr-10 py-3 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 px-4"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>

              <div className="flex border border-gray-700 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'grid'
                    ? 'bg-[#00A8E1] text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'list'
                    ? 'bg-[#00A8E1] text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
        {/* 分类导航 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h2 className="text-white">分类筛选</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category.name
                  ? 'bg-[#00A8E1] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 结果统计 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            共找到 <span className="text-[#00A8E1]">{filteredTorrents.length}</span> 个种子
          </p>
          <p className="text-gray-500 text-sm">
            第 {currentPage} / {totalPages} 页
          </p>
        </div>

        {/* 种子列表 - 网格视图 */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {displayTorrents.map((torrent) => (
              <div
                key={torrent.id}
                className="group bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-[#00A8E1] transition-all duration-300 cursor-pointer"
              >
                {/* 缩略图 */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <ImageWithFallback
                    src={torrent.thumbnail}
                    alt={torrent.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* 标签 */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-gray-800/90 text-white text-xs px-2 py-1">
                      {torrent.category}
                    </Badge>
                    {torrent.isFree && (
                      <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                        FREE
                      </Badge>
                    )}
                    {torrent.isVip && (
                      <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">
                        VIP
                      </Badge>
                    )}
                    {torrent.isHot && (
                      <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                        HOT
                      </Badge>
                    )}
                  </div>

                  {/* 悬停信息 */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <Upload className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">{torrent.seeders}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">{torrent.leechers}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white px-6"
                    >
                      下载
                    </Button>
                  </div>
                </div>

                {/* 信息区 */}
                <div className="p-3">
                  <h3 className="text-white text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#00A8E1] transition-colors">
                    {torrent.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1 text-gray-400">
                      <HardDrive className="w-3 h-3" />
                      <span>{torrent.size}</span>
                    </div>
                    {torrent.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400">{torrent.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Upload className="w-3 h-3 text-green-400" />
                      <span>{torrent.seeders}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-red-400" />
                      <span>{torrent.leechers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{torrent.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 种子列表 - 列表视图 */}
        {viewMode === 'list' && (
          <div className="space-y-4 mb-8">
            {displayTorrents.map((torrent) => (
              <div
                key={torrent.id}
                className="bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#00A8E1] transition-all duration-300 cursor-pointer p-4"
              >
                <div className="flex gap-4">
                  {/* 缩略图 */}
                  <div className="relative w-24 h-36 flex-shrink-0 rounded overflow-hidden">
                    <ImageWithFallback
                      src={torrent.thumbnail}
                      alt={torrent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 信息区 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-white flex-1 hover:text-[#00A8E1] transition-colors">
                        {torrent.title}
                      </h3>
                      <Button
                        size="sm"
                        className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white flex-shrink-0"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className="bg-gray-800 text-white text-xs">
                        {torrent.category}
                      </Badge>
                      {torrent.isFree && (
                        <Badge className="bg-green-500 text-white text-xs">
                          FREE
                        </Badge>
                      )}
                      {torrent.isVip && (
                        <Badge className="bg-yellow-500 text-white text-xs">
                          VIP
                        </Badge>
                      )}
                      {torrent.isHot && (
                        <Badge className="bg-red-500 text-white text-xs">
                          HOT
                        </Badge>
                      )}
                      {torrent.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-yellow-400 text-xs">{torrent.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-4 h-4" />
                        <span>{torrent.size}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Upload className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">{torrent.seeders} 做种</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">{torrent.leechers} 下载</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{torrent.completed} 完成</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{torrent.comments} 评论</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{torrent.uploadDate}</span>
                      </div>
                      <div>
                        <span className="text-[#00A8E1]">{torrent.uploader}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md transition-colors ${currentPage === pageNum
                    ? 'bg-[#00A8E1] text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}
