// 下载器页面 - 纯工具函数
// 说明：从原页面中提取的纯函数，保证无副作用，便于跨组件复用与单元测试。

import { DownloaderType } from './types';
import { TYPE_COLOR_MAP, STATUS_BADGE_CLASS_MAP, STATUS_TEXT_MAP } from './constants';
import { MonitorDown } from 'lucide-react';

// 根据类型返回图标组件（此处统一用 MonitorDown，后续可按类型定制）
export const getTypeIcon = (type: DownloaderType) => {
  // 保留扩展点：未来可根据不同 type 返回不同的 Lucide 图标
  return MonitorDown;
};

// 根据类型返回颜色类（UI 专用）
export const getTypeColor = (type: DownloaderType) => TYPE_COLOR_MAP[type];

// 根据状态返回徽章样式类（UI 专用）
export const getStatusBadgeClass = (status: string) => STATUS_BADGE_CLASS_MAP[status] ?? STATUS_BADGE_CLASS_MAP['disconnected'];

// 根据状态返回中文文案（UI 专用）
export const getStatusText = (status: string) => STATUS_TEXT_MAP[status] ?? STATUS_TEXT_MAP['unknown'];

// 字节数格式化（例如：1024 -> 1.00 KB）
export const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// 速度格式化（字节每秒 -> 文本）
export const formatSpeed = (bytesPerSecond: number) => `${formatBytes(bytesPerSecond)}/s`;

