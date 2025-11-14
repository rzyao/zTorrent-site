import { Download, Upload, MessageSquare, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

interface Torrent {
  id: number;
  title: string;
  category: string;
  image?: string;
  size: string;
  seeders: number;
  leechers: number;
  completed: number;
  uploader: string;
  uploadTime: string;
  isFree?: boolean;
  isVip?: boolean;
  isHot?: boolean;
  comments: number;
  rating?: number;
}

interface TorrentTableProps {
  torrents: Torrent[];
}

export function TorrentTable({ torrents }: TorrentTableProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm text-gray-600">类型</th>
              <th className="text-left px-4 py-3 text-sm text-gray-600">标题</th>
              <th className="text-center px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                大小
              </th>
              <th className="text-center px-4 py-3 text-sm text-gray-600">
                <Upload className="w-4 h-4 inline text-green-600" />
              </th>
              <th className="text-center px-4 py-3 text-sm text-gray-600">
                <Download className="w-4 h-4 inline text-red-600" />
              </th>
              <th className="text-center px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                完成
              </th>
              <th className="text-left px-4 py-3 text-sm text-gray-600 hidden xl:table-cell">
                发布者
              </th>
              <th className="text-left px-4 py-3 text-sm text-gray-600 hidden xl:table-cell">
                时间
              </th>
            </tr>
          </thead>
          <tbody>
            {torrents.map((torrent) => (
              <tr key={torrent.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs">
                    {torrent.category}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    {torrent.image && (
                      <ImageWithFallback
                        src={torrent.image}
                        alt={torrent.title}
                        className="w-16 h-20 object-cover rounded hidden sm:block"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 hover:underline line-clamp-2"
                        >
                          {torrent.title}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {torrent.isFree && (
                          <Badge className="bg-green-500 text-white text-xs">
                            FREE
                          </Badge>
                        )}
                        {torrent.isVip && (
                          <Badge className="bg-yellow-500 text-white text-xs">
                            VIP
                          </Badge>
                        )}
                        {torrent.isHot && (
                          <Badge className="bg-red-500 text-white text-xs">
                            HOT
                          </Badge>
                        )}
                        {torrent.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">
                              {torrent.rating}
                            </span>
                          </div>
                        )}
                        {torrent.comments > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {torrent.comments}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600 hidden md:table-cell">
                  {torrent.size}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-green-600">{torrent.seeders}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-red-600">{torrent.leechers}</span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600 hidden lg:table-cell">
                  {torrent.completed}
                </td>
                <td className="px-4 py-3 text-sm hidden xl:table-cell">
                  <a href="#" className="text-blue-600 hover:underline">
                    {torrent.uploader}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden xl:table-cell">
                  {torrent.uploadTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
