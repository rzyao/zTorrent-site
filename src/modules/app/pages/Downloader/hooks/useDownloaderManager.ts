// 下载器页面 - 业务逻辑自定义 Hook
// 说明：集中管理状态与事件处理，UI 组件仅负责渲染。这样做到关注点分离、易于测试与维护。

import { useState, useEffect, useCallback } from 'react';
import { Downloader, DownloaderForm, DownloadPath, DownloaderType } from '../types';
import { DownloadersService } from '../../../api/services/DownloadersService';
import { CreateDownloaderDto } from '../../../api/models/CreateDownloaderDto';
import { UpdateDownloaderDto } from '../../../api/models/UpdateDownloaderDto';

export function useDownloaderManager() {
  // 下载器列表数据源
  const [downloaders, setDownloaders] = useState<Downloader[]>([]);
  const [loading, setLoading] = useState(false);

  // 弹窗相关状态
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 当前选中的下载器（用于编辑/详情）
  const [selectedDownloader, setSelectedDownloader] = useState<Downloader | null>(null);

  // 表单与辅助状态（与 UI 表单组件解耦）
  const [formData, setFormData] = useState<DownloaderForm>({
    name: '',
    type: 'qBittorrent',
    host: '',
    port: 8080,
    username: '',
    password: '',
    ssl: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // 详情面板展开与拉取状态
  const [expandedTags, setExpandedTags] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState(false);
  const [fetchingTags, setFetchingTags] = useState(false);
  const [fetchingPaths, setFetchingPaths] = useState(false);

  // 加载下载器列表
  const fetchDownloaders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await DownloadersService.downloadersControllerList();
      if (res.data) {
        // 类型适配：API 返回的 status 是 string，前端是联合类型，这里直接断言
        setDownloaders(res.data as unknown as Downloader[]);
      }
    } catch (error) {
      console.error('Failed to fetch downloaders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchDownloaders();
  }, [fetchDownloaders]);

  // 添加下载器
  const handleAddDownloader = async () => {
    try {
      const dto: CreateDownloaderDto = {
        ...formData,
        ssl: Boolean(formData.ssl),
        // @ts-ignore: Enum compatibility
        type: formData.type,
      };
      await DownloadersService.downloadersControllerCreate(dto);
      await fetchDownloaders();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create downloader:', error);
      alert('添加失败，请检查输入或重试');
    }
  };

  // 编辑下载器
  const handleEditDownloader = async () => {
    if (!selectedDownloader) return;
    try {
      const dto: UpdateDownloaderDto = {
        id: selectedDownloader.id,
        ...formData,
        ssl: Boolean(formData.ssl),
        // @ts-ignore: Enum compatibility
        type: formData.type,
      };
      await DownloadersService.downloadersControllerUpdate(dto);
      await fetchDownloaders();
      setShowEditModal(false);
      setSelectedDownloader(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update downloader:', error);
      alert('更新失败，请重试');
    }
  };

  // 删除下载器
  const handleDeleteDownloader = async (id: string) => {
    try {
      await DownloadersService.downloadersControllerDelete({ id });
      // 乐观更新或重新拉取
      setDownloaders(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Failed to delete downloader:', error);
      alert('删除失败，请重试');
      // 如果失败，最好重新拉取一次以保持同步
      fetchDownloaders();
    }
  };

  // 测试连接
  const handleTestConnection = async (id: string) => {
    try {
      const res = await DownloadersService.downloadersControllerTest({ id });
      if (res.data) {
        const updated = res.data as unknown as Downloader;
        setDownloaders(prev => prev.map(d => (d.id === id ? updated : d)));
        // 如果当前正好选中了这个下载器（例如在详情页），也更新选中状态
        if (selectedDownloader?.id === id) {
          setSelectedDownloader(updated);
        }
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      // 可以更新状态为 error
      setDownloaders(prev => prev.map(d => (d.id === id ? { ...d, status: 'error' } : d)));
    }
  };

  // 打开详情弹窗（按需获取信息）
  const handleFetchInfo = (downloader: Downloader) => {
    setSelectedDownloader(downloader);
    setShowDetailModal(true);
    // 打开时可以重置展开状态
    setExpandedTags(false);
    setExpandedPaths(false);
  };

  // 获取标签（Tag）
  const handleFetchTags = async () => {
    if (!selectedDownloader) return;
    try {
      setFetchingTags(true);
      const res = await DownloadersService.downloadersControllerTags({ id: selectedDownloader.id });
      if (res.data) {
        const tags = res.data;
        const updatedDownloader = { ...selectedDownloader, tags };

        setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? updatedDownloader : d)));
        setSelectedDownloader(updatedDownloader);
        setExpandedTags(true);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setFetchingTags(false);
    }
  };

  // 获取下载路径
  const handleFetchPaths = async () => {
    if (!selectedDownloader) return;
    try {
      setFetchingPaths(true);
      const res = await DownloadersService.downloadersControllerPaths({ id: selectedDownloader.id });
      if (res.data) {
        const paths = res.data as DownloadPath[];
        const updatedDownloader = { ...selectedDownloader, downloadPaths: paths };

        setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? updatedDownloader : d)));
        setSelectedDownloader(updatedDownloader);
        setExpandedPaths(true);
      }
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    } finally {
      setFetchingPaths(false);
    }
  };

  // 删除标签（基于索引）
  const handleDeleteTag = async (tagIndex: number) => {
    if (!selectedDownloader || !selectedDownloader.tags) return;

    try {
      // 通过索引删除标签
      await DownloadersService.downloadersControllerDeleteTag({
        id: selectedDownloader.id,
        index: tagIndex
      });

      // 成功后手动更新本地状态
      const updatedTags = selectedDownloader.tags.filter((_, i) => i !== tagIndex);
      const updatedDownloader = { ...selectedDownloader, tags: updatedTags };

      setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? updatedDownloader : d)));
      setSelectedDownloader(updatedDownloader);

    } catch (error) {
      console.error('Failed to delete tag:', error);
      alert('删除标签失败');
    }
  };

  // 删除下载路径（基于索引）
  const handleDeletePath = async (pathIndex: number) => {
    if (!selectedDownloader || !selectedDownloader.downloadPaths) return;

    try {
      await DownloadersService.downloadersControllerDeletePath({
        id: selectedDownloader.id,
        index: pathIndex
      });

      const updatedPaths = selectedDownloader.downloadPaths.filter((_, i) => i !== pathIndex);
      const updatedDownloader = { ...selectedDownloader, downloadPaths: updatedPaths };

      setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? updatedDownloader : d)));
      setSelectedDownloader(updatedDownloader);

    } catch (error) {
      console.error('Failed to delete path:', error);
      alert('删除路径失败');
    }
  };

  // 重置表单数据（用于关闭弹窗后清理状态）
  const resetForm = () => {
    setFormData({ name: '', type: 'qBittorrent', host: '', port: 8080, username: '', password: '', ssl: false });
    setShowPassword(false);
  };

  // 打开编辑弹窗并回填表单
  const openEditModal = (downloader: Downloader) => {
    setSelectedDownloader(downloader);
    setFormData({
      name: downloader.name,
      type: downloader.type,
      host: downloader.host,
      port: downloader.port,
      username: downloader.username,
      password: downloader.password,
      ssl: downloader.ssl ?? false,
    });
    setShowEditModal(true);
  };

  return {
    // 数据与选择
    downloaders,
    selectedDownloader,
    setSelectedDownloader,
    loading,

    // 弹窗控制
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showDetailModal,
    setShowDetailModal,

    // 表单控制
    formData,
    setFormData,
    showPassword,
    setShowPassword,

    // 详情展开与加载状态
    expandedTags,
    setExpandedTags,
    expandedPaths,
    setExpandedPaths,
    fetchingTags,
    setFetchingTags,
    fetchingPaths,
    setFetchingPaths,

    // 事件处理
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
    fetchDownloaders,
  } as const;
}
