import React from "react";
import { cn } from "@/utils/cn";

interface EditorToggleSwitchProps {
  /** 当前是否为富文本模式 (true = 富文本, false = Markdown) */
  isRichText: boolean;
  /** 切换模式的回调 */
  onToggle: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  className?: string;
}

/**
 * 编辑器模式切换开关
 * 参考 Discourse: composer/toggle-switch.gjs + composer-toggle-switch.scss
 *
 * 样式变量 (来自 Discourse):
 * --toggle-switch-width: 52px
 * --toggle-switch-height: 26px
 *
 * 功能：在 Markdown 模式和富文本编辑器模式之间切换
 * 快捷键：Ctrl+M
 */
export const EditorToggleSwitch: React.FC<EditorToggleSwitchProps> = ({
  isRichText,
  onToggle,
  disabled = false,
  className,
}) => {
  const label = isRichText ? "切换到 Markdown 模式 (Ctrl+M)" : "切换到富文本模式 (Ctrl+M)";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isRichText}
      aria-label={label}
      aria-keyshortcuts="Ctrl+M"
      title={label}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        // 基础样式 (来自 Discourse)
        "composer-toggle-switch relative flex items-center justify-center border-0 bg-transparent p-0",
        // 禁用状态
        disabled && "cursor-not-allowed opacity-50",
        // 自定义类
        className,
      )}
      style={
        {
          // CSS 变量定义
          "--toggle-switch-width": "52px",
          "--toggle-switch-height": "26px",
        } as React.CSSProperties
      }
    >
      {/* Slider 容器 */}
      <span
        className={cn(
          "composer-toggle-switch__slider relative inline-block rounded align-middle transition-colors duration-200",
          // 背景色
          "border border-gray-200 bg-white hover:bg-gray-50 dark:border-transparent dark:bg-neutral-700 dark:hover:bg-neutral-600",
          // 尺寸
          "h-[26px] w-[52px]",
        )}
      >
        {/* 滑块指示器 (::before 伪元素用 span 模拟) */}
        <span
          className={cn(
            "absolute top-[2px] block rounded shadow transition-transform duration-200 ease-in-out",
            // 尺寸: height = 26px - 4px = 22px, width 同
            "h-[22px] w-[22px]",
            // 背景色
            "bg-blue-600/10 dark:bg-sky-500/30",
            // 阴影
            "shadow-[0_1px_2px_1px_rgba(37,99,235,0.1)] dark:shadow-[0_1px_2px_1px_rgba(56,189,248,0.2)]",
            // 位置动画
            isRichText
              ? "translate-x-[26px]" // 右侧: 52px - 26px = 26px
              : "translate-x-[2px]", // 左侧
          )}
        />

        {/* Markdown 图标 (左侧) */}
        <span
          className={cn(
            "composer-toggle-switch__left-icon absolute top-0 left-[2px] inline-flex h-full w-[22px] items-center justify-center transition-colors duration-200",
            !isRichText ? "text-blue-600 dark:text-white" : "text-gray-400 dark:text-neutral-400",
          )}
          aria-hidden="true"
        >
          {/* fab-markdown 图标的简化版本 */}
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <text x="0" y="12" fontSize="10" fontWeight="bold">
              M↓
            </text>
          </svg>
        </span>

        {/* 富文本图标 (右侧) */}
        <span
          className={cn(
            "composer-toggle-switch__right-icon absolute top-0 right-[2px] inline-flex h-full w-[22px] items-center justify-center transition-colors duration-200",
            isRichText ? "text-blue-600 dark:text-white" : "text-gray-400 dark:text-neutral-400",
          )}
          aria-hidden="true"
        >
          {/* "A" 图标 */}
          <span className="text-sm font-bold">A</span>
        </span>
      </span>
    </button>
  );
};
