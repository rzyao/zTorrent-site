import { useState, useEffect } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { UserPlus, Mail, Copy, Check, Clock, Users, Gift, Sparkles, Calendar, Shield, AlertCircle, Plus, Eye, EyeOff, Send, CheckCircle, XCircle, X, TrendingUp, Download, Upload } from 'lucide-react';
import { InvitesService } from '@/api';
import { getBonusOverview } from '@/api/custom/bonus';
import { getStoreItems } from '@/api/custom/store';
import type { StoreItem } from '@/api/custom/store';
import { usePurchase } from '@/hooks/usePurchase';
import { PurchaseSuccessModal } from '@/components/purchase/PurchaseSuccessModal';

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
  useDynamicTitle('邀请管理');
  const [activeTab, setActiveTab] = useState<'codes' | 'records' | 'users'>('codes');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<{ [key: string]: boolean }>({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<InviteCode | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [userInviteStats, setUserInviteStats] = useState({ totalInvites: 0, usedInvites: 0, remainingInvites: 0, invitedUsers: 0, magicPoints: 0 });
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [inviteRecords, setInviteRecords] = useState<SentInvite[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [loadedCodes, setLoadedCodes] = useState(false);
  const [loadedRecords, setLoadedRecords] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState(false);
  const { purchase, lastSuccess, clearLastSuccess } = usePurchase();
  const [successOpen, setSuccessOpen] = useState(false);
  const [quotaItems, setQuotaItems] = useState<{ invite_quota?: StoreItem; temp_invite_quota?: StoreItem }>({});
  const [quotaQty, setQuotaQty] = useState<{ permanent: number; temp: number }>({ permanent: 1, temp: 1 });

  const extractData = (resp: any) => {
    const body = resp?.code !== undefined ? resp : resp?.data;
    return body?.data ?? body;
  };
  const formatBytesToTB = (bytes: number) => {
    const tb = bytes / Math.pow(1024, 4);
    return `${tb.toFixed(2)} TB`;
  };
  const formatRatio = (ratio: number) => ratio.toFixed(2);
  const formatDate = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${da} ${hh}:${mm}`;
  };
  const loadOverview = async () => {
    try {
      const resp = await InvitesService.invitesControllerOverview({});
      const data = extractData(resp);
      const bonus = await getBonusOverview();
      const mp = typeof bonus?.balance === 'string' ? parseFloat(bonus.balance) : Number(bonus?.balance || 0);
      setUserInviteStats({
        totalInvites: Number(data?.totalInvites || 0),
        usedInvites: Number(data?.usedInvites || 0),
        remainingInvites: Number(data?.remainingInvites || 0),
        invitedUsers: Number(data?.invitedUsers || 0),
        magicPoints: mp,
      });
    } catch { }
  };
  const loadCodes = async () => {
    try {
      const resp = await InvitesService.invitesControllerListCodes({ page: 1, limit: 50, status: 'unused' as any });
      const data = extractData(resp);
      const items = (data?.items || []).map((it: any) => ({
        id: String(it.id),
        code: String(it.code),
        status: String(it.status) as InviteCode['status'],
        createdAt: formatDate(it.createdAt),
        usedAt: it.usedAt ? formatDate(it.usedAt) : undefined,
        usedBy: it.usedBy ? String(it.usedBy) : undefined,
        expiresAt: formatDate(it.expiresAt),
      }));
      setInviteCodes(items);
      setLoadedCodes(true);
    } catch { }
  };
  const loadRecords = async () => {
    try {
      const resp = await InvitesService.invitesControllerListRecords({ page: 1, limit: 50 });
      const data = extractData(resp);
      const items = (data?.items || []).map((it: any) => ({
        id: String(it.id),
        code: String(it.code),
        recipientName: String(it.recipientName || ''),
        recipientEmail: String(it.recipientEmail || ''),
        status: String(it.status) as SentInvite['status'],
        sentAt: formatDate(it.sentAt),
        registeredAt: it.registeredAt ? formatDate(it.registeredAt) : undefined,
        expiresAt: formatDate(it.expiresAt),
      }));
      setInviteRecords(items);
      setLoadedRecords(true);
    } catch { }
  };
  const loadUsers = async () => {
    try {
      const resp = await InvitesService.invitesControllerMyUsers({ page: 1, limit: 50 });
      const data = extractData(resp);
      const items = (data?.items || []).map((it: any) => ({
        id: String(it.id),
        username: String(it.username),
        email: String(it.email),
        joinedAt: formatDate(it.joinedAt).split(' ')[0],
        uploadData: formatBytesToTB(Number(it.uploadedBytes || 0)),
        downloadData: formatBytesToTB(Number(it.downloadedBytes || 0)),
        shareRatio: formatRatio(Number(it.ratio || 0)),
        status: String(it.status) === 'vip' ? 'vip' : 'active',
        inviteCode: String(it.inviteCode || ''),
      }));
      setInvitedUsers(items);
      setLoadedUsers(true);
    } catch { }
  };
  useEffect(() => {
    loadOverview();
    if (activeTab === 'codes' && !loadedCodes) loadCodes();
    if (activeTab === 'records' && !loadedRecords) loadRecords();
    if (activeTab === 'users' && !loadedUsers) loadUsers();
    if (activeTab === 'codes') {
      getStoreItems({ status: 'active', page: 1, pageSize: 50 })
        .then((items) => {
          const arr = Array.isArray(items) ? items : [];
          setQuotaItems({
            invite_quota: arr.find(i => i.key === 'invite_quota'),
            temp_invite_quota: arr.find(i => i.key === 'temp_invite_quota'),
          });
        })
        .catch(() => { });
    }
  }, [activeTab]);

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
    const codeId = selectedCode?.id;
    InvitesService.invitesControllerSendPrivate({ email: recipientEmail, username: recipientName, codeId })
      .then(() => {
        handleCloseSendModal();
        loadRecords();
        loadCodes();
      })
      .catch(() => { });
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
    <div className="min-h-screen bg-[#0F171E]">
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
            className={`px-6 py-3 transition-all ${activeTab === 'codes'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-neutral-400 hover:text-white'
              }`}
          >
            我的邀请码
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 transition-all ${activeTab === 'records'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-neutral-400 hover:text-white'
              }`}
          >
            邀请记录
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 transition-all ${activeTab === 'users'
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
                {/* 购买永久邀请名额 */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-7 h-7 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg mb-1">购买永久邀请名额</h3>
                        <p className="text-neutral-400 text-sm">购买后永久增加可用邀请名额</p>
                      </div>
                    </div>

                    <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-neutral-400 text-sm">价格</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xl">{quotaItems.invite_quota?.pricePoints ?? '-'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-neutral-400 text-sm">您的魔力值</span>
                        <span className="text-white">{userInviteStats.magicPoints.toLocaleString()}</span>
                      </div>
                      <div>
                        <label className="block text-neutral-400 text-sm mb-1">数量</label>
                        <input type="number" min={1} value={quotaQty.permanent} onChange={(e) => setQuotaQty(s => ({ ...s, permanent: Math.max(1, Number(e.target.value || 1)) }))} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500" />
                      </div>
                      {quotaItems.invite_quota && Number(quotaItems.invite_quota.pricePoints) * quotaQty.permanent > userInviteStats.magicPoints && (
                        <div className="text-red-400 text-sm mt-2">余额不足，请先获取更多魔力值</div>
                      )}
                    </div>

                    <button
                      disabled={!quotaItems.invite_quota || quotaItems.invite_quota.status !== 'active' || (quotaItems.invite_quota && Number(quotaItems.invite_quota.pricePoints) * quotaQty.permanent > userInviteStats.magicPoints)}
                      onClick={async () => {
                        try {
                          if (!quotaItems.invite_quota) return;
                          await purchase({ itemKey: 'invite_quota', quantity: quotaQty.permanent }, { refreshBonus: true, onRefresh: async () => { await loadOverview(); } });
                          setSuccessOpen(true);
                        } catch { }
                      }}
                      className={`w-full py-3 rounded-lg ${!quotaItems.invite_quota || quotaItems.invite_quota.status !== 'active' || (quotaItems.invite_quota && Number(quotaItems.invite_quota.pricePoints) * quotaQty.permanent > userInviteStats.magicPoints) ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20'} flex items-center justify-center gap-2`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>购买永久名额</span>
                    </button>
                  </div>
                </div>

                {/* 购买临时邀请名额 */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-7 h-7 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg mb-1">购买临时邀请名额</h3>
                        <p className="text-neutral-400 text-sm">购买后增加临时邀请名额（存在有效期）</p>
                      </div>
                    </div>

                    <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-neutral-400 text-sm">价格</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xl">{quotaItems.temp_invite_quota?.pricePoints ?? '-'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify之间 mb-2">
                        <span className="text-neutral-400 text-sm">您的魔力值</span>
                        <span className="text-white">{userInviteStats.magicPoints.toLocaleString()}</span>
                      </div>
                      <div>
                        <label className="block text-neutral-400 text-sm mb-1">数量</label>
                        <input type="number" min={1} value={quotaQty.temp} onChange={(e) => setQuotaQty(s => ({ ...s, temp: Math.max(1, Number(e.target.value || 1)) }))} className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text白色 outline-none focus:border-amber-500" />
                      </div>
                      {quotaItems.temp_invite_quota && Number(quotaItems.temp_invite_quota.pricePoints) * quotaQty.temp > userInviteStats.magicPoints && (
                        <div className="text-red-400 text-sm mt-2">余额不足，请先获取更多魔力值</div>
                      )}
                    </div>

                    <button
                      disabled={!quotaItems.temp_invite_quota || quotaItems.temp_invite_quota.status !== 'active' || (quotaItems.temp_invite_quota && Number(quotaItems.temp_invite_quota.pricePoints) * quotaQty.temp > userInviteStats.magicPoints)}
                      onClick={async () => {
                        try {
                          if (!quotaItems.temp_invite_quota) return;
                          await purchase({ itemKey: 'temp_invite_quota', quantity: quotaQty.temp }, { refreshBonus: true, onRefresh: async () => { await loadOverview(); } });
                          setSuccessOpen(true);
                        } catch { }
                      }}
                      className={`w-full py-3 rounded-lg ${!quotaItems.temp_invite_quota || quotaItems.temp_invite_quota.status !== 'active' || (quotaItems.temp_invite_quota && Number(quotaItems.temp_invite_quota.pricePoints) * quotaQty.temp > userInviteStats.magicPoints) ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20'} flex items-center justify-center gap-2`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>购买临时名额</span>
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
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${invite.status === 'registered' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
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
                          <span className={`px-2 py-1 rounded text-xs ${user.status === 'vip'
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
      <PurchaseSuccessModal open={successOpen} onOpenChange={(v) => { setSuccessOpen(v); if (!v) clearLastSuccess(); }} payload={lastSuccess} />
    </div>
  );
}
