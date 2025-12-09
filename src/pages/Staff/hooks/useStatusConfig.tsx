import { Activity, Clock, AlertCircle } from 'lucide-react';
import type { StaffStatus } from '../types';

export function getStatusConfig(status: StaffStatus) {
  switch (status) {
    case 'online':
      return { label: '在线', color: 'bg-green-500', icon: <Activity className="w-3 h-3" /> };
    case 'away':
      return { label: '离开', color: 'bg-yellow-500', icon: <Clock className="w-3 h-3" /> };
    case 'offline':
      return { label: '离线', color: 'bg-neutral-500', icon: <AlertCircle className="w-3 h-3" /> };
    default:
      return { label: '未知', color: 'bg-neutral-500', icon: <AlertCircle className="w-3 h-3" /> };
  }
}

