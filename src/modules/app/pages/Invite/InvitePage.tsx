import { useState } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { useLanguage } from "@/hooks/useLanguage";
import { Send, Users } from "lucide-react";
import { InviteHeader } from "./components/Header";
import { StatsCards } from "./components/StatsCards";
import { InviteTabBar } from "./components/TabBar";
import { CodesList } from "./components/CodesList";
import { AcquireSection } from "./components/AcquireSection";
import { RecordsTable } from "./components/RecordsTable";
import { UsersTable } from "./components/UsersTable";
import { SendInviteModal } from "./components/SendInviteModal";
import { PurchaseConfirmModal } from "./components/PurchaseConfirmModal";
import type { InviteCode } from "./types";
import { Service } from "@/api/services/Service";
import { usePurchase } from "@/modules/app/hooks/usePurchase";
import { PurchaseSuccessModal } from "@/modules/app/components/purchase/PurchaseSuccessModal";
import { useInviteOverview } from "./hooks/useInviteOverview";
import { useInviteCodes } from "./hooks/useInviteCodes";
import { useInviteRecords } from "./hooks/useInviteRecords";
import { useInvitedUsers } from "./hooks/useInvitedUsers";
import { useInviteStoreQuota } from "./hooks/useInviteStoreQuota";

export default function InvitePage() {
  const { t } = useLanguage();
  useDynamicTitle(t('invite.title'));
  const [activeTab, setActiveTab] = useState<"codes" | "records" | "users">("codes");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<{ [key: string]: boolean }>({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<InviteCode | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const { overview: userInviteStats, refetch: refetchOverview } = useInviteOverview(true);
  const { codes: inviteCodes, refetch: refetchCodes } = useInviteCodes(activeTab === "codes");
  const { records: inviteRecords, refetch: refetchRecords } = useInviteRecords(
    activeTab === "records",
  );
  const { users: invitedUsers } = useInvitedUsers(activeTab === "users");
  const { purchase, lastSuccess, clearLastSuccess } = usePurchase();
  const [successOpen, setSuccessOpen] = useState(false);
  const { quotaItems } = useInviteStoreQuota(activeTab === "codes");
  const [quotaQty, setQuotaQty] = useState<{ permanent: number; temp: number }>({
    permanent: 1,
    temp: 1,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"permanent" | "temp">("permanent");
  const [submittingPurchase, setSubmittingPurchase] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleShowCode = (codeId: string) => {
    setShowCode((prev) => ({ ...prev, [codeId]: !prev[codeId] }));
  };

  const handleOpenSendModal = (code: InviteCode) => {
    setSelectedCode(code);
    setShowSendModal(true);
    setRecipientName("");
    setRecipientEmail("");
  };

  const handleCloseSendModal = () => {
    setShowSendModal(false);
    setSelectedCode(null);
    setRecipientName("");
    setRecipientEmail("");
  };

  const handleSendInvite = () => {
    const codeId = selectedCode?.id;
    Service.inviteCoreControllerSendPrivate({
      email: recipientEmail,
      username: recipientName,
      codeId,
    })
      .then(() => {
        handleCloseSendModal();
        refetchRecords();
        refetchCodes();
      })
      .catch(() => {});
  };

  const unusedCodes = inviteCodes.filter((code) => code.status === "unused");

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
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
        {activeTab === "codes" && (
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
              <h3 className="mb-4 flex items-center gap-2 text-lg text-white">
                <span className="h-5 w-1 rounded-full bg-linear-to-b from-amber-500 to-orange-600"></span>
                {t('invite.getInviteCode')}
              </h3>
              <AcquireSection
                quotaItems={quotaItems}
                magicPoints={userInviteStats.magicPoints}
                permanentQty={quotaQty.permanent}
                tempQty={quotaQty.temp}
                onPermanentQtyChange={(v) => setQuotaQty((s) => ({ ...s, permanent: v }))}
                onTempQtyChange={(v) => setQuotaQty((s) => ({ ...s, temp: v }))}
                onPurchasePermanent={() => {
                  setConfirmType("permanent");
                  setConfirmOpen(true);
                }}
                onPurchaseTemp={() => {
                  setConfirmType("temp");
                  setConfirmOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* 邀请记录 */}
        {activeTab === "records" && (
          <div>
            <div className="mb-6 rounded-xl border border-blue-500/20 bg-linear-to-r from-blue-500/10 to-cyan-600/10 p-4">
              <div className="flex items-start gap-3">
                <Send className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                <div className="text-sm text-neutral-300">
                  <p>{t('invite.recordsDescription')}</p>
                </div>
              </div>
            </div>

            <RecordsTable records={inviteRecords} />
          </div>
        )}

        {/* 我的后宫 */}
        {activeTab === "users" && (
          <div>
            <div className="mb-6 rounded-xl border border-purple-500/20 bg-linear-to-r from-purple-500/10 to-pink-600/10 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-pink-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg text-white">{t('invite.achievement')}</h3>
                  <p className="text-sm text-neutral-400">
                    {t('invite.achievementDesc', { count: invitedUsers.length, upload: '39.4 TB', ratio: '3.04' })}
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
        quantity={confirmType === "permanent" ? quotaQty.permanent : quotaQty.temp}
        unitPrice={
          confirmType === "permanent"
            ? quotaItems.invite_quota?.pricePoints
            : quotaItems.temp_invite_quota?.pricePoints
        }
        magicPoints={userInviteStats.magicPoints}
        submitting={submittingPurchase}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          try {
            setSubmittingPurchase(true);
            if (confirmType === "permanent") {
              if (!quotaItems.invite_quota) return;
              await purchase(
                { itemKey: "invite_quota", quantity: quotaQty.permanent },
                {
                  refreshBonus: true,
                  onRefresh: async () => {
                    await refetchOverview();
                  },
                },
              );
            } else {
              if (!quotaItems.temp_invite_quota) return;
              await purchase(
                { itemKey: "temp_invite_quota", quantity: quotaQty.temp },
                {
                  refreshBonus: true,
                  onRefresh: async () => {
                    await refetchOverview();
                  },
                },
              );
            }
            await refetchCodes();
            setConfirmOpen(false);
            setSuccessOpen(true);
          } catch {
          } finally {
            setSubmittingPurchase(false);
          }
        }}
      />
      <PurchaseSuccessModal
        open={successOpen}
        onOpenChange={(v) => {
          setSuccessOpen(v);
          if (!v) clearLastSuccess();
        }}
        payload={lastSuccess}
      />
    </div>
  );
}
