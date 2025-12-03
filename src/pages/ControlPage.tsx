import { useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Lock,
  Eye,
  Mail,
  Download,
  Key,
  Smartphone,
  Monitor,
  Save,
  AlertCircle,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { isValidPassword, passwordErrorMessage } from '../utils/validation';

type TabType = 'profile' | 'preferences' | 'security' | 'notifications' | 'privacy';

export function ControlPage() {
  useDynamicTitle('控制台');
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 个人信息状态
  const [profileData, setProfileData] = useState({
    username: 'MovieLover2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieLover2024',
    signature: '热爱分享，热爱电影',
    location: '中国',
    bio: '资深PT玩家，专注高质量蓝光原盘分享',
  });

  // 网站偏好设置状态
  const [preferences, setPreferences] = useState({
    language: 'zh-CN',
    theme: 'dark',
    defaultView: 'grid',
  });

  // 安全设置状态
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    trustedDevices: 3,
  });

  // 通知设置状态
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    torrentComments: true,
    privateMessages: true,
    systemAnnouncements: true,
    downloadComplete: false,
    ratioWarnings: true,
  });

  // 隐私设置状态
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showStats: true,
    allowMessages: true,
    showOnlineStatus: true,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

  const canUpdatePassword = () => {
    if (!currentPassword) return false;
    if (!isValidPassword(newPassword)) return false;
    if (confirmNewPassword !== newPassword) return false;
    return true;
  };

  const handleUpdatePassword = () => {
    const errs: { current?: string; new?: string; confirm?: string } = {};
    if (!currentPassword) errs.current = '请输入当前密码';
    if (!isValidPassword(newPassword)) errs.new = passwordErrorMessage();
    if (confirmNewPassword !== newPassword) errs.confirm = '两次输入的密码不一致';
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile' as TabType, label: '个人信息', icon: User },
    { id: 'preferences' as TabType, label: '网站偏好', icon: Settings },
    { id: 'security' as TabType, label: '安全设置', icon: Shield },
    { id: 'notifications' as TabType, label: '通知设置', icon: Bell },
    { id: 'privacy' as TabType, label: '隐私设置', icon: Eye },
  ];

  return (
    <div className="min-h-screen  bg-[#0F171E]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">控制台</h1>
              <p className="text-neutral-400 text-sm mt-1">
                管理您的账户设置和个人偏好
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
              <div className="p-4">
                <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-3">
                  设置菜单
                </h3>
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400 border border-amber-500/30'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-700/30'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{tab.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* 用户统计卡片 */}
            <div className="mt-6 bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={profileData.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-amber-500/30"
                />
                <div>
                  <p className="text-white">{profileData.username}</p>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs mt-1">
                    VIP会员
                  </Badge>
                </div>
              </div>
              <Separator className="bg-neutral-700/50 my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">上传量</span>
                  <span className="text-green-400">5.28TB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">下载量</span>
                  <span className="text-red-400">2.15TB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">分享率</span>
                  <span className="text-yellow-400">2.46</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8">
              {/* 个人信息 */}
              {activeTab === 'profile' && (
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
                      <img
                        src={profileData.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-2 border-amber-500/30"
                      />
                      <div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        >
                          更换头像
                        </Button>
                        <p className="text-neutral-500 text-xs mt-2">
                          支持 JPG、PNG 格式，最大 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 用户名编辑已移除：保留展示用途 */}

                  {/* 邮箱编辑已移除：保留其他个人信息 */}

                  {/* 个性签名 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">个性签名</label>
                    <input
                      type="text"
                      value={profileData.signature}
                      onChange={(e) =>
                        setProfileData({ ...profileData, signature: e.target.value })
                      }
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                      placeholder="说点什么..."
                    />
                  </div>

                  {/* 所在地 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">所在地</label>
                    <Select
                      value={profileData.location}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, location: value })
                      }
                    >
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
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                      placeholder="介绍一下自己..."
                    />
                  </div>
                </div>
              )}

              {/* 网站偏好 */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Palette className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl">网站偏好</h2>
                      <p className="text-neutral-400 text-sm">自定义您的浏览体验</p>
                    </div>
                  </div>

                  {/* 语言：使用自定义 Select 组件替换原生 select，保持偏好状态更新 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      语言
                    </label>
                    <Select
                      value={preferences.language}
                      onValueChange={(v) =>
                        setPreferences({ ...preferences, language: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择语言" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="zh-TW">繁體中文</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="ja-JP">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 主题：统一使用 Select 组件 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      主题
                    </label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(v) =>
                        setPreferences({ ...preferences, theme: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择主题" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">深色模式</SelectItem>
                        <SelectItem value="light">浅色模式</SelectItem>
                        <SelectItem value="auto">跟随系统</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 每页显示种子数设置已移除 */}

                  {/* 默认视图：字符串枚举 */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-sm">默认视图</label>
                    <Select
                      value={preferences.defaultView}
                      onValueChange={(v) =>
                        setPreferences({ ...preferences, defaultView: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择默认视图" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">网格视图</SelectItem>
                        <SelectItem value="list">列表视图</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 自动下载设置已移除 */}

                  {/* 显示剧透设置已移除 */}
                </div>
              )}

              {/* 安全设置 */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl">安全设置</h2>
                      <p className="text-neutral-400 text-sm">保护您的账户安全</p>
                    </div>
                  </div>

                  {/* 修改密码 */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-white text-sm mb-1">修改密码</h3>
                        <p className="text-neutral-400 text-xs mb-3">
                          定期更改密码可以提高账户安全性
                        </p>
                        <div className="space-y-3">
                          <input
                            type="password"
                            placeholder="当前密码"
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                          {passwordErrors.current && (<p className="text-xs text-red-400">{passwordErrors.current}</p>)}
                          <input
                            type="password"
                            placeholder="新密码"
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          {passwordErrors.new && (<p className="text-xs text-red-400">{passwordErrors.new}</p>)}
                          <input
                            type="password"
                            placeholder="确认新密码"
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                          />
                          {passwordErrors.confirm && (<p className="text-xs text-red-400">{passwordErrors.confirm}</p>)}
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                            onClick={handleUpdatePassword}
                            disabled={!canUpdatePassword()}
                          >
                            更新密码
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 双因素认证 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1">
                        <Smartphone className="w-4 h-4" />
                        双因素认证（2FA）
                      </div>
                      <p className="text-neutral-500 text-xs">
                        为您的账户添加额外的安全层
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, twoFactorEnabled: checked })
                      }
                    />
                  </div>

                  {/* 登录通知 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1">
                        <Bell className="w-4 h-4" />
                        登录通知
                      </div>
                      <p className="text-neutral-500 text-xs">
                        新设备登录时发送邮件通知
                      </p>
                    </div>
                    <Switch
                      checked={security.loginNotifications}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, loginNotifications: checked })
                      }
                    />
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 会话超时设置已移除 */}

                  <Separator className="bg-neutral-700/50" />

                  {/* 受信任设备 */}
                  <div className="space-y-3">
                    <label className="text-neutral-300 text-sm">受信任的设备</label>
                    <div className="space-y-2">
                      {[
                        { name: 'Chrome on Windows', date: '最后活动：2小时前', active: true },
                        { name: 'Safari on iPhone', date: '最后活动：1天前', active: false },
                        { name: 'Firefox on macOS', date: '最后活动：3天前', active: false },
                      ].map((device, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/30 border border-neutral-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <Monitor className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-white text-sm">{device.name}</p>
                              <p className="text-neutral-500 text-xs">{device.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {device.active && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">
                                当前设备
                              </Badge>
                            )}
                            {!device.active && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7"
                              >
                                移除
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* Passkey */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-neutral-800/50 to-stone-900/50 border border-neutral-700/50">
                    <div className="flex items-start gap-3">
                      <Key className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-white text-sm mb-1">重置 Passkey</h3>
                        <p className="text-neutral-400 text-xs mb-3">
                          使用生物识别或设备PIN快速登录
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          重置 Passkey
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 通知设置 */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl">通知设置</h2>
                      <p className="text-neutral-400 text-sm">选择您想接收的通知类型</p>
                    </div>
                  </div>

                  {/* 邮件通知 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1">
                        <Mail className="w-4 h-4" />
                        启用邮件通知
                      </div>
                      <p className="text-neutral-500 text-xs">
                        接收重要通知和更新的邮件
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNotifications: checked })
                      }
                    />
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 种子评论 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="text-neutral-300 text-sm mb-1">种子评论</div>
                      <p className="text-neutral-500 text-xs">
                        有人评论您的种子时通知您
                      </p>
                    </div>
                    <Switch
                      checked={notifications.torrentComments}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, torrentComments: checked })
                      }
                    />
                  </div>

                  {/* 私信 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="text-neutral-300 text-sm mb-1">私人消息</div>
                      <p className="text-neutral-500 text-xs">
                        收到新私信时通知您
                      </p>
                    </div>
                    <Switch
                      checked={notifications.privateMessages}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, privateMessages: checked })
                      }
                    />
                  </div>

                  {/* 系统公告 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="text-neutral-300 text-sm mb-1">系统公告</div>
                      <p className="text-neutral-500 text-xs">
                        接收站点重要公告和更新
                      </p>
                    </div>
                    <Switch
                      checked={notifications.systemAnnouncements}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          systemAnnouncements: checked,
                        })
                      }
                    />
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 下载完成 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1">
                        <Download className="w-4 h-4" />
                        下载完成
                      </div>
                      <p className="text-neutral-500 text-xs">
                        种子下载完成时通知您
                      </p>
                    </div>
                    <Switch
                      checked={notifications.downloadComplete}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, downloadComplete: checked })
                      }
                    />
                  </div>

                  {/* 上传成功通知已移除 */}

                  {/* 分享率警告 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1">
                        <AlertCircle className="w-4 h-4" />
                        分享率警告
                      </div>
                      <p className="text-neutral-500 text-xs">
                        分享率低于阈值时通知您
                      </p>
                    </div>
                    <Switch
                      checked={notifications.ratioWarnings}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, ratioWarnings: checked })
                      }
                    />
                  </div>
                </div>
              )}

              {/* 隐私设置 */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl">隐私设置</h2>
                      <p className="text-neutral-400 text-sm">控制您的信息可见性</p>
                    </div>
                  </div>

                  {/* 显示个人资料 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="text-neutral-300 text-sm mb-1">公开个人资料</div>
                      <p className="text-neutral-500 text-xs">
                        允许其他用户查看您的个人资料页面
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showProfile}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showProfile: checked })
                      }
                    />
                  </div>

                  {/* 显示统计 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="text-neutral-300 text-sm mb-1">显示统计信息</div>
                      <p className="text-neutral-500 text-xs">
                        在个人资料中显示上传下载统计
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showStats}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showStats: checked })
                      }
                    />
                  </div>

                  {/* 显示活动记录设置已移除 */}

                  <Separator className="bg-neutral-700/50" />

                  {/* 允许私信 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-1">
                        <Mail className="w-4 h-4" />
                        允许接收私信
                      </div>
                      <p className="text-neutral-500 text-xs">
                        其他用户可以给您发送私人消息
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, allowMessages: checked })
                      }
                    />
                  </div>

                  {/* 在线状态 */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/30 border border-neutral-700/50">
                    <div className="flex-1">
                      <div className="text-neutral-300 text-sm mb-1">显示在线状态</div>
                      <p className="text-neutral-500 text-xs">
                        让其他用户知道您是否在线
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showOnlineStatus}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showOnlineStatus: checked })
                      }
                    />
                  </div>

                  <Separator className="bg-neutral-700/50" />

                  {/* 数据导出 */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-neutral-800/50 to-stone-900/50 border border-neutral-700/50">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-white text-sm mb-1">导出数据</h3>
                        <p className="text-neutral-400 text-xs mb-3">
                          下载您在本站的所有数据副本
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          请求导出
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 删除账户设置已移除 */}
                </div>
              )}

              {/* 保存按钮 */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-700/50">
                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">设置已保存</span>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存设置
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
