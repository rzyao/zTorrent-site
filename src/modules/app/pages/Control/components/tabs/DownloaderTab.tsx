import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/modules/app/components/ConfirmModal";
import { useDownloaderManager } from "../../../Downloader/hooks/useDownloaderManager";
import { StatsCards } from "../../../Downloader/components/StatsCards";
import { DownloaderCard } from "../../../Downloader/components/DownloaderCard";
import { EmptyState } from "../../../Downloader/components/EmptyState";
import { AddDownloaderModal } from "../../../Downloader/components/AddDownloaderModal";
import { EditDownloaderModal } from "../../../Downloader/components/EditDownloaderModal";
import { DownloaderDetailModal } from "../../../Downloader/components/DownloaderDetailModal";
import { Button } from "@/modules/app/components/ui/button";

export function DownloaderTab() {
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

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* 头部区：标题与添加按钮 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600">
            <Download className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl text-white">下载器管理</h2>
            <p className="text-sm text-neutral-400">管理您的BT客户端连接，远程控制下载任务</p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          添加下载器
        </Button>
      </div>

      {/* 统计卡片 */}
      <StatsCards downloaders={downloaders} />

      {/* 下载器列表 */}
      {downloaders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {downloaders.map((downloader) => (
            <DownloaderCard
              key={downloader.id}
              downloader={downloader}
              onTestConnection={handleTestConnection}
              onFetchInfo={handleFetchInfo}
              onEdit={openEditModal}
              onDelete={(id) => {
                setConfirmDeleteId(id);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState onAddClick={() => setShowAddModal(true)} />
      )}

      {/* 弹窗组件保持不变 */}
      <AddDownloaderModal
        open={!!showAddModal}
        formData={formData}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onChangeForm={(next) => setFormData({ ...formData, ...next })}
        onSubmit={handleAddDownloader}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
      />

      {selectedDownloader && (
        <EditDownloaderModal
          open={!!showEditModal}
          formData={formData}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onChangeForm={(next) => setFormData({ ...formData, ...next })}
          onSubmit={handleEditDownloader}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDownloader(null);
            resetForm();
          }}
        />
      )}

      {selectedDownloader && (
        <DownloaderDetailModal
          open={!!showDetailModal}
          downloader={selectedDownloader}
          expandedTags={expandedTags}
          expandedPaths={expandedPaths}
          fetchingTags={fetchingTags}
          fetchingPaths={fetchingPaths}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedDownloader(null);
            setExpandedTags(false);
            setExpandedPaths(false);
          }}
          onToggleTags={() => setExpandedTags(!expandedTags)}
          onFetchTags={handleFetchTags}
          onDeleteTag={handleDeleteTag}
          onTogglePaths={() => setExpandedPaths(!expandedPaths)}
          onFetchPaths={handleFetchPaths}
          onDeletePath={handleDeletePath}
        />
      )}
      <ConfirmModal
        open={!!confirmDeleteId}
        onOpenChange={(v) => !v && setConfirmDeleteId(null)}
        title="删除下载器"
        description="确定要删除这个下载器吗？配置信息将丢失。"
        onConfirm={() => {
          if (confirmDeleteId) handleDeleteDownloader(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        variant="destructive"
      />
    </div>
  );
}
