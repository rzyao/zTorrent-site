import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Trash2,
  Lock,
  Unlock,
  Archive,
  ArchiveRestore,
  Pin,
  PinOff,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ForumsTopicsService } from "@/api";
import { useAccess } from "@/context/AccessContext";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/forum/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";

interface TopicAdminMenuProps {
  topicId: string;
  status: {
    isLocked: boolean;
    isPinned: boolean;
    isArchived: boolean;
    isGlobalPinned?: boolean;
  };
  onUpdate: () => void;
  className?: string;
  isAuthor?: boolean;
  bounty?: import("../../../types/bounty").ForumTopicBounty;
  categoryKey?: string;
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/forum/components/ui/dialog";
import { useBountyActions } from "../hooks/useBountyActions";
import { useForumTheme } from "../../../context/ForumThemeContext";
import { Input } from "@/modules/forum/components/ui/input";
import ConfirmDialog from "@/modules/forum/components/ui/ConfirmDialog";
import { Textarea } from "@/modules/forum/components/ui/textarea";
import { Button } from "@/modules/forum/components/ui/button";

export function TopicAdminMenu({
  topicId,
  status,
  onUpdate,
  className,
  isAuthor,
  bounty,
  categoryKey,
}: TopicAdminMenuProps) {
  const navigate = useNavigate();
  const { access } = useAccess();
  const { t } = useLanguage();
  const isAdminOrMod = access?.roles?.includes("admin") || access?.roles?.includes("moderator");

  const [isLoading, setIsLoading] = useState(false);
  const [openBountyDialog, setOpenBountyDialog] = useState(false);
  const [amount, setAmount] = useState("2000");
  const [durationDays, setDurationDays] = useState<number | undefined>(7);
  const [increaseOpen, setIncreaseOpen] = useState(false);
  const [increaseAmount, setIncreaseAmount] = useState("2000");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const CANCEL_REASON_MAX = 200;
  const QUICK_REASONS = [t('forum.bounty.quickReasonMistake'), t('forum.bounty.quickReasonChange'), t('forum.bounty.quickReasonDuplicate'), t('forum.bounty.quickReasonBudget')];
  const bountyActions = useBountyActions(topicId, { onUpdated: onUpdate, categoryKey });
  const { colors } = useForumTheme();

  // 如果没有权限，直接不渲染
  if (!isAdminOrMod && !isAuthor) return null;

  const showSetBounty =
    Boolean(isAuthor && !status.isArchived && !bounty) && categoryKey === "bounty";
  const showIncreaseBounty =
    Boolean(isAuthor && !status.isArchived && bounty && bounty.status === "open") &&
    categoryKey === "bounty";
  const showCancelBounty =
    Boolean(
      isAuthor &&
        !status.isArchived &&
        bounty &&
        bounty.status === "open" &&
        bounty.cancelRequestStatus !== "pending",
    ) && categoryKey === "bounty";
  const showAdminSeparator = isAdminOrMod && (showSetBounty || showIncreaseBounty || showCancelBounty);

  const handleAction = async (
    actionName: string,
    apiCall: () => Promise<any>,
    successMessage: string,
    redirectUrl?: string,
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await apiCall();
      toast.success(successMessage);
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        onUpdate();
      }
    } catch (error: any) {
      // 错误提示已由 Axios 拦截器统一处理，此处仅记录日志
      console.error(`${actionName}${t('forum.admin.failed')}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    // 双重确认
    if (window.confirm(t('forum.admin.confirmDelete'))) {
      handleAction(
        t('forum.admin.delete'),
        () => ForumsTopicsService.topicsControllerAdminRemove({ id: topicId }),
        t('forum.admin.topicDeleted'),
        "/forum/latest",
      );
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="none"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800",
              className,
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wrench className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="border-[#0088CC]/30 bg-white text-neutral-800 shadow-xl dark:bg-[#222222] dark:text-neutral-200"
        >
          {/* 作者：设置悬赏入口（仅在未设置悬赏时可见，且分类为 bounty） */}
          {showSetBounty && (
            <DropdownMenuItem
              className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              onClick={() => {
                if (bounty?.amount) {
                  setAmount(String(bounty.amount));
                }
                setOpenBountyDialog(true);
              }}
            >
              <Pin className="mr-2 h-4 w-4" /> {t('forum.bounty.setBounty')}
            </DropdownMenuItem>
          )}
          {/* 作者：追加悬赏入口（进行中时显示，且分类为 bounty） */}
          {showIncreaseBounty && (
            <DropdownMenuItem
              className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              onClick={() => {
                setIncreaseOpen(true);
              }}
            >
              <Pin className="mr-2 h-4 w-4" /> {t('forum.bounty.increaseBounty')}
            </DropdownMenuItem>
          )}
          {/* 作者：取消悬赏入口（进行中且未在审核时显示，且分类为 bounty） */}
          {showCancelBounty && (
              <DropdownMenuItem
                className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                onClick={() => setCancelOpen(true)}
              >
                <PinOff className="mr-2 h-4 w-4" /> {t('forum.bounty.cancelBounty')}
              </DropdownMenuItem>
            )}

          {/* 管理员操作分隔 */}
          {showAdminSeparator && (
            <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
          )}

          {/* 锁定/解锁 */}
          <DropdownMenuItem
            className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={() =>
              handleAction(
                status.isLocked ? t('forum.admin.open') : t('forum.admin.close'),
                () => ForumsTopicsService.topicsControllerToggleLock({ id: topicId }),
                status.isLocked ? t('forum.admin.topicOpened') : t('forum.admin.topicClosed'),
              )
            }
          >
            {status.isLocked ? (
              <>
                <Unlock className="mr-2 h-4 w-4" /> {t('forum.admin.openTopic')}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" /> {t('forum.admin.closeTopic')}
              </>
            )}
          </DropdownMenuItem>

          {/* 归档/恢复 */}
          <DropdownMenuItem
            className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={() =>
              handleAction(
                status.isArchived ? t('forum.admin.unarchive') : t('forum.admin.archive'),
                () => ForumsTopicsService.topicsControllerToggleArchive({ id: topicId }),
                status.isArchived ? t('forum.admin.topicUnarchived') : t('forum.admin.topicArchived'),
              )
            }
          >
            {status.isArchived ? (
              <>
                <ArchiveRestore className="mr-2 h-4 w-4" /> {t('forum.admin.unarchiveTopic')}
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" /> {t('forum.admin.archiveTopic')}
              </>
            )}
          </DropdownMenuItem>

          {/* 置顶/取消置顶 */}
          <DropdownMenuItem
            className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={() =>
              handleAction(
                status.isPinned ? t('forum.admin.unpin') : t('forum.admin.pin'),
                () => ForumsTopicsService.topicsControllerTogglePin({ id: topicId }),
                status.isPinned ? t('forum.admin.topicUnpinned') : t('forum.admin.topicPinned'),
              )
            }
          >
            {status.isPinned ? (
              <>
                <PinOff className="mr-2 h-4 w-4" /> {t('forum.admin.unpinTopic')}
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" /> {t('forum.admin.pinTopic')}
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />

          {/* 删除 */}
          <DropdownMenuItem
            className="text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20 dark:focus:bg-red-950/20"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t('forum.admin.deleteTopic')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 设置悬赏对话框 */}
      <Dialog open={openBountyDialog} onOpenChange={setOpenBountyDialog}>
        <DialogContent className={`rounded-lg ${colors.cardBg} ${colors.cardBorder}`}>
          <DialogHeader>
            <DialogTitle className={colors.titleColor}>{t('forum.bounty.setBounty')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <label className={`block text-xs ${colors.textMuted}`}>{t('forum.bounty.amountLabel')}</label>
              <Input
                type="number"
                min={2000}
                step={100}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="2000"
                className={`h-9 ${colors.inputBg} ${colors.inputBorder}`}
              />
              <div className={`mt-1 text-xs ${colors.textMuted}`}>{t('forum.bounty.minAmountTip')}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${colors.textMuted}`}>{t('forum.bounty.durationLabel')}</label>
                <Input
                  type="number"
                  max={30}
                  min={1}
                  step={1}
                  value={durationDays ?? ""}
                  onChange={(e) =>
                    setDurationDays(e.target.value ? parseInt(e.target.value, 10) : undefined)
                  }
                  className={`h-9 ${colors.inputBg} ${colors.inputBorder}`}
                />
                <div className={`mt-1 text-xs ${colors.textMuted}`}>{t('forum.bounty.durationTip')}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="cancel" size="sm" onClick={() => setOpenBountyDialog(false)}>
              {t('app.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={async () => {
                const amt = parseInt(amount, 10);
                if (!amount || !/^[0-9]+$/.test(amount) || isNaN(amt) || amt < 2000) {
                  toast.error(t('forum.bounty.minAmountError'));
                  return;
                }
                if (typeof durationDays !== "number" || durationDays < 1 || durationDays > 30) {
                  toast.error(t('forum.bounty.durationError'));
                  return;
                }
                await bountyActions.setBounty({ amount, durationDays });
                setOpenBountyDialog(false);
                setAmount("");
                setDurationDays(7);
              }}
              disabled={
                isLoading ||
                !amount ||
                isNaN(parseInt(amount, 10)) ||
                parseInt(amount, 10) < 2000 ||
                !durationDays ||
                (typeof durationDays === "number" && (durationDays < 1 || durationDays > 30))
              }
            >
              {t('app.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 追加悬赏对话框 */}
      <Dialog open={increaseOpen} onOpenChange={setIncreaseOpen}>
        <DialogContent className={`rounded-lg ${colors.cardBg} ${colors.cardBorder}`}>
          <DialogHeader>
            <DialogTitle className={colors.titleColor}>{t('forum.bounty.increaseBounty')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <label className={`block text-xs ${colors.textMuted}`}>{t('forum.bounty.increaseAmountLabel')}</label>
              <Input
                type="number"
                min={2000}
                step={100}
                value={increaseAmount}
                onChange={(e) => setIncreaseAmount(e.target.value)}
                placeholder="2000"
                className={`h-9 ${colors.inputBg} ${colors.inputBorder}`}
              />
              <div className={`mt-1 text-xs ${colors.textMuted}`}>{t('forum.bounty.minAmountTip')}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="cancel" size="sm" onClick={() => setIncreaseOpen(false)}>
              {t('app.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={async () => {
                const delta = parseInt(increaseAmount, 10);
                if (!increaseAmount || isNaN(delta) || delta < 2000) {
                  toast.error(t('forum.bounty.increaseMinError'));
                  return;
                }
                await bountyActions.increase(String(delta));
                setIncreaseOpen(false);
                setIncreaseAmount("2000");
              }}
              disabled={
                !increaseAmount ||
                isNaN(parseInt(increaseAmount, 10)) ||
                parseInt(increaseAmount, 10) < 2000
              }
            >
              {t('app.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取消悬赏确认 */}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={t('forum.bounty.cancelBounty')}
        content={
          <div className="flex flex-col gap-2">
            <div className={`${colors.textSecondary}`}>
              {t('forum.bounty.cancelDesc')}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_REASONS.map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant="default"
                  size="none"
                  onClick={() => setCancelReason(r)}
                  className="rounded border px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {r}
                </Button>
              ))}
            </div>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t('forum.bounty.cancelReasonPlaceholder')}
              className={`${colors.inputBg} ${colors.inputBorder}`}
              maxLength={CANCEL_REASON_MAX}
            />
            <div className={`text-xs ${colors.textMuted}`}>
              {cancelReason.length}/{CANCEL_REASON_MAX}
            </div>
          </div>
        }
        confirmText={t('forum.bounty.submitRequest')}
        onConfirm={async () => {
          const reason = cancelReason.trim();
          if (reason.length < 5) {
            toast.error(t('forum.bounty.cancelReasonMinError'));
            return;
          }
          await bountyActions.requestCancel(reason);
          setCancelOpen(false);
          setCancelReason("");
        }}
      />
    </>
  );
}
