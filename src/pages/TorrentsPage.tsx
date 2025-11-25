import { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TorrentsService, CategoriesService } from '@/api';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { TorrentCard } from '@/components/TorrentCard';
import { useDictionaryLabels } from '@/hooks/useDictionary';
import { formatSize } from '@/utils/format';

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

// 分类由接口返回

const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'seeders', label: '最多做种' },
  { value: 'completed', label: '最多完成' },
  { value: 'rating', label: '最高评分' },
];

// 数据由接口返回

export default function TorrentsPage() {
  const { getCategoryLabel } = useDictionaryLabels();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [isLoading, setIsLoading] = useState(false);
  const [apiItems, setApiItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Array<{ label: string; key?: string }>>([]);

  const getcategory = (label?: string) => {
    if (!label || label === '全部') return undefined;
    return categories.find((c) => c.label === label)?.key || undefined;
  };

  const mapOrderBy = (v: string) => {
    if (v === 'seeders') return 'seeders';
    if (v === 'size') return 'size';
    if (v === 'completed') return 'completedCount';
    return 'uploadedAt';
  };

  const mapOrder = (v: string) => {
    return 'DESC';
  };

  const tagBadgeColor = (key?: string) => {
    if (!key) return 'primary';
    if (key === '完结') return 'green';
    if (key === '分级') return 'red';
    return 'primary';
  };

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        // 接口重命名适配：旧方法名 torrentsControllerUserList → 新方法名 torrentsControllerListTorrentsForUser
        // 原因：后端 OpenAPI operationId 更新，为前台用户列出可展示种子列表统一命名
        // 参数保持不变（page、limit、category、orderBy、order），对应 UserListTorrentsDto
        const resp = await TorrentsService.torrentsControllerListTorrentsForUser({
          page: currentPage,
          limit: itemsPerPage,
          category: getcategory(selectedCategory),
          orderBy: mapOrderBy(sortBy) as any,
          order: mapOrder(sortBy) as any,
        });
        const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
        const data = body?.data ?? body;
        if (!isCancelled) {
          setApiItems(Array.isArray(data?.items) ? data.items : []);
          setTotal(Number(data?.total ?? 0));
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    load();
    return () => { isCancelled = true; };
  }, [currentPage, selectedCategory, sortBy, itemsPerPage, categories]);

  useEffect(() => {
    let isCancelled = false;
    const loadCategories = async () => {
      try {
        const resp = await CategoriesService.categoriesControllerListUserCategories();
        const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
        const data = body?.data ?? body;
        const items = Array.isArray(data) ? data : [];
        const mapped = items.map((c: any) => ({ label: String(c?.label ?? ''), key: String(c?.key ?? '') })).filter((c: any) => c.label);
        if (!isCancelled) {
          setCategories([{ label: '全部' }, ...mapped]);
        }
      } catch { }
    };
    loadCategories();
    return () => { isCancelled = true; };
  }, []);

  // 筛选和排序逻辑
  const filteredTorrents = apiItems.filter((torrent) => {
    if (searchQuery && !String(torrent.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });
  const totalPages = Math.ceil((total || filteredTorrents.length) / itemsPerPage);
  const displayTorrents = sortBy === 'rating'
    ? [...filteredTorrents].sort((a, b) => Number(b?.rating ?? 0) - Number(a?.rating ?? 0))
    : filteredTorrents;

  const getCoverSrc = (item: any) => {
    if (viewMode == 'list') {
      return (
        item?.ThumbCoverPath ??
        item?.cover ??
        ''
      );
    } else if (viewMode == 'grid') {
      return (
        item?.MediumCoverPath ??
        item?.cover ??
        ''
      );
    }
  };



  return (
    <div>
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 bg-[#0F171E] border-b border-gray-800 z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-2 pb-3">
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1 min-w-0 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索种子、标题、IMDb..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border-gray-700 text-white pl-11 pr-4 py-5 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500"
              />
            </div>

            {/* 排序和视图切换 */}
            <div className="flex shrink-0 gap-2">
              {/* 排序选择 */}
              <div className="relative">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full bg-gray-900 border border-gray-700 text-white pl-4 pr-8 py-1.5 rounded-md focus:border-[#00A8E1] focus:ring-[#00A8E1] cursor-pointer h-9">
                    <SelectValue placeholder="选择排序方式" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border border-gray-700">
                    <SelectGroup>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-800 focus:bg-gray-800">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* 筛选按钮 */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 px-4"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
              {/* 视图切换按钮 */}
              <div className="flex border border-gray-700 rounded-md overflow-hidden">
                <Button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'grid'
                    ? 'bg-[#00A8E1] text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'list'
                    ? 'bg-[#00A8E1] text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          {/* 分类导航 */}
          <div className="mb-0">
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((category) => (
                <Button
                  key={category.label}
                  onClick={() => setSelectedCategory(category.label)}
                  className={`px-4 py-1.5 rounded-full transition-colors ${selectedCategory === category.label
                    ? 'bg-[#00A8E1] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 结果统计 */}
          {/* <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              共找到 <span className="text-[#00A8E1]">{total}</span> 个种子
            </p>
            <p className="text-gray-500 text-sm">
              第 {currentPage} / {totalPages} 页
            </p>
          </div> */}
        </div>
      </div>

      <div className="relative z-0 max-w-[1600px] mx-auto px-4 md:px-8 py-6">


        {/* 种子列表 - 网格视图 */}
        {viewMode === 'grid' && (
          <div
            className="mb-8"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}
          >
            {displayTorrents.map((torrent) => (
              <div key={torrent.id}>
                <TorrentCard
                  id={torrent.id}
                  thumbnail={getCoverSrc(torrent)}
                  title={torrent.title}
                  subTitle={torrent.subTitle}
                  category={getCategoryLabel(torrent.category) || torrent.category}
                  size={torrent.size}
                  seeders={torrent.seeders}
                  leechers={torrent.leechers}
                  isFree={torrent.isFree}
                  isVip={torrent.isVip}
                  isHot={torrent.isHot}
                  rating={torrent.rating}
                  comments={torrent.comments}
                  doubanUrl={torrent.doubanUrl}
                />
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
                  <div className="relative w-25 h-25 flex-shrink-0 rounded overflow-hidden">
                    <ImageWithFallback
                      src={getCoverSrc(torrent)}
                      alt={torrent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 信息区 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3  mb-1">
                      <div className='flex flex-col flex-1'>
                        <h3 className="text-white flex-1 hover:text-[#00A8E1] transition-colors">
                          {torrent.title}
                        </h3>
                        <h3 className="text-white flex-1 hover:text-[#00A8E1] transition-colors">
                          {torrent.subTitle}
                        </h3>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white flex-shrink-0"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge color="blue" border="white" size="sm" className="text-xs">
                        {getCategoryLabel(torrent.category) || torrent.category}
                      </Badge>
                      {Array.isArray(torrent.tags)
                        ? torrent.tags.map((tag, idx) => (
                          <Badge key={idx} color={tagBadgeColor(tag)} border="white" size="sm" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                        : torrent.tags && (
                          <Badge outline size="sm" className="text-xs">
                            {torrent.tags}
                          </Badge>
                        )}
                      {torrent.isFree && (
                        <Badge color="green" size="sm">
                          FREE
                        </Badge>
                      )}
                      {torrent.isVip && (
                        <Badge color="yellow" size="sm">
                          VIP
                        </Badge>
                      )}
                      {torrent.isHot && (
                        <Badge color="red" size="sm">
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
                        <span>{formatSize(torrent.size)}</span>
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
                <Button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md transition-colors ${currentPage === pageNum
                    ? 'bg-[#00A8E1] text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                  {pageNum}
                </Button>
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
