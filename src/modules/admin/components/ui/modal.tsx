import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./button";

/**
 * Modal 组件 Props
 * 模仿 Ant Design Modal 的 API 设计
 */
export interface ModalProps {
  /** 是否显示 Modal */
  open?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 点击确定按钮回调 */
  onOk?: () => void | Promise<void>;
  /** 点击取消按钮回调 */
  onCancel?: () => void;
  /** Modal 标题 */
  title?: React.ReactNode;
  /** Modal 宽度 */
  width?: number | string;
  /** 确定按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 确定按钮 Props */
  okButtonProps?: React.ComponentProps<typeof Button>;
  /** 取消按钮 Props */
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  /** 是否显示底部按钮区 */
  footer?: React.ReactNode | null;
  /** 是否显示关闭图标 */
  closable?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 确定按钮 loading 状态 */
  confirmLoading?: boolean;
  /** 是否居中显示 */
  centered?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子内容 */
  children?: React.ReactNode;
}

/**
 * Modal 组件
 *
 * 基于 Radix UI Dialog 实现，API 设计模仿 Ant Design Modal。
 * 提供统一的弹窗样式和交互体验。
 *
 * @example
 * ```tsx
 * <Modal
 *   open={visible}
 *   title="确认删除"
 *   onOk={handleDelete}
 *   onCancel={() => setVisible(false)}
 *   okButtonProps={{ variant: "danger" }}
 * >
 *   确定要删除该记录吗？
 * </Modal>
 * ```
 */
export function Modal({
  open = false,
  onClose,
  onOk,
  onCancel,
  title,
  width = 520,
  okText = "确定",
  cancelText = "取消",
  okButtonProps,
  cancelButtonProps,
  footer,
  closable = true,
  maskClosable = true,
  confirmLoading = false,
  centered = true,
  className,
  children,
}: ModalProps) {
  // 处理关闭逻辑
  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        onClose?.();
        onCancel?.();
      }
    },
    [onClose, onCancel],
  );

  // 处理确定按钮点击
  const handleOk = React.useCallback(async () => {
    await onOk?.();
  }, [onOk]);

  // 处理取消按钮点击
  const handleCancel = React.useCallback(() => {
    onCancel?.();
    onClose?.();
  }, [onCancel, onClose]);

  // 计算宽度样式
  const widthStyle = typeof width === "number" ? `${width}px` : width;

  // 渲染底部按钮区
  const renderFooter = () => {
    // 如果 footer 为 null，不渲染
    if (footer === null) {
      return null;
    }

    // 如果提供了自定义 footer
    if (footer !== undefined) {
      return <div className="mt-6 flex justify-end gap-2">{footer}</div>;
    }

    // 默认底部按钮
    return (
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="default" onClick={handleCancel} {...cancelButtonProps}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={handleOk} loading={confirmLoading} {...okButtonProps}>
          {okText}
        </Button>
      </div>
    );
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* 遮罩层 */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/45",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          onClick={maskClosable ? handleCancel : undefined}
        />

        {/* 内容区 */}
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 rounded-lg border border-gray-100 bg-white shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            centered
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : "top-[100px] left-1/2 -translate-x-1/2",
            className,
          )}
          style={{ width: widthStyle, maxWidth: "calc(100vw - 32px)" }}
          onPointerDownOutside={(e) => {
            if (!maskClosable) {
              e.preventDefault();
            }
          }}
        >
          {/* 头部区域 */}
          {(title || closable) && (
            <div className="flex items-start justify-between px-6 pt-5 pb-0">
              {title && (
                <DialogPrimitive.Title className="text-base font-semibold text-gray-900">
                  {title}
                </DialogPrimitive.Title>
              )}
              {!title && <div />}
              {closable && (
                <DialogPrimitive.Close asChild>
                  <button
                    className="rounded-sm p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="关闭"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogPrimitive.Close>
              )}
            </div>
          )}

          {/* 内容区域 */}
          <div className="px-6 py-4">{children}</div>

          {/* 底部按钮区 */}
          {renderFooter() && <div className="px-6 pb-4">{renderFooter()}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * 确认对话框快捷方法的 Props
 */
export interface ConfirmModalProps extends Omit<ModalProps, "children"> {
  /** 确认内容 */
  content?: React.ReactNode;
}

/**
 * Modal.confirm 静态方法的配置
 * 注意：由于 React 18+ 的限制，静态方法需要通过 Context 实现
 * 这里提供一个简化的组件形式
 */
export function ConfirmModal({
  content,
  okButtonProps = { variant: "danger" },
  ...props
}: ConfirmModalProps) {
  return (
    <Modal {...props} okButtonProps={okButtonProps}>
      <div className="text-sm text-gray-600">{content}</div>
    </Modal>
  );
}

// 导出底层 Radix 组件供高级定制使用
export const ModalRoot = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;
export const ModalPortal = DialogPrimitive.Portal;
export const ModalOverlay = DialogPrimitive.Overlay;
export const ModalContent = DialogPrimitive.Content;
export const ModalTitle = DialogPrimitive.Title;
export const ModalDescription = DialogPrimitive.Description;

export default Modal;
