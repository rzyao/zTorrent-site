// 下载器页面 - 业务逻辑自定义 Hook
// 说明：集中管理状态与事件处理，UI 组件仅负责渲染。这样做到关注点分离、易于测试与维护。

import { useState } from 'react';
import { Downloader, DownloaderForm, DownloadPath } from '../types';

export function useDownloaderManager(initialDownloaders: Downloader[]) {
  // 下载器列表数据源
  const [downloaders, setDownloaders] = useState<Downloader[]>(initialDownloaders);

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
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [fetchingPaths, setFetchingPaths] = useState(false);

  // 添加下载器
  const handleAddDownloader = () => {
    const newDownloader: Downloader = {
      id: Date.now().toString(),
      ...formData,
      status: 'disconnected',
    };
    setDownloaders(prev => [...prev, newDownloader]);
    setShowAddModal(false);
    resetForm();
  };

  // 编辑下载器
  const handleEditDownloader = () => {
    if (!selectedDownloader) return;
    setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? { ...d, ...formData } : d)));
    setShowEditModal(false);
    setSelectedDownloader(null);
    resetForm();
  };

  // 删除下载器
  const handleDeleteDownloader = (id: string) => {
    // 注意：UI 中可增加确认对话框；Hook 不做 UI 逻辑，仅提供删除方法
    setDownloaders(prev => prev.filter(d => d.id !== id));
  };

  // 测试连接（模拟：同时写入 categories 与 downloadPaths，真实项目请替换为 API 请求）
  const handleTestConnection = (id: string) => {
    const mockCategories = ['电影', '剧集', '纪录片', '动漫', '音乐', '软件'];
    const mockPaths: DownloadPath[] = [
      { name: '默认路径', path: '/downloads/torrents', freeSpace: 2.4 * 1024 * 1024 * 1024 * 1024 },
      { name: '电影专用', path: '/media/movies', freeSpace: 1.8 * 1024 * 1024 * 1024 * 1024 },
      { name: '剧集专用', path: '/media/tv-shows', freeSpace: 3.2 * 1024 * 1024 * 1024 * 1024 },
    ];
    setDownloaders(prev => prev.map(d => (
      d.id === id
        ? { ...d, status: 'connected', version: 'v4.6.2', categories: mockCategories, downloadPaths: mockPaths }
        : d
    )));
  };

  // 打开详情弹窗（按需获取信息）
  const handleFetchInfo = (downloader: Downloader) => {
    setSelectedDownloader(downloader);
    setShowDetailModal(true);
  };

  // 获取分类（模拟异步）
  const handleFetchCategories = () => {
    if (!selectedDownloader) return;
    setFetchingCategories(true);
    setTimeout(() => {
      const mockCategories = ['电影', '剧集', '纪录片', '动漫', '音乐', '软件'];
      setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? { ...d, categories: mockCategories } : d)));
      setSelectedDownloader({ ...selectedDownloader, categories: mockCategories });
      setFetchingCategories(false);
      setExpandedCategories(true);
    }, 800);
  };

  // 获取下载路径（模拟异步）
  const handleFetchPaths = () => {
    if (!selectedDownloader) return;
    setFetchingPaths(true);
    setTimeout(() => {
      const mockPaths: DownloadPath[] = [
        { name: '默认路径', path: '/downloads/torrents', freeSpace: 2.4 * 1024 * 1024 * 1024 * 1024 },
        { name: '电影专用', path: '/media/movies', freeSpace: 1.8 * 1024 * 1024 * 1024 * 1024 },
        { name: '剧集专用', path: '/media/tv-shows', freeSpace: 3.2 * 1024 * 1024 * 1024 * 1024 },
      ];
      setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? { ...d, downloadPaths: mockPaths } : d)));
      setSelectedDownloader({ ...selectedDownloader, downloadPaths: mockPaths });
      setFetchingPaths(false);
      setExpandedPaths(true);
    }, 800);
  };

  // 删除分类（基于索引）
  const handleDeleteCategory = (categoryIndex: number) => {
    if (!selectedDownloader || !selectedDownloader.categories) return;
    const updatedCategories = selectedDownloader.categories.filter((_, i) => i !== categoryIndex);
    setDownloaders(prev => prev.map(d => (d.id === selectedDownloader.id ? { ...d, categories: updatedCategories } : d)));
    setSelectedDownloader({ ...selectedDownloader, categories: updatedCategories });
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
      ssl: downloader.ssl,
    });
    setShowEditModal(true);
  };

  return {
    // 数据与选择
    downloaders,
    selectedDownloader,
    setSelectedDownloader,

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
    expandedCategories,
    setExpandedCategories,
    expandedPaths,
    setExpandedPaths,
    fetchingCategories,
    setFetchingCategories,
    fetchingPaths,
    setFetchingPaths,

    // 事件处理
    handleAddDownloader,
    handleEditDownloader,
    handleDeleteDownloader,
    handleTestConnection,
    handleFetchInfo,
    handleFetchCategories,
    handleFetchPaths,
    handleDeleteCategory,
    resetForm,
    openEditModal,
  } as const;
}

