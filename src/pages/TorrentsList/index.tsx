import { useState } from 'react';
import { useTorrentDownload } from '@/utils/useTorrentDownload';
import { Toolbar } from '@/pages/TorrentsList/components/Toolbar';
import { GridView } from '@/pages/TorrentsList/components/GridView';
import { ListView } from '@/pages/TorrentsList/components/ListView';
import { PaginationBar } from '@/pages/TorrentsList/components/PaginationBar';
import { useTorrentsList } from '@/pages/TorrentsList/hooks/useTorrentsList';
import type { Torrent, ViewMode } from '@/pages/TorrentsList/types';

/**
 * TorrentsPage（容器组件）
 * - 只负责组合子组件与 hook，不承载业务逻辑
 * - 保持原有功能与UI行为一致：下载、分类词典、搜索过滤、排序、分页
 */
export default function TorrentsPage() {
  // 业务状态与派生数据由 hook 管理
  const {
    displayTorrents,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    getCategoryLabel,
  } = useTorrentsList();

  // 视图模式与筛选开关为纯UI状态（不进入业务hook）
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // 下载能力（保持与旧页面一致的回调签名）
  const { downloadByTorrentId } = useTorrentDownload({
    onInfo: (m) => console.info(m),
    onError: (m) => alert(m),
  });

  /**
   * 保留原页面的封面选择逻辑：根据视图模式选择不同尺寸
   * - list：优先 `ThumbCoverPath`
   * - grid：优先 `MediumCoverPath`
   * - 回退：`cover` 或空字符串
   */
  const getCoverSrc = (item: Torrent) => {
    if (viewMode === 'list') {
      return item?.ThumbCoverPath ?? item?.cover ?? '';
    } else {
      return item?.MediumCoverPath ?? item?.cover ?? '';
    }
  };

  return (
    <div>
      {/* 顶部工具栏 */}
      <Toolbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((v) => !v)}
      />

      {/* 列表区 */}
      <div className="relative z-0 max-w-[1600px] mx-auto px-4 md:px-8 py-6">
        {viewMode === 'grid' && (
          <GridView items={displayTorrents} getCategoryLabel={getCategoryLabel} onDownload={downloadByTorrentId} getCoverSrc={getCoverSrc} />
        )}
        {viewMode === 'list' && (
          <ListView items={displayTorrents} getCategoryLabel={getCategoryLabel} onDownload={downloadByTorrentId} getCoverSrc={getCoverSrc} />
        )}

        {/* 分页 */}
        <PaginationBar currentPage={currentPage} totalPages={totalPages} onChangePage={setCurrentPage} />
      </div>
    </div>
  );
}
