import { useState } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { Send, Users } from 'lucide-react';
import { InviteHeader } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { InviteTabBar } from './components/TabBar';
import { CodesList } from './components/CodesList';
import { AcquireSection } from './components/AcquireSection';
import { RecordsTable } from './components/RecordsTable';
import { UsersTable } from './components/UsersTable';
import { SendInviteModal } from './components/SendInviteModal';
import { PurchaseConfirmModal } from './components/PurchaseConfirmModal';
import type { InviteCode } from './types';
import { InvitesService } from '@/api/services/InvitesService';
import { usePurchase } from '@/hooks/usePurchase';
import { PurchaseSuccessModal } from '@/components/purchase/PurchaseSuccessModal';
import { useInviteOverview } from './hooks/useInviteOverview';
import { useInviteCodes } from './hooks/useInviteCodes';
import { useInviteRecords } from './hooks/useInviteRecords';
import { useInvitedUsers } from './hooks/useInvitedUsers';
import { useInviteStoreQuota } from './hooks/useInviteStoreQuota';


export function InvitePage() {
  useDynamicTitle('邀请管理');
  const [activeTab, setActiveTab] = useState<'codes' | 'records' | 'users'>('codes');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<{ [key: string]: boolean }>({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<InviteCode | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const { overview: userInviteStats, refetch: refetchOverview } = useInviteOverview(true);
  const { codes: inviteCodes, refetch: refetchCodes } = useInviteCodes(activeTab === 'codes');
  const { records: inviteRecords, refetch: refetchRecords } = useInviteRecords(activeTab === 'records');
  const { users: invitedUsers } = useInvitedUsers(activeTab === 'users');
  const { purchase, lastSuccess, clearLastSuccess } = usePurchase();
  const [successOpen, setSuccessOpen] = useState(false);
  const { quotaItems } = useInviteStoreQuota(activeTab === 'codes');
  const [quotaQty, setQuotaQty] = useState<{ permanent: number; temp: number }>({ permanent: 1, temp: 1 });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<'permanent' | 'temp'>('permanent');
  const [submittingPurchase, setSubmittingPurchase] = useState(false);




  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleShowCode = (codeId: string) => {
    setShowCode(prev => ({ ...prev, [codeId]: !prev[codeId] }));
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
        refetchRecords();
        refetchCodes();
      })
      .catch(() => { });
  };



  const unusedCodes = inviteCodes.filter(code => code.status === 'unused');

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <InviteHeader />

        <StatsCards
          totalInvites={userInviteStats.totalInvites}
          usedInvites={userInviteStats.usedInvites}
          remainingInvites={userInviteStats.remainingInvites}
          magicPoints={userInviteStats.magicPoints}
          invitedUsersCount={invitedUsers.length}
        />

        <InviteTabBar activeTab={activeTab} onChange={setActiveTab} />

        {/* 我的邀请码 */}
        {activeTab === 'codes' && (
          <div className="space-y-6">
            <CodesList
              unusedCodes={unusedCodes}
              copiedCode={copiedCode}
              showCodeMap={showCode}
              onToggleShow={toggleShowCode}
              onCopy={handleCopyCode}
              onOpenSend={handleOpenSendModal}
            />

            {/* 获取邀请码 */}
            <div>
              <h3 className="text-white text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                获取邀请码
              </h3>
              <AcquireSection
                quotaItems={quotaItems}
                magicPoints={userInviteStats.magicPoints}
                permanentQty={quotaQty.permanent}
                tempQty={quotaQty.temp}
                onPermanentQtyChange={(v) => setQuotaQty(s => ({ ...s, permanent: v }))}
                onTempQtyChange={(v) => setQuotaQty(s => ({ ...s, temp: v }))}
                onPurchasePermanent={() => { setConfirmType('permanent'); setConfirmOpen(true); }}
                onPurchaseTemp={() => { setConfirmType('temp'); setConfirmOpen(true); }}
              />
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

            <RecordsTable records={inviteRecords} />
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

            <UsersTable users={invitedUsers} />
          </div>
        )}
      </div>

      <SendInviteModal
        open={showSendModal}
        selectedCode={selectedCode}
        recipientName={recipientName}
        recipientEmail={recipientEmail}
        onChangeName={setRecipientName}
        onChangeEmail={setRecipientEmail}
        onCancel={handleCloseSendModal}
        onConfirm={handleSendInvite}
      />
      <PurchaseConfirmModal
        open={confirmOpen}
        type={confirmType}
        quantity={confirmType === 'permanent' ? quotaQty.permanent : quotaQty.temp}
        unitPrice={confirmType === 'permanent' ? quotaItems.invite_quota?.pricePoints : quotaItems.temp_invite_quota?.pricePoints}
        magicPoints={userInviteStats.magicPoints}
        submitting={submittingPurchase}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          try {
            setSubmittingPurchase(true);
            if (confirmType === 'permanent') {
              if (!quotaItems.invite_quota) return;
              await purchase({ itemKey: 'invite_quota', quantity: quotaQty.permanent }, { refreshBonus: true, onRefresh: async () => { await refetchOverview(); } });
            } else {
              if (!quotaItems.temp_invite_quota) return;
              await purchase({ itemKey: 'temp_invite_quota', quantity: quotaQty.temp }, { refreshBonus: true, onRefresh: async () => { await refetchOverview(); } });
            }
            await refetchCodes();
            setConfirmOpen(false);
            setSuccessOpen(true);
          } catch { }
          finally {
            setSubmittingPurchase(false);
          }
        }}
      />
      <PurchaseSuccessModal open={successOpen} onOpenChange={(v) => { setSuccessOpen(v); if (!v) clearLastSuccess(); }} payload={lastSuccess} />
    </div>
  );
}

