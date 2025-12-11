// 下载器页面（容器组件）
// 说明：组合拆分后的 UI 组件与业务 Hook，负责页面布局与数据流的串联。

import { useDownloaderManager } from './hooks/useDownloaderManager';
import { Downloader } from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { DownloaderCard } from './components/DownloaderCard';
import { EmptyState } from './components/EmptyState';
import { AddDownloaderModal } from './components/AddDownloaderModal';
import { EditDownloaderModal } from './components/EditDownloaderModal';
import { DownloaderDetailModal } from './components/DownloaderDetailModal';

export function DownloaderPage() {
  // 通过自定义 Hook 管理业务状态与事件，UI 层只进行渲染
  const {
    downloaders,
    selectedDownloader,
    setSelectedDownloader,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showDetailModal,
    setShowDetailModal,
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    expandedTags,
    setExpandedTags,
    expandedPaths,
    setExpandedPaths,
    fetchingTags,
    fetchingPaths,
    handleAddDownloader,
    handleEditDownloader,
    handleDeleteDownloader,
    handleTestConnection,
    handleFetchInfo,
    handleFetchTags,
    handleFetchPaths,
    handleDeleteTag,
    handleDeletePath,
    resetForm,
    openEditModal,
  } = useDownloaderManager();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面头部 */}
        <Header onAddClick={() => setShowAddModal(true)} />

        {/* 统计卡片 */}
        <StatsCards downloaders={downloaders} />

        {/* 下载器列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {downloaders.map((downloader) => (
            <DownloaderCard
              key={downloader.id}
              downloader={downloader}
              onTestConnection={handleTestConnection}
              onFetchInfo={handleFetchInfo}
              onEdit={openEditModal}
              onDelete={(id) => {
                // 统一弹出确认由容器处理，避免在 Hook 中耦合 UI
                if (confirm('确定要删除这个下载器吗？')) handleDeleteDownloader(id);
              }}
            />
          ))}
        </div>

        {/* 空态 */}
        {downloaders.length === 0 && <EmptyState onAddClick={() => setShowAddModal(true)} />}
      </div>

      {/* 添加下载器弹窗 */}
      <AddDownloaderModal
        open={!!showAddModal}
        formData={formData}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onChangeForm={(next) => setFormData({ ...formData, ...next })}
        onSubmit={handleAddDownloader}
        onClose={() => { setShowAddModal(false); resetForm(); }}
      />

      {/* 编辑下载器弹窗 */}
      {selectedDownloader && (
        <EditDownloaderModal
          open={!!showEditModal}
          formData={formData}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onChangeForm={(next) => setFormData({ ...formData, ...next })}
          onSubmit={handleEditDownloader}
          onClose={() => { setShowEditModal(false); setSelectedDownloader(null); resetForm(); }}
        />
      )}

      {/* 下载器详情弹窗 */}
      {selectedDownloader && (
        <DownloaderDetailModal
          open={!!showDetailModal}
          downloader={selectedDownloader}
          expandedTags={expandedTags}
          expandedPaths={expandedPaths}
          fetchingTags={fetchingTags}
          fetchingPaths={fetchingPaths}
          onClose={() => { setShowDetailModal(false); setSelectedDownloader(null); setExpandedTags(false); setExpandedPaths(false); }}
          onToggleTags={() => setExpandedTags(!expandedTags)}
          onFetchTags={handleFetchTags}
          onDeleteTag={handleDeleteTag}
          onTogglePaths={() => setExpandedPaths(!expandedPaths)}
          onFetchPaths={handleFetchPaths}
          onDeletePath={handleDeletePath}
        />
      )}
    </div>
  );
}

