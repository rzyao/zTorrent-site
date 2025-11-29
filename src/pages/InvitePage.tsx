import { useState } from 'react';
import { UserPlus, Mail, Copy, Check, Clock, Users, Gift, Sparkles, Calendar, Shield, AlertCircle, Plus, Eye, EyeOff, Send, CheckCircle, XCircle, X, TrendingUp, Download, Upload } from 'lucide-react';

interface InviteCode {
  id: string;
  code: string;
  status: 'unused' | 'used' | 'expired';
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
  expiresAt: string;
}

interface SentInvite {
  id: string;
  code: string;
  recipientName: string;
  recipientEmail: string;
  status: 'registered' | 'pending' | 'expired';
  sentAt: string;
  registeredAt?: string;
  expiresAt: string;
}

interface InvitedUser {
  id: string;
  username: string;
  email: string;
  joinedAt: string;
  uploadData: string;
  downloadData: string;
  shareRatio: string;
  status: 'active' | 'vip';
  inviteCode: string;
}

export function InvitePage() {
  const [activeTab, setActiveTab] = useState<'codes' | 'records' | 'users'>('codes');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<{ [key: string]: boolean }>({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<InviteCode | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  // 模拟用户数据
  const userInviteStats = {
    totalInvites: 15,
    usedInvites: 8,
    remainingInvites: 7,
    invitedUsers: 8,
    magicPoints: 12580,
  };

  // 模拟邀请码数据
  const inviteCodes: InviteCode[] = [
    { id: '1', code: 'MOVIE2024ABC123', status: 'unused', createdAt: '2024-11-20', expiresAt: '2024-12-20' },
    { id: '2', code: 'FILM2024XYZ789', status: 'unused', createdAt: '2024-11-18', expiresAt: '2024-12-18' },
    { id: '3', code: 'CINEMA2024DEF456', status: 'unused', createdAt: '2024-11-15', expiresAt: '2024-12-15' },
    { id: '4', code: 'TORRENT2024STU901', status: 'unused', createdAt: '2024-11-22', expiresAt: '2024-12-22' },
    { id: '5', code: 'STREAM2024VWX234', status: 'unused', createdAt: '2024-11-25', expiresAt: '2024-12-25' },
  ];

  // 邀请记录（所有状态）
  const inviteRecords: SentInvite[] = [
    { id: '1', code: 'STREAM2024JKL012', recipientName: 'MovieFan88', recipientEmail: 'moviefan88@email.com', status: 'registered', sentAt: '2024-11-05 14:30', registeredAt: '2024-11-08 10:15', expiresAt: '2024-12-05' },
    { id: '2', code: 'VIDEO2024GHI789', recipientName: 'User123', recipientEmail: 'user123@email.com', status: 'registered', sentAt: '2024-11-10 09:20', registeredAt: '2024-11-12 16:45', expiresAt: '2024-12-10' },
    { id: '3', code: 'MOVIE2024ABC456', recipientName: '张三', recipientEmail: 'zhangsan@email.com', status: 'pending', sentAt: '2024-11-20 11:00', expiresAt: '2024-12-20' },
    { id: '4', code: 'FILM2024XYZ123', recipientName: '李四', recipientEmail: 'lisi@email.com', status: 'pending', sentAt: '2024-11-18 15:45', expiresAt: '2024-12-18' },
    { id: '5', code: 'CINEMA2024DEF789', recipientName: '王五', recipientEmail: 'wangwu@email.com', status: 'pending', sentAt: '2024-11-15 13:20', expiresAt: '2024-12-15' },
    { id: '6', code: 'TORRENT2024MNO345', recipientName: 'OldFriend', recipientEmail: 'oldfriend@email.com', status: 'expired', sentAt: '2024-10-01 10:00', expiresAt: '2024-11-01' },
    { id: '7', code: 'CLASSIC2024PQR678', recipientName: '赵六', recipientEmail: 'zhaoliu@email.com', status: 'expired', sentAt: '2024-09-28 14:30', expiresAt: '2024-10-28' },
    { id: '8', code: 'ANIME2024HIJ901', recipientName: 'CinemaLover', recipientEmail: 'cinemalover@email.com', status: 'registered', sentAt: '2024-10-20 16:20', registeredAt: '2024-10-25 09:30', expiresAt: '2024-11-20' },
  ];

  // 我的后宫（被邀请的用户）
  const invitedUsers: InvitedUser[] = [
    { id: '1', username: 'MovieFan88', email: 'moviefan88@email.com', joinedAt: '2024-11-08', uploadData: '2.5 TB', downloadData: '1.2 TB', shareRatio: '2.15', status: 'active', inviteCode: 'STREAM2024JKL012' },
    { id: '2', username: 'User123', email: 'user123@email.com', joinedAt: '2024-11-12', uploadData: '1.8 TB', downloadData: '0.9 TB', shareRatio: '1.85', status: 'active', inviteCode: 'VIDEO2024GHI789' },
    { id: '3', username: 'CinemaLover', email: 'cinemalover@email.com', joinedAt: '2024-10-25', uploadData: '5.2 TB', downloadData: '1.5 TB', shareRatio: '3.42', status: 'active', inviteCode: 'ANIME2024HIJ901' },
    { id: '4', username: 'FilmCollector', email: 'filmcollector@email.com', joinedAt: '2024-10-18', uploadData: '3.1 TB', downloadData: '1.1 TB', shareRatio: '2.68', status: 'active', inviteCode: 'RETRO2024KLM234' },
    { id: '5', username: 'TorrentKing', email: 'torrentking@email.com', joinedAt: '2024-10-10', uploadData: '8.5 TB', downloadData: '2.0 TB', shareRatio: '4.22', status: 'vip', inviteCode: 'MASTER2024NOP567' },
    { id: '6', username: 'SeriesAddict', email: 'seriesaddict@email.com', joinedAt: '2024-09-15', uploadData: '4.8 TB', downloadData: '1.8 TB', shareRatio: '2.95', status: 'active', inviteCode: 'SERIES2024QRS890' },
    { id: '7', username: 'DocuFan', email: 'docufan@email.com', joinedAt: '2024-09-01', uploadData: '6.2 TB', downloadData: '2.1 TB', shareRatio: '3.18', status: 'vip', inviteCode: 'DOCU2024TUV123' },
    { id: '8', username: 'AnimeNinja', email: 'animeninja@email.com', joinedAt: '2024-08-20', uploadData: '7.3 TB', downloadData: '2.5 TB', shareRatio: '3.89', status: 'active', inviteCode: 'NINJA2024WXY456' },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleShowCode = (codeId: string) => {
    setShowCode(prev => ({ ...prev, [codeId]: !prev[codeId] }));
  };

  const maskCode = (code: string) => {
    return code.slice(0, 6) + '••••••••';
  };

  const handleOpenSendModal = (code: InviteCode) => {
    setSelectedCode(code);
    setShowSendModal(true);
    setRecipientName('');
    setRecipientEmail('');
  };

  const handleCloseSendModal = () => {
    setShowSendModal(false);
    setSelectedCode(null);
    setRecipientName('');
    setRecipientEmail('');
  };

  const handleSendInvite = () => {
    // 这里处理发送邀请的逻辑
    console.log('发送邀请给:', recipientName, recipientEmail, '邀请码:', selectedCode?.code);
    handleCloseSendModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unused': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'used': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'expired': return 'bg-neutral-600/20 text-neutral-400 border-neutral-600/30';
      case 'registered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unused': return '未使用';
      case 'used': return '已使用';
      case 'registered': return '已注册';
      case 'pending': return '待注册';
      case 'expired': return '已过期';
      default: return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered': return CheckCircle;
      case 'pending': return Clock;
      case 'expired': return XCircle;
      default: return Clock;
    }
  };

  const unusedCodes = inviteCodes.filter(code => code.status === 'unused');

  return (
    <div className="min-h-screen bg-[#0F171E] pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-3xl">邀请管理</h1>
          </div>
          <p className="text-neutral-400 ml-13">管理您的邀请码，邀请好友加入社区</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">总邀请数</span>
              <Gift className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-white text-3xl">{userInviteStats.totalInvites}</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-green-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">已使用</span>
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-white text-3xl">{userInviteStats.usedInvites}</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">剩余可用</span>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-white text-3xl">{userInviteStats.remainingInvites}</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">后宫人数</span>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-white text-3xl">{invitedUsers.length}</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">魔力值</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-white text-3xl">{userInviteStats.magicPoints.toLocaleString()}</div>
          </div>
        </div>

        {/* 标签栏 */}
        <div className="flex gap-2 mb-6 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'codes'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            我的邀请码
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'records'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            邀请记录
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'users'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            我的后宫
          </button>
        </div>

        {/* 我的邀请码 */}
        {activeTab === 'codes' && (
          <div className="space-y-6">
            {/* 可用邀请码 */}
            <div>
              <h3 className="text-white text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></span>
                可用邀请码 ({unusedCodes.length})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {unusedCodes.map((invite) => (
                  <div
                    key={invite.id}
                    className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 hover:border-green-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <code className="text-white text-lg font-mono bg-neutral-800 px-4 py-2 rounded-lg">
                            {showCode[invite.id] ? invite.code : maskCode(invite.code)}
                          </code>
                          <button
                            onClick={() => toggleShowCode(invite.id)}
                            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                            title={showCode[invite.id] ? '隐藏' : '显示'}
                          >
                            {showCode[invite.id] ? (
                              <EyeOff className="w-4 h-4 text-neutral-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-neutral-400" />
                            )}
                          </button>
                          <span className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(invite.status)}`}>
                            {getStatusText(invite.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>创建于 {invite.createdAt}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>过期于 {invite.expiresAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleCopyCode(invite.code)}
                          className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all flex items-center gap-2"
                        >
                          {copiedCode === invite.code ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenSendModal(invite)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                        >
                          <Send className="w-4 h-4" />
                          <span>发放</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 获取邀请码 */}
            <div>
              <h3 className="text-white text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                获取邀请码
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 魔力值购买 */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-7 h-7 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg mb-1">魔力值兑换</h3>
                        <p className="text-neutral-400 text-sm">使用魔力值直接购买邀请码</p>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-neutral-400 text-sm">价格</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xl">500</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 text-sm">您的魔力值</span>
                        <span className="text-white">{userInviteStats.magicPoints.toLocaleString()}</span>
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span>立即兑换</span>
                    </button>
                  </div>
                </div>

                {/* 系统赠送 */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-green-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-7 h-7 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg mb-1">系统赠送</h3>
                        <p className="text-neutral-400 text-sm">达成成就可获得免费邀请码</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-neutral-300 text-sm">上传量达到 10TB</span>
                        <span className="text-green-400 text-sm">+2 邀请码</span>
                      </div>
                      <div className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-neutral-300 text-sm">分享率达到 3.0</span>
                        <span className="text-green-400 text-sm">+1 邀请码</span>
                      </div>
                      <div className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-neutral-300 text-sm">注册满1年</span>
                        <span className="text-green-400 text-sm">+3 邀请码</span>
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-lg bg-neutral-800 text-neutral-400 cursor-not-allowed">
                      自动发放
                    </button>
                  </div>
                </div>

                {/* VIP特权 */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-7 h-7 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg mb-1">VIP特权</h3>
                        <p className="text-neutral-400 text-sm">VIP会员每月赠送邀请码</p>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-neutral-300">普通VIP</span>
                        <span className="text-purple-400">+5 邀请码/月</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-300">高级VIP</span>
                        <span className="text-purple-400">+10 邀请码/月</span>
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/20">
                      升级VIP
                    </button>
                  </div>
                </div>

                {/* 邀请奖励 */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 flex items-center justify-center flex-shrink-0">
                        <Users className="w-7 h-7 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg mb-1">邀请返利</h3>
                        <p className="text-neutral-400 text-sm">被邀请人达标可获得奖励</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="bg-neutral-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-neutral-300 text-sm">被邀请人上传达 1TB</span>
                          <span className="text-blue-400 text-sm">+1 邀请码</span>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-neutral-300 text-sm">被邀请人升级VIP</span>
                          <span className="text-blue-400 text-sm">+2 邀请码</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-lg bg-neutral-800 text-neutral-400 cursor-not-allowed">
                      自动发放
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 邀请记录 */}
        {activeTab === 'records' && (
          <div>
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-neutral-300">
                  <p>这里显示您已发送给他人的所有邀请记录，包括已注册、待注册和已过期的邀请。</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-800 border-b border-neutral-700">
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">邀请码</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">接收人</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">邮箱</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">发放时间</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">注册/过期时间</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inviteRecords.map((invite) => {
                      const StatusIcon = getStatusIcon(invite.status);
                      return (
                        <tr key={invite.id} className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <code className="text-white font-mono text-sm bg-neutral-800 px-3 py-1.5 rounded">
                              {invite.code}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                                invite.status === 'registered' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                                invite.status === 'pending' ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                                'bg-neutral-700'
                              }`}>
                                {invite.recipientName.charAt(0)}
                              </div>
                              <span className={invite.status === 'expired' ? 'text-neutral-500' : 'text-white'}>
                                {invite.recipientName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-2 ${invite.status === 'expired' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              <Mail className="w-4 h-4" />
                              <span>{invite.recipientEmail}</span>
                            </div>
                          </td>
                          <td className={`px-6 py-4 ${invite.status === 'expired' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            {invite.sentAt}
                          </td>
                          <td className="px-6 py-4">
                            <span className={
                              invite.status === 'registered' ? 'text-green-400' :
                              invite.status === 'pending' ? 'text-neutral-400' :
                              'text-neutral-500'
                            }>
                              {invite.status === 'registered' ? invite.registeredAt : invite.expiresAt}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1.5 w-fit ${getStatusColor(invite.status)}`}>
                              <StatusIcon className="w-4 h-4" />
                              {getStatusText(invite.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 我的后宫 */}
        {activeTab === 'users' && (
          <div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-lg mb-2">后宫成就</h3>
                  <p className="text-neutral-400 text-sm">
                    您已成功邀请 <span className="text-purple-400">{invitedUsers.length}</span> 位用户加入社区，
                    他们的总上传量达到 <span className="text-green-400">39.4 TB</span>，
                    平均分享率 <span className="text-blue-400">3.04</span>。感谢您为社区做出的贡献！
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-800 border-b border-neutral-700">
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">用户名</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">邮箱</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">加入时间</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">上传量</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">下载量</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">分享率</th>
                      <th className="text-left text-neutral-400 px-6 py-4 text-sm">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitedUsers.map((user) => (
                      <tr key={user.id} className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">
                              {user.username.charAt(0)}
                            </div>
                            <span className="text-white">{user.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-400">{user.joinedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-green-400">
                            <Upload className="w-4 h-4" />
                            <span>{user.uploadData}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-blue-400">
                            <Download className="w-4 h-4" />
                            <span>{user.downloadData}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-amber-400">{user.shareRatio}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.status === 'vip' 
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {user.status === 'vip' ? 'VIP会员' : '活跃'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 发放邀请码弹窗 */}
      {showSendModal && selectedCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* 弹窗头部 */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-b border-neutral-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white text-lg">发放邀请码</h3>
                </div>
                <button
                  onClick={handleCloseSendModal}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 space-y-4">
              {/* 邀请码显示 */}
              <div>
                <label className="block text-neutral-400 text-sm mb-2">邀请码</label>
                <code className="block text-white text-lg font-mono bg-neutral-800 px-4 py-3 rounded-lg text-center">
                  {selectedCode.code}
                </code>
              </div>

              {/* 接收人姓名 */}
              <div>
                <label className="block text-neutral-400 text-sm mb-2">
                  接收人姓名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="请输入接收人姓名"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* 接收人邮箱 */}
              <div>
                <label className="block text-neutral-400 text-sm mb-2">
                  接收人邮箱 <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="请输入接收人邮箱"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* 提示信息 */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-400 text-sm">
                    邀请码将通过系统消息发送给接收人，请确保信息准确无误。
                  </p>
                </div>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="bg-neutral-800/50 border-t border-neutral-700 px-6 py-4 flex gap-3">
              <button
                onClick={handleCloseSendModal}
                className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSendInvite}
                disabled={!recipientName || !recipientEmail}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                确认发放
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
