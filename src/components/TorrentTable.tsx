// 组件依赖：图标库（状态/指标）、路由跳转、图片占位、徽标、按钮、下载 Hook、格式化工具
import { Download, Upload, MessageSquare, Star, HardDrive, Calendar, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from '@/components/ui/button';
import { useTorrentDownload } from '@/utils/useTorrentDownload';
import { formatSize, formatDateTime } from '@/utils/format';

// 种子数据模型：与列表视图对齐，支持副标题与两个时间字段兼容
interface Torrent {
  id: string;
  title: string;
  subTitle?: string;
  category: string;
  image?: string;
  size: string;
  seeders: number;
  leechers: number;
  completed: number;
  uploader: string;
  uploadTime: string;
  uploadDate?: string;
  isFree?: boolean;
  isVip?: boolean;
  isHot?: boolean;
  comments: number;
  rating?: number;
}

// 组件入参：待渲染的种子列表数据
interface TorrentTableProps {
  torrents: Torrent[];
  filmId?: string;
}

// 统一列表视图样式的种子表格组件
export function TorrentTable({ torrents, filmId }: TorrentTableProps) {
  // 下载能力：生成一次性链接并保存 .torrent 文件
  const { downloadByTorrentId } = useTorrentDownload();
  const location = useLocation();
  const mergedSearch = (() => {
    const p = new URLSearchParams(location.search);
    if (filmId) p.set('source_film_id', filmId);
    const s = p.toString();
    return s ? `?${s}` : '';
  })();
  const mergedHash = location.hash;
  return (
    // 列表容器：与 TorrentsPage 列表视图一致的间距与外边距
    <div className="space-y-4 mb-8">
      {torrents.map((torrent) => (
        // 单个种子卡片容器：hover 边框高亮、过渡细腻
        <div
          key={torrent.id}
          className="bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#00A8E1] transition-all duration-300 cursor-pointer p-4"
        >
          <div className="flex gap-4">
            {/* 缩略图：统一 w-25 h-25，缺省时不渲染 */}
            {torrent.image && (
              <div className="relative w-25 h-25 flex-shrink-0 rounded overflow-hidden">
                <ImageWithFallback
                  src={torrent.image}
                  alt={torrent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {/* 信息区：标题/副标题 + 右侧下载按钮 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-1">
                <div className="flex flex-col flex-1 min-w-0">
                  {/* 标题：保持可点击跳转详情，悬停高亮 */}
                  <h3 className="text-white flex-1 hover:text-[#00A8E1] transition-colors">
                    <Link to={{ pathname: `/torrent/${torrent.id}`, search: mergedSearch, hash: mergedHash }}>
                      {torrent.title}
                    </Link>
                  </h3>
                  {torrent.subTitle && (
                    // 副标题：存在时显示并与标题同样交互样式
                    <h3 className="text-white flex-1 hover:text-[#00A8E1] transition-colors">{torrent.subTitle}</h3>
                  )}
                </div>
                {/* 下载按钮：调用统一下载流程 Hook */}
                <Button
                  size="sm"
                  className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white flex-shrink-0"
                  onClick={() => downloadByTorrentId(String(torrent.id), String(torrent.title || 'download'))}
                >
                  <Download className="w-4 h-4 mr-1" />
                  下载
                </Button>
              </div>
              {/* 徽标区：类别/FREE/VIP/HOT/评分 */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge color="blue" border="white" size="sm" className="text-xs">{torrent.category}</Badge>
                {torrent.isFree && <Badge color="green" size="sm">FREE</Badge>}
                {torrent.isVip && <Badge color="yellow" size="sm">VIP</Badge>}
                {torrent.isHot && <Badge color="red" size="sm">HOT</Badge>}
                {typeof torrent.rating === 'number' && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">{torrent.rating}</span>
                  </div>
                )}
              </div>

              {/* 指标区：大小/做种/下载/完成/评论/上传时间/上传者 */}
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
                  <span>{formatDateTime(torrent.uploadDate || torrent.uploadTime)}</span>
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
