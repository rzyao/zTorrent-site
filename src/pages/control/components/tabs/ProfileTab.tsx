import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import type { ProfileData } from '../../types';

interface ProfileTabProps {
  profileData: ProfileData;
  setProfileData: (next: ProfileData) => void;
}

// 个人信息 Tab
// 职责：渲染头像、签名、所在地与个人简介等可编辑信息
export function ProfileTab({ profileData, setProfileData }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white text-xl">个人信息</h2>
          <p className="text-neutral-400 text-sm">更新您的个人资料和头像</p>
        </div>
      </div>

      {/* 头像 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">头像</label>
        <div className="flex items-center gap-4">
          <img src={profileData.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-amber-500/30" />
          <div>
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">更换头像</Button>
            <p className="text-neutral-500 text-xs mt-2">支持 JPG、PNG 格式，最大 2MB</p>
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 个性签名 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">个性签名</label>
        <input
          type="text"
          value={profileData.signature}
          onChange={(e) => setProfileData({ ...profileData, signature: e.target.value })}
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          placeholder="说点什么..."
        />
      </div>

      {/* 所在地 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">所在地</label>
        {/* 注意：使用者可替换为 Select 组件；此处保留结构以便外层传入 */}
        {/* 我们在 index.tsx 中提供实际 Select 组件以保持解耦 */}
      </div>

      {/* 个人简介 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">个人简介</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          rows={4}
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
          placeholder="介绍一下自己..."
        />
      </div>
    </div>
  );
}

