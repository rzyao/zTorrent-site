import { useState } from 'react';
import {
  Shield,
  Crown,
  Star,
  Users,
  MessageCircle,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface StaffMember {
  id: string;
  username: string;
  avatar: string;
  role: 'owner' | 'admin' | 'moderator' | 'uploader' | 'support';
  title: string;
  joinDate: string;
  responsibilities: string[];
  stats: {
    handledTickets?: number;
    approvedUploads?: number;
    bannedUsers?: number;
    solvedIssues?: number;
  };
  status: 'online' | 'away' | 'offline';
  bio?: string;
  contactAllowed: boolean;
}

export function StaffPage() {
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const staffMembers: StaffMember[] = [
    {
      id: '1',
      username: 'SiteAdmin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      role: 'owner',
      title: '站长',
      joinDate: '2020-01-01',
      responsibilities: ['全站管理', '战略规划', '重大决策', '服务器维护'],
      stats: {
        handledTickets: 2847,
        bannedUsers: 156,
        solvedIssues: 1234,
      },
      status: 'online',
      bio: '负责站点的整体运营和发展方向，确保站点稳定运行。',
      contactAllowed: true,
    },
    {
      id: '2',
      username: 'TechLead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      role: 'admin',
      title: '技术管理',
      joinDate: '2020-03-15',
      responsibilities: ['技术开发', '系统维护', 'Bug修复', '功能更新'],
      stats: {
        solvedIssues: 3456,
        handledTickets: 1892,
      },
      status: 'online',
      bio: '负责站点技术架构和系统优化，处理各类技术问题。',
      contactAllowed: true,
    },
    {
      id: '3',
      username: 'ContentMaster',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      role: 'admin',
      title: '内容管理',
      joinDate: '2020-05-20',
      responsibilities: ['内容审核', '质量控制', '分类管理', '规则制定'],
      stats: {
        approvedUploads: 5678,
        bannedUsers: 89,
      },
      status: 'away',
      bio: '负责审核上传内容，确保资源质量和分类准确性。',
      contactAllowed: true,
    },
    {
      id: '4',
      username: 'ForumGuardian',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      role: 'moderator',
      title: '论坛版主',
      joinDate: '2021-02-10',
      responsibilities: ['论坛管理', '社区维护', '用户纠纷处理', '活动组织'],
      stats: {
        handledTickets: 1234,
        solvedIssues: 892,
      },
      status: 'online',
      bio: '维护论坛秩序，处理用户投诉和纠纷。',
      contactAllowed: true,
    },
    {
      id: '5',
      username: 'MovieExpert',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      role: 'moderator',
      title: '电影区版主',
      joinDate: '2021-04-22',
      responsibilities: ['电影区管理', '资源审核', '推荐优质内容', '解答疑问'],
      stats: {
        approvedUploads: 2345,
        handledTickets: 567,
      },
      status: 'online',
      bio: '专注于电影区的内容质量和用户体验。',
      contactAllowed: true,
    },
    {
      id: '6',
      username: 'SeriesKing',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      role: 'moderator',
      title: '剧集区版主',
      joinDate: '2021-06-15',
      responsibilities: ['剧集区管理', '更新追踪', '资源整理', '用户服务'],
      stats: {
        approvedUploads: 1987,
        handledTickets: 432,
      },
      status: 'offline',
      bio: '负责剧集资源的更新和整理，提供优质观剧体验。',
      contactAllowed: true,
    },
    {
      id: '7',
      username: 'UploadPro',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      role: 'uploader',
      title: '优秀上传者',
      joinDate: '2021-08-30',
      responsibilities: ['资源制作', '高质量上传', '技术指导', '新人培训'],
      stats: {
        approvedUploads: 4567,
      },
      status: 'online',
      bio: '专注于制作和上传高质量资源，分享技术经验。',
      contactAllowed: true,
    },
    {
      id: '8',
      username: 'UploadMaster',
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200',
      role: 'uploader',
      title: '资深上传者',
      joinDate: '2021-10-12',
      responsibilities: ['4K资源制作', '音轨处理', '字幕制作', '质量把关'],
      stats: {
        approvedUploads: 3892,
      },
      status: 'away',
      bio: '擅长4K资源制作和音轨处理，追求极致画质。',
      contactAllowed: true,
    },
    {
      id: '9',
      username: 'HelpDesk',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      role: 'support',
      title: '客服专员',
      joinDate: '2022-01-20',
      responsibilities: ['用户咨询', '问题解答', '新手引导', '工单处理'],
      stats: {
        handledTickets: 5678,
        solvedIssues: 4321,
      },
      status: 'online',
      bio: '解答用户疑问，提供技术支持和帮助。',
      contactAllowed: true,
    },
    {
      id: '10',
      username: 'SupportGuru',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200',
      role: 'support',
      title: '技术支持',
      joinDate: '2022-03-08',
      responsibilities: ['技术问题', '账号问题', '下载指导', 'FAQ维护'],
      stats: {
        handledTickets: 4234,
        solvedIssues: 3567,
      },
      status: 'online',
      bio: '专注于解决用户技术问题，优化使用体验。',
      contactAllowed: true,
    },
  ];

  const roleConfig = {
    owner: {
      label: '站长',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      icon: <Crown className="w-4 h-4" />,
    },
    admin: {
      label: '管理员',
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      icon: <Shield className="w-4 h-4" />,
    },
    moderator: {
      label: '版主',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      icon: <Star className="w-4 h-4" />,
    },
    uploader: {
      label: '上传组',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/30',
      icon: <Award className="w-4 h-4" />,
    },
    support: {
      label: '客服组',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      icon: <MessageCircle className="w-4 h-4" />,
    },
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return {
          label: '在线',
          color: 'bg-green-500',
          icon: <Activity className="w-3 h-3" />,
        };
      case 'away':
        return {
          label: '离开',
          color: 'bg-yellow-500',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'offline':
        return {
          label: '离线',
          color: 'bg-neutral-500',
          icon: <AlertCircle className="w-3 h-3" />,
        };
      default:
        return {
          label: '未知',
          color: 'bg-neutral-500',
          icon: <AlertCircle className="w-3 h-3" />,
        };
    }
  };

  const filteredMembers =
    selectedRole === 'all'
      ? staffMembers
      : staffMembers.filter((member) => member.role === selectedRole);

  const roleStats = {
    all: staffMembers.length,
    owner: staffMembers.filter((m) => m.role === 'owner').length,
    admin: staffMembers.filter((m) => m.role === 'admin').length,
    moderator: staffMembers.filter((m) => m.role === 'moderator').length,
    uploader: staffMembers.filter((m) => m.role === 'uploader').length,
    support: staffMembers.filter((m) => m.role === 'support').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1600px] mx-auto px-4 md:px-4 py-4">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">管理组</h1>
              <p className="text-neutral-400 text-sm mt-1">
                认识我们的管理团队，他们为站点的运营贡献力量
              </p>
            </div>
          </div>
        </div>

        {/* 介绍横幅 */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-amber-400 mb-2">关于管理组</h3>
              <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                管理组成员致力于维护站点秩序、提升用户体验、保证资源质量。如果您在使用过程中遇到任何问题或有任何建议，欢迎联系相应的管理人员。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  7x24小时服务
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  快速响应
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  <Award className="w-3 h-3 mr-1" />
                  专业团队
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 角色筛选 */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedRole('all')}
            className={`px-6 py-3 rounded-xl transition-all ${selectedRole === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
              : 'bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-700/50 border border-neutral-700'
              }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>全部</span>
              <Badge className="bg-neutral-900/50 text-neutral-300">
                {roleStats.all}
              </Badge>
            </div>
          </button>

          {Object.entries(roleConfig).map(([role, config]) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-6 py-3 rounded-xl transition-all ${selectedRole === role
                ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                : `${config.bgColor} ${config.textColor} hover:opacity-80 border ${config.borderColor}`
                }`}
            >
              <div className="flex items-center gap-2">
                {config.icon}
                <span>{config.label}</span>
                <Badge
                  className={
                    selectedRole === role
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-900/50 text-neutral-300'
                  }
                >
                  {roleStats[role as keyof typeof roleStats]}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {/* 成员列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const roleInfo = roleConfig[member.role];
            const statusInfo = getStatusConfig(member.status);

            return (
              <div
                key={member.id}
                className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:border-amber-500/30 transition-all group"
              >
                {/* 头像和状态 */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusInfo.color} rounded-full border-2 border-neutral-900 flex items-center justify-center`}
                    >
                      {statusInfo.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white truncate mb-1">
                      {member.username}
                    </h3>
                    <Badge
                      className={`${roleInfo.bgColor} ${roleInfo.textColor} text-xs mb-2`}
                    >
                      {roleInfo.icon}
                      <span className="ml-1">{member.title}</span>
                    </Badge>
                    <p className="text-neutral-500 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      加入于 {member.joinDate}
                    </p>
                  </div>
                </div>

                {/* 简介 */}
                {member.bio && (
                  <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                )}

                {/* 职责 */}
                <div className="mb-4">
                  <h4 className="text-neutral-400 text-xs uppercase tracking-wide mb-2">
                    职责范围
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.responsibilities.map((resp, index) => (
                      <Badge
                        key={index}
                        className="bg-neutral-700/50 text-neutral-300 text-xs"
                      >
                        {resp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-neutral-700/50 mb-4" />

                {/* 统计数据 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {member.stats.handledTickets !== undefined && (
                    <div className="text-center p-3 rounded-lg bg-neutral-900/30">
                      <div className="text-amber-400 text-lg">
                        {member.stats.handledTickets}
                      </div>
                      <div className="text-neutral-500 text-xs mt-1">
                        处理工单
                      </div>
                    </div>
                  )}
                  {member.stats.approvedUploads !== undefined && (
                    <div className="text-center p-3 rounded-lg bg-neutral-900/30">
                      <div className="text-green-400 text-lg">
                        {member.stats.approvedUploads}
                      </div>
                      <div className="text-neutral-500 text-xs mt-1">
                        审核上传
                      </div>
                    </div>
                  )}
                  {member.stats.bannedUsers !== undefined && (
                    <div className="text-center p-3 rounded-lg bg-neutral-900/30">
                      <div className="text-red-400 text-lg">
                        {member.stats.bannedUsers}
                      </div>
                      <div className="text-neutral-500 text-xs mt-1">
                        处理违规
                      </div>
                    </div>
                  )}
                  {member.stats.solvedIssues !== undefined && (
                    <div className="text-center p-3 rounded-lg bg-neutral-900/30">
                      <div className="text-blue-400 text-lg">
                        {member.stats.solvedIssues}
                      </div>
                      <div className="text-neutral-500 text-xs mt-1">
                        解决问题
                      </div>
                    </div>
                  )}
                </div>

                {/* 联系按钮 */}
                {member.contactAllowed && (
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    发送消息
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* 招募信息 */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm border border-neutral-700/50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white text-2xl mb-3">加入管理组</h2>
            <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
              我们一直在寻找热心、负责、有能力的成员加入管理团队。如果您愿意为站点的发展贡献力量，欢迎申请加入我们！
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50">
                <h4 className="text-white mb-2">版主</h4>
                <p className="text-neutral-400 text-sm">
                  活跃、有责任心、熟悉相关分区
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50">
                <h4 className="text-white mb-2">上传组</h4>
                <p className="text-neutral-400 text-sm">
                  有制作经验、资源丰富、质量保证
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50">
                <h4 className="text-white mb-2">客服</h4>
                <p className="text-neutral-400 text-sm">
                  耐心友善、熟悉规则、在线时间充足
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25">
              <Mail className="w-4 h-4 mr-2" />
              提交申请
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
