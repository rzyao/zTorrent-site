import { Download, Upload, Star, MessageSquare, HardDrive, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { formatSize } from '@/utils/format';
import type { Torrent } from '../types';

interface ListViewProps {
  /** 展示列表数据（已做前端筛选/排序派生） */
  items: Torrent[];
  /** 分类标签词典映射 */
  getCategoryLabel: (key?: string) => string | undefined;
  /** 下载触发（容器传入，调用 `useTorrentDownload`） */
  onDownload: (id: string, title: string) => void;
  /** 根据视图模式选择封面字段 */
  getCoverSrc: (item: Torrent) => string;
}

/**
 * 保留与旧页面一致的标签颜色逻辑
 * - 设计原因：后端返回的标签集合需要在UI上进行视觉区分
 */
const tagBadgeColor = (key?: string) => {
  if (!key) return 'primary' as const;
  if (key === '完结') return 'green' as const;
  if (key === '分级') return 'red' as const;
  return 'primary' as const;
};

/**
 * ListView
 * 职责：列表行视图（复用 `ImageWithFallback`、`Badge` 等）
 * 说明：纯UI组件，所有数据和事件通过 props 输入。
 */
export function ListView({ items, getCategoryLabel, onDownload, getCoverSrc }: ListViewProps) {
  return (
    <div className="space-y-4 mb-8">
      {items.map((torrent) => (
        <div key={torrent.id} className="bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#00A8E1] transition-all duration-300 cursor-pointer p-4">
          <div className="flex gap-4">
            {/* 缩略图 */}
            <div className="relative w-25 h-25 flex-shrink-0 rounded overflow-hidden">
              <ImageWithFallback src={getCoverSrc(torrent)} alt={torrent.title} className="w-full h-full object-cover" />
            </div>

            {/* 信息区 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3  mb-1">
                <div className='flex flex-col flex-1'>
                  <h3 className="text-white flex-1 hover:text-[#00A8E1] transition-colors">{torrent.title}</h3>
                  <h3 className="text-white flex-1 hover:text-[#00A8E1] transition-colors">{torrent.subTitle}</h3>
                </div>
                <Button size="sm" className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white flex-shrink-0" onClick={() => onDownload(String(torrent.id), String(torrent.title || 'download'))}>
                  <Download className="w-4 h-4 mr-1" />
                  下载
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge color="blue" border="white" size="sm" className="text-xs">
                  {getCategoryLabel(torrent.category) || torrent.category}
                </Badge>
                {Array.isArray(torrent.tags)
                  ? torrent.tags.map((tag, idx) => (
                    <Badge key={idx} color={tagBadgeColor(tag)} border="white" size="sm" className="text-xs">{tag}</Badge>
                  ))
                  : torrent.tags && (
                    <Badge outline size="sm" className="text-xs">{torrent.tags}</Badge>
                  )}
                {torrent.isFree && <Badge color="green" size="sm">FREE</Badge>}
                {torrent.isVip && <Badge color="yellow" size="sm">VIP</Badge>}
                {torrent.isHot && <Badge color="red" size="sm">HOT</Badge>}
                {torrent.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">{torrent.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <HardDrive className="w-4 h-4" />
                  <span>{formatSize(torrent.size)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Upload className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">{torrent.seeders} 做种</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">{torrent.leechers} 下载</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{torrent.completed} 完成</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{torrent.comments} 评论</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{torrent.uploadDate}</span>
                </div>
                <div>
                  <span className="text-[#00A8E1]">{torrent.uploader}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
