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
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/modules/forum/components/ui/dialog";
import { useBountyActions } from "../hooks/useBountyActions";
import { useForumTheme } from "../../../context/ForumThemeContext";
import { Input } from "@/modules/forum/components/ui/input";
import ConfirmDialog from "@/modules/forum/components/ui/ConfirmDialog";
import { Textarea } from "@/modules/forum/components/ui/textarea";

export function TopicAdminMenu({ topicId, status, onUpdate, className, isAuthor, bounty }: TopicAdminMenuProps) {
  const navigate = useNavigate();
  const { access } = useAccess();
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
  const QUICK_REASONS = ["误操作", "需求变更", "重复发帖", "预算调整"];
  const bountyActions = useBountyActions(topicId, { onUpdated: onUpdate });
  const { colors } = useForumTheme();

  // 如果没有权限，直接不渲染
  if (!isAdminOrMod && !isAuthor) return null;

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
      console.error(`${actionName}失败:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    // 双重确认
    if (window.confirm("确定要删除此话题吗？此操作将不可恢复。")) {
      handleAction(
        "删除",
        () => ForumsTopicsService.topicsControllerAdminRemove({ id: topicId }),
        "话题已删除",
        "/forum/latest",
      );
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800",
              className,
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wrench className="h-4 w-4" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="border-[#0088CC]/30 bg-white text-neutral-800 shadow-xl dark:bg-[#222222] dark:text-neutral-200"
        >
          {/* 作者：设置悬赏入口（仅在未设置悬赏时可见） */}
          {isAuthor && !status.isArchived && !bounty && (
            <DropdownMenuItem
              className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              onClick={() => {
                if (bounty?.amount) {
                  setAmount(String(bounty.amount));
                }
                setOpenBountyDialog(true);
              }}
            >
              <Pin className="mr-2 h-4 w-4" /> 设置悬赏
            </DropdownMenuItem>
          )}
          {/* 作者：追加悬赏入口（进行中时显示） */}
          {isAuthor && !status.isArchived && bounty && bounty.status === "open" && (
            <DropdownMenuItem
              className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              onClick={() => {
                setIncreaseOpen(true);
              }}
            >
              <Pin className="mr-2 h-4 w-4" /> 追加悬赏
            </DropdownMenuItem>
          )}
          {/* 作者：取消悬赏入口（进行中且未在审核时显示） */}
          {isAuthor &&
            !status.isArchived &&
            bounty &&
            bounty.status === "open" &&
            bounty.cancelRequestStatus !== "pending" && (
              <DropdownMenuItem
                className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                onClick={() => setCancelOpen(true)}
              >
                <PinOff className="mr-2 h-4 w-4" /> 取消悬赏
              </DropdownMenuItem>
            )}

          {/* 管理员操作分隔 */}
          {isAdminOrMod && <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />}

          {/* 锁定/解锁 */}
          <DropdownMenuItem
            className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={() =>
              handleAction(
                status.isLocked ? "打开" : "关闭",
                () => ForumsTopicsService.topicsControllerToggleLock({ id: topicId }),
                status.isLocked ? "话题已打开" : "话题已关闭",
              )
            }
          >
            {status.isLocked ? (
              <>
                <Unlock className="mr-2 h-4 w-4" /> 打开话题
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" /> 关闭话题
              </>
            )}
          </DropdownMenuItem>

          {/* 归档/恢复 */}
          <DropdownMenuItem
            className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={() =>
              handleAction(
                status.isArchived ? "取消归档" : "归档",
                () => ForumsTopicsService.topicsControllerToggleArchive({ id: topicId }),
                status.isArchived ? "话题已取消归档" : "话题已归档",
              )
            }
          >
            {status.isArchived ? (
              <>
                <ArchiveRestore className="mr-2 h-4 w-4" /> 取消归档
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" /> 归档话题
              </>
            )}
          </DropdownMenuItem>

          {/* 置顶/取消置顶 */}
          <DropdownMenuItem
            className="hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={() =>
              handleAction(
                status.isPinned ? "取消置顶" : "置顶",
                () => ForumsTopicsService.topicsControllerTogglePin({ id: topicId }),
                status.isPinned ? "话题已取消置顶" : "话题已置顶",
              )
            }
          >
            {status.isPinned ? (
              <>
                <PinOff className="mr-2 h-4 w-4" /> 取消置顶
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" /> 置顶话题
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />

          {/* 删除 */}
          <DropdownMenuItem
            className="text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20 dark:focus:bg-red-950/20"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> 删除话题
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 设置悬赏对话框 */}
      <Dialog open={openBountyDialog} onOpenChange={setOpenBountyDialog}>
        <DialogContent className={`rounded-lg ${colors.cardBg} ${colors.cardBorder}`}>
          <DialogHeader>
            <DialogTitle className={colors.titleColor}>设置悬赏</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <label className={`block text-xs ${colors.textMuted}`}>金额（正整数）</label>
              <Input
                type="number"
                min={2000}
                step={100}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="2000"
                className={` h-9 ${colors.inputBg} ${colors.inputBorder}`}
              />
              <div className={`mt-1 text-xs ${colors.textMuted}`}>最低 2000，建议按百位递增</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${colors.textMuted}`}>期限（天）</label>
                <Input
                  type="number"
                  max={30}
                  min={1}
                  step={1}
                  value={durationDays ?? ""}
                  onChange={(e) =>
                    setDurationDays(e.target.value ? parseInt(e.target.value, 10) : undefined)
                  }
                  className={` h-9 ${colors.inputBg} ${colors.inputBorder}`}
                />
                <div className={`mt-1 text-xs ${colors.textMuted}`}>建议 7 天，上限 30 天</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              className={`rounded px-3 py-1 text-sm ${colors.buttonSecondary}`}
              onClick={() => setOpenBountyDialog(false)}
            >
              取消
            </button>
            <button
              className={`rounded px-3 py-1 text-sm ${colors.buttonPrimary} disabled:opacity-60 disabled:cursor-not-allowed`}
              onClick={async () => {
                const amt = parseInt(amount, 10);
                if (!amount || !/^[0-9]+$/.test(amount) || isNaN(amt) || amt < 2000) {
                  toast.error("金额不能低于 2000");
                  return;
                }
                if (typeof durationDays !== "number" || durationDays < 1 || durationDays > 30) {
                  toast.error("期限需在 1-30 天范围内");
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
              提交
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 追加悬赏对话框 */}
      <Dialog open={increaseOpen} onOpenChange={setIncreaseOpen}>
        <DialogContent className={`rounded-lg ${colors.cardBg} ${colors.cardBorder}`}>
          <DialogHeader>
            <DialogTitle className={colors.titleColor}>追加悬赏</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <label className={`block text-xs ${colors.textMuted}`}>追加金额（正整数）</label>
              <Input
                type="number"
                min={2000}
                step={100}
                value={increaseAmount}
                onChange={(e) => setIncreaseAmount(e.target.value)}
                placeholder="2000"
                className={` h-9 ${colors.inputBg} ${colors.inputBorder}`}
              />
              <div className={`mt-1 text-xs ${colors.textMuted}`}>最低 2000，建议按百位递增</div>
            </div>
          </div>
          <DialogFooter>
            <button
              className={`rounded px-3 py-1 text-sm ${colors.buttonSecondary}`}
              onClick={() => setIncreaseOpen(false)}
            >
              取消
            </button>
            <button
              className={`rounded px-3 py-1 text-sm ${colors.buttonPrimary} disabled:opacity-60 disabled:cursor-not-allowed`}
              onClick={async () => {
                const delta = parseInt(increaseAmount, 10);
                if (!increaseAmount || isNaN(delta) || delta < 2000) {
                  toast.error("追加金额不能低于 2000");
                  return;
                }
                await bountyActions.increase(String(delta));
                setIncreaseOpen(false);
                setIncreaseAmount("2000");
              }}
              disabled={!increaseAmount || isNaN(parseInt(increaseAmount, 10)) || parseInt(increaseAmount, 10) < 2000}
            >
              提交
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取消悬赏确认 */}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="取消悬赏"
        content={
          <div className="flex flex-col gap-2">
            <div className={`${colors.textSecondary}`}>
              提交取消申请后需管理员审核通过才会退回预占金额。请填写取消理由：
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setCancelReason(r)}
                  className="rounded border px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {r}
                </button>
              ))}
            </div>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="请输入取消理由（不少于 5 个字）"
              className={`${colors.inputBg} ${colors.inputBorder}`}
              maxLength={CANCEL_REASON_MAX}
            />
            <div className={`text-xs ${colors.textMuted}`}>{cancelReason.length}/{CANCEL_REASON_MAX}</div>
          </div>
        }
        confirmText="提交申请"
        onConfirm={async () => {
          const reason = cancelReason.trim();
          if (reason.length < 5) {
            toast.error("请填写至少 5 个字的取消理由");
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
