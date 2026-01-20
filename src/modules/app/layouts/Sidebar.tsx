import { TrendingUp, Clock, Award } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Sidebar() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h3 className="text-gray-900">{t('sidebar.hotTorrents')}</h3>
        </div>
        <div className="space-y-2">
          {[
            { title: '星际穿越 4K HDR 国英双语', seeders: 2847 },
            { title: '权力的游戏 全八季 1080p', seeders: 2156 },
            { title: '蝙蝠侠：黑暗骑士 IMAX', seeders: 1923 },
            { title: '瑞克和莫蒂 S07 完整版', seeders: 1687 },
            { title: '肖申克的救赎 4K 修复版', seeders: 1542 },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-red-500 text-sm mt-0.5">{index + 1}.</span>
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline line-clamp-2 flex-1"
              >
                {item.title}
              </a>
              <span className="text-xs text-green-600 whitespace-nowrap">
                {item.seeders}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="text-gray-900">{t('sidebar.latestTorrents')}</h3>
        </div>
        <div className="space-y-2">
          {[
            { title: '碟中谍8 2024 抢先版', time: '5分钟前' },
            { title: 'Adobe CC 2024 完整版', time: '12分钟前' },
            { title: '原神 4.5版本 OST', time: '28分钟前' },
            { title: '程序员修炼之道 第2版', time: '1小时前' },
            { title: '蓝色星球III 4K 纪录片', time: '2小时前' },
          ].map((item, index) => (
            <div key={index}>
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline line-clamp-2 block mb-1"
              >
                {item.title}
              </a>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-gray-900">{t('sidebar.monthlyRanking')}</h3>
        </div>
        <div className="space-y-3">
          {[
            { name: 'MovieLover', uploaded: '2.8 TB', rank: 1 },
            { name: 'SeedMaster', uploaded: '2.3 TB', rank: 2 },
            { name: 'TorrentKing', uploaded: '1.9 TB', rank: 3 },
          ].map((user) => (
            <div key={user.rank} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                  user.rank === 1
                    ? 'bg-yellow-500'
                    : user.rank === 2
                    ? 'bg-gray-400'
                    : 'bg-orange-600'
                }`}
              >
                {user.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{t('sidebar.uploaded')} {user.uploaded}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
