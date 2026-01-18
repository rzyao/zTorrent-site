import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { Button } from "./button";
import { cn } from "@/utils/cn";
import { useForumTheme } from "../../context/ForumThemeContext";

interface ConfirmDialogProps {
  /** 是否显示弹窗 */
  open: boolean;
  /** 关闭弹窗回调（同时作为取消行为） */
  onClose: () => void;
  /** 确认按钮点击回调，支持异步 */
  onConfirm: () => void | Promise<void>;
  /** 标题文案 */
  title?: string;
  /** 辅助描述（用于无障碍） */
  description?: string;
  /** 主体内容（确认说明） */
  content?: React.ReactNode;
  /** 确认按钮文字 */
  confirmText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 确认按钮 loading 状态（由外部控制） */
  confirmLoading?: boolean;
  /** 确认按钮变体，默认为 danger */
  confirmVariant?: "primary" | "danger" | "destructive";
  /** 自定义类名 */
  className?: string;
}

/**
 * 通用确认弹窗（论坛）
 * - 基于论坛的 Dialog 组件实现，统一样式与交互
 * - 适用于删除、重要变更等需要用户二次确认的场景
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "确认操作",
  description,
  content,
  confirmText = "确定",
  cancelText = "取消",
  confirmLoading = false,
  confirmVariant = "danger",
  className,
}: ConfirmDialogProps) {
  const { colors } = useForumTheme();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={cn("bg-white dark:border-neutral-800 dark:bg-[#1E1E1E]", className)}
      >
        <DialogHeader>
          <DialogTitle className={cn("text-base font-semibold", colors.textPrimary)}>
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className={cn("text-sm", colors.textSecondary)}>{content}</div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="cancel" size="sm" onClick={onClose} aria-label="取消">
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            loading={confirmLoading}
            aria-label="确定"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
