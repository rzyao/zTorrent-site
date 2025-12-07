import { Upload, Download, CheckCircle, XCircle, Clock, ArrowUpDown, Activity } from 'lucide-react';
import { TorrentStatus } from './types';

/** 标签页配置 */
export const TORRENT_TABS: { id: TorrentStatus; label: string; icon: any }[] = [
  { id: 'uploaded', label: '发布种子', icon: Upload },
  { id: 'seeding', label: '当前做种', icon: ArrowUpDown },
  { id: 'downloading', label: '当前下载', icon: Download },
  { id: 'completed', label: '完成种子', icon: CheckCircle },
  { id: 'incomplete', label: '未完成种子', icon: XCircle },
];

export const STATUS_CONFIG: Record<string, { color: string; icon: any; text: string }> = {
  uploaded: {
    color: 'text-purple-400',
    icon: Upload,
    text: '已发布',
  },
  seeding: {
    color: 'text-green-400',
    icon: ArrowUpDown,
    text: '做种中',
  },
  downloading: {
    color: 'text-blue-400',
    icon: Download,
    text: '下载中',
  },
  active: {
    color: 'text-teal-400',
    icon: Activity,
    text: '活跃',
  },
  completed: {
    color: 'text-amber-400',
    icon: CheckCircle,
    text: '已完成',
  },
  incomplete: {
    color: 'text-red-400',
    icon: XCircle,
    text: '未完成',
  },
  default: {
    color: 'text-gray-400',
    icon: Clock,
    text: '未知',
  },
};
