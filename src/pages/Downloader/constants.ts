// 下载器页面 - 静态常量与示例数据
// 说明：将页面使用的静态映射与默认数据集中存放，避免组件内混杂静态配置，提升可读性与复用性。

import { Downloader, DownloaderType } from './types';

// 类型对应的 Tailwind 颜色类（仅用于 UI 渲染，不包含业务逻辑）
export const TYPE_COLOR_MAP: Record<DownloaderType, string> = {
  qBittorrent: 'text-blue-400',
  Transmission: 'text-purple-400',
  Deluge: 'text-green-400',
  rTorrent: 'text-orange-400',
};

// 连接状态对应的徽章颜色类（UI 专用）
export const STATUS_BADGE_CLASS_MAP: Record<string, string> = {
  connected: 'text-green-400 bg-green-500/20',
  disconnected: 'text-neutral-400 bg-neutral-500/20',
  error: 'text-red-400 bg-red-500/20',
};

// 连接状态对应的中文文案（UI 专用）
export const STATUS_TEXT_MAP: Record<string, string> = {
  connected: '已连接',
  disconnected: '未连接',
  error: '连接错误',
  unknown: '未知',
};

// 默认演示数据：用于初始化页面展示（无后端对接时）
export const DEFAULT_DOWNLOADERS: Downloader[] = [
  {
    id: '1',
    name: '主服务器 qBittorrent',
    type: 'qBittorrent',
    host: '192.168.1.100',
    port: 8080,
    username: 'admin',
    password: '••••••••',
    ssl: false,
    status: 'connected',
    version: 'v4.6.2',
    uploadSpeed: 15.6 * 1024 * 1024,
    downloadSpeed: 8.3 * 1024 * 1024,
    activeTorrents: 12,
    totalTorrents: 156,
    freeSpace: 2.4 * 1024 * 1024 * 1024 * 1024,
  },
  {
    id: '2',
    name: '备用服务器 Transmission',
    type: 'Transmission',
    host: '192.168.1.101',
    port: 9091,
    username: 'transmission',
    password: '••••••••',
    ssl: true,
    status: 'connected',
    version: 'v3.00',
    uploadSpeed: 5.2 * 1024 * 1024,
    downloadSpeed: 3.1 * 1024 * 1024,
    activeTorrents: 5,
    totalTorrents: 89,
    freeSpace: 1.8 * 1024 * 1024 * 1024 * 1024,
  },
  {
    id: '3',
    name: '离线下载器',
    type: 'Deluge',
    host: '10.0.0.50',
    port: 8112,
    username: 'admin',
    password: '••••••••',
    ssl: false,
    status: 'disconnected',
  },
];

