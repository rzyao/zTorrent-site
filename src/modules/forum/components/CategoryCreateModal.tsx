import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/modules/forum/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { useForumTheme } from "../context/ForumThemeContext";
import { cn } from "@/utils/cn";

interface CategoryCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryCreateModal({ open, onClose }: CategoryCreateModalProps) {
  const { colors } = useForumTheme();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[700px]", colors.cardBg, colors.textPrimary)}>
        <DialogHeader>
          <DialogTitle className={colors.titleColor}>新增类别</DialogTitle>
          <DialogDescription className={colors.textSecondary}>
            创建一个新的论坛类别
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          mode="create"
          onSuccess={() => {
            onClose();
          }}
          onCancel={() => {
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

