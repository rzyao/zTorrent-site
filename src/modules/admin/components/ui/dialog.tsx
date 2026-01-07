import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

/**
 * 基础对话框 Root 组件（Radix 映射）
 */
export const Dialog = DialogPrimitive.Root

/**
 * 触发器组件（Radix 映射）
 */
export const DialogTrigger = DialogPrimitive.Trigger

/**
 * 关闭按钮组件（Radix 映射）
 */
export const DialogClose = DialogPrimitive.Close

/**
 * 可选的标题容器，用于组织 `DialogTitle` 与 `DialogDescription`
 * 仅语义容器，无额外行为
 */
export function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

/**
 * Radix 对话框标题组件导出，以满足无障碍要求
 */
export const DialogTitle = DialogPrimitive.Title

/**
 * Radix 对话框描述组件导出，以提供补充说明文本
 */
export const DialogDescription = DialogPrimitive.Description

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * 业务端传入的标题文案；若提供，将渲染为 `DialogTitle`
   */
  title?: string
  /**
   * 是否隐藏可见标题（仍保留无障碍可读性），采用 `sr-only` 实现视觉隐藏
   */
  titleHidden?: boolean
  children?: React.ReactNode
}

/**
 * 对话框内容组件：封装遮罩、内容容器，并在有 `title` 时渲染 Radix 的 `DialogTitle`
 * - 使用 Radix 的 `Title` 组件替代原纯 `div`，修复无障碍警告
 * - 保持现有视觉样式与尺寸，兼容业务页面现有用法
 */
export function DialogContent({ title, titleHidden, children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      {/* 遮罩：30% 黑色透明度（保持与原 AntD 风格一致） */}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30" />
      <DialogPrimitive.Content
        {...props}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[6px] shadow-card w-[520px] md:w-[560px] p-4 border border-[#f0f0f0]"
      >
        {title && (
          <DialogPrimitive.Title
            className={titleHidden ? 'sr-only' : 'text-[16px] font-semibold mb-3 text-[rgba(0,0,0,.88)]'}
          >
            {title}
          </DialogPrimitive.Title>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export default Dialog
