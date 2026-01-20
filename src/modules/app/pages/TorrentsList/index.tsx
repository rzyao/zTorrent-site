import { useState, useEffect } from "react";
import { useTorrentDownload } from "@/modules/app/hooks/useTorrentDownload";
import { Toolbar } from "@/modules/app/pages/TorrentsList/components/Toolbar";
import { GridView } from "@/modules/app/pages/TorrentsList/components/GridView";
import { ListView } from "@/modules/app/pages/TorrentsList/components/ListView";
import { PaginationBar } from "@/modules/app/pages/TorrentsList/components/PaginationBar";
import { useTorrentsList } from "@/modules/app/pages/TorrentsList/hooks/useTorrentsList";
import { useDownloaders } from "@/modules/app/context/DownloadersContext";
import { DownloadToDownloaderModal } from "@/modules/app/components/DownloadToDownloaderModal";
import type { Torrent, ViewMode } from "@/modules/app/pages/TorrentsList/types";
import { usePreferenceStore } from "@/modules/app/stores/preferenceStore";
import { TorrentGridSkeleton } from "@/modules/app/components/skeletons/TorrentGridSkeleton";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useLanguage } from "@/hooks/useLanguage";
import { useDownloadStatusStore } from "@/modules/app/stores/downloadStatusStore";

/**
 * TorrentsPage（容器组件）
 * - 只负责组合子组件与 hook，不承载业务逻辑
 * - 保持原有功能与UI行为一致：下载、分类词典、搜索过滤、排序、分页
 */
export default function TorrentsPage() {
  const { t } = useLanguage();
  useDynamicTitle(t('torrents.title'));
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
    handleSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    getCategoryLabel,
    isLoading, // 解构出 isLoading
  } = useTorrentsList();

  // 视图模式与筛选开关为纯UI状态（不进入业务hook）
  const { viewMode, setViewMode } = usePreferenceStore();
  // 本地状态用于立即响应 UI 切换，避免 store 更新带来的微小延迟
  const [localViewMode, setLocalViewMode] = useState<ViewMode>(viewMode);

  const [showFilters, setShowFilters] = useState<boolean>(false);

  // 同步 store 状态到本地（处理初始化或外部变更）
  useEffect(() => {
    setLocalViewMode(viewMode);
  }, [viewMode]);

  const handleViewModeChange = (mode: ViewMode) => {
    setLocalViewMode(mode);
    setViewMode(mode);
  };

  // 下载能力（保持与旧页面一致的回调签名）
  const { downloadByTorrentId } = useTorrentDownload({
    onInfo: (m) => console.info(m),
    onError: (m) => alert(m),
  });

  // 下载器全局状态
  const { downloaders } = useDownloaders();

  // 下载弹窗状态
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedTorrent, setSelectedTorrent] = useState<{
    id: string;
    title: string;
  } | null>(null);
  // 下载状态管理 Store
  const setDownloadStatus = useDownloadStatusStore((state) => state.setStatus);

  /**
   * 处理下载按钮点击
   * - 有下载器：打开弹窗选择（状态由弹窗组件管理）
   * - 无下载器：直接下载种子文件（状态在此处管理）
   */
  const handleDownload = async (id: string, title: string) => {
    if (downloaders.length > 0) {
      // 弹窗模式：打开弹窗，状态由弹窗组件管理
      setSelectedTorrent({ id, title });
      setDownloadModalOpen(true);
    } else {
      // 直接下载模式：在此处管理状态
      setDownloadStatus(id, "loading");
      try {
        await downloadByTorrentId(id, title);
        setDownloadStatus(id, "success");
      } catch {
        setDownloadStatus(id, "idle");
      }
    }
  };

  // 封面渲染改为统一附件组件，移除旧字段选择逻辑

  return (
    <div>
      {/* 顶部工具栏 */}
      <Toolbar
        className="md:px-12"
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        onSearch={handleSearch}
        viewMode={localViewMode}
        onChangeViewMode={handleViewModeChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((v) => !v)}
      />

      {/* 列表区 */}
      <div className="relative z-0 mx-auto max-w-[1600px] px-4 py-6 md:px-16">
        {isLoading ? (
          <div className="py-2">
            <TorrentGridSkeleton count={24} />
          </div>
        ) : (
          <>
            {localViewMode === "grid" && (
              <GridView
                items={displayTorrents}
                getCategoryLabel={getCategoryLabel}
                onDownload={handleDownload}
              />
            )}
            {localViewMode === "list" && (
              <ListView
                items={displayTorrents}
                getCategoryLabel={getCategoryLabel}
                onDownload={handleDownload}
              />
            )}
          </>
        )}

        {/* 分页 */}
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      </div>

      {/* 下载弹窗 */}
      {selectedTorrent && (
        <DownloadToDownloaderModal
          open={downloadModalOpen}
          onClose={() => {
            setDownloadModalOpen(false);
            setSelectedTorrent(null);
          }}
          torrentId={selectedTorrent.id}
          torrentTitle={selectedTorrent.title}
        />
      )}
    </div>
  );
}
