// 列表组件：按排序后的结果渲染断种卡片，并在空列表时给出空状态
import { AlertTriangle } from 'lucide-react';
import type { DeadTorrent, TabType } from '../types';
import { DeadTorrentCard } from './DeadTorrentCard';

export function DeadTorrentsList({ list, activeTab }: { list: DeadTorrent[]; activeTab: TabType }) {
  if (list.length === 0) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
        <p className="text-neutral-400">暂无断种记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((torrent) => (
        <DeadTorrentCard key={torrent.id} torrent={torrent} activeTab={activeTab} />
      ))}
    </div>
  );
}

