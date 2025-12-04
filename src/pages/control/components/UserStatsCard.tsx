import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UserStatsCardProps {
  avatar: string;
  username: string;
  uploadText?: string;
  downloadText?: string;
  ratioText?: string;
}

// 用户统计信息卡片
// 职责：展示头像、用户名、会员标识与上传/下载/分享率概览
export function UserStatsCard({ avatar, username, uploadText = '5.28TB', downloadText = '2.15TB', ratioText = '2.46' }: UserStatsCardProps) {
  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
      <div className="flex items-center gap-3 mb-4">
        <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-amber-500/30" />
        <div>
          <p className="text-white">{username}</p>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs mt-1">VIP会员</Badge>
        </div>
      </div>
      <Separator className="bg-neutral-700/50 my-3" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-400">上传量</span>
          <span className="text-green-400">{uploadText}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">下载量</span>
          <span className="text-red-400">{downloadText}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">分享率</span>
          <span className="text-yellow-400">{ratioText}</span>
        </div>
      </div>
    </div>
  );
}

