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
}

export function TopicAdminMenu({ topicId, status, onUpdate, className }: TopicAdminMenuProps) {
  const navigate = useNavigate();
  const { access } = useAccess();
  const isAdminOrMod = access?.roles?.includes("admin") || access?.roles?.includes("moderator");

  const [isLoading, setIsLoading] = useState(false);

  // 如果没有权限，直接不渲染
  if (!isAdminOrMod) return null;

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
        className="w-48 border-[#0088CC]/30 bg-white text-neutral-800 shadow-xl dark:bg-[#222222] dark:text-neutral-200"
      >
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
  );
}
