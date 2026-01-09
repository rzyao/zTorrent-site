import { Button } from '@/modules/app/components/ui/button';
import { Separator } from '@/modules/app/components/ui/separator';
import { User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useUserProfile } from '@/hooks/useApi';
import type { ProfileData } from '../../types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/modules/app/components/ui/select';

interface ProfileTabProps {
  profileData: ProfileData;
  setProfileData: (next: ProfileData) => void;
}

// 个人信息 Tab
// 职责：渲染头像、签名、所在地与个人简介等可编辑信息
export function ProfileTab({ profileData, setProfileData }: ProfileTabProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const baselineRef = useRef<ProfileData>(profileData);
  const { uploadAvatar, setAvatar, updateProfile, isLoading } = useUserProfile();

  useEffect(() => {
    const same = (
      profileData.signature === baselineRef.current.signature &&
      profileData.location === baselineRef.current.location &&
      profileData.bio === baselineRef.current.bio &&
      profileData.avatar === baselineRef.current.avatar &&
      profileData.username === baselineRef.current.username
    );
    if (same) baselineRef.current = profileData;
  }, [profileData]);

  const onPickAvatar = () => {
    fileInputRef.current?.click();
  };

  const onAvatarSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAvatar(file);
      const data = await setAvatar(url);
      const nextAvatar = (data as any)?.avatar ?? url;
      const next = { ...profileData, avatar: nextAvatar };
      setProfileData(next);
      baselineRef.current = next;
    } catch (err: any) {
      alert(err?.message || '设置头像失败');
    } finally {
      e.target.value = '';
    }
  };

  const onSave = async () => {
    try {
      const keys: Array<keyof ProfileData> = ['signature', 'location', 'bio'];
      const payload: Record<string, any> = {};
      keys.forEach((k) => {
        if (profileData[k] !== baselineRef.current[k]) payload[k] = profileData[k];
      });
      if (Object.keys(payload).length === 0) {
        alert('暂无更改');
        return;
      }
      const data = await updateProfile(payload);
      const next = {
        ...profileData,
        username: (data as any)?.username ?? profileData.username,
        avatar: (data as any)?.avatar ?? profileData.avatar,
        signature: (data as any)?.signature ?? profileData.signature,
        location: (data as any)?.location ?? profileData.location,
        bio: (data as any)?.bio ?? profileData.bio,
      };
      setProfileData(next);
      baselineRef.current = next;
      alert('保存成功');
    } catch (err: any) {
      alert(err?.message || '保存失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
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
            <Button size="sm" onClick={onPickAvatar} disabled={isLoading} className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">更换头像</Button>
            <p className="text-neutral-500 text-xs mt-2">支持 JPG、PNG 格式，最大 2MB</p>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={onAvatarSelected} />
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
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">所在地</label>
        <Select value={profileData.location} onValueChange={(value) => setProfileData({ ...profileData, location: value })}>
          <SelectTrigger>
            <SelectValue placeholder="选择所在地" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="中国">中国</SelectItem>
            <SelectItem value="美国">美国</SelectItem>
            <SelectItem value="日本">日本</SelectItem>
            <SelectItem value="韩国">韩国</SelectItem>
            <SelectItem value="其他">其他</SelectItem>
          </SelectContent>
        </Select>
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

      <div>
        <Button onClick={onSave} disabled={isLoading || (
          profileData.signature === baselineRef.current.signature &&
          profileData.location === baselineRef.current.location &&
          profileData.bio === baselineRef.current.bio
        )} className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">保存更改</Button>
      </div>
    </div>
  );
}
