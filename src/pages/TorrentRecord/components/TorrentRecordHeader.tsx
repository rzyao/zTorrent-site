import { Loader2 } from 'lucide-react';

interface TorrentRecordHeaderProps {
  isUpdating: boolean;
}

export function TorrentRecordHeader({ isUpdating }: TorrentRecordHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl text-white mb-2">种子记录</h1>
        <p className="text-neutral-400">查看您的种子发布、下载和做种历史记录</p>
      </div>
      {isUpdating && (
        <div className="flex items-center gap-2 text-neutral-400 text-sm bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>更新中...</span>
        </div>
      )}
    </div>
  );
}
