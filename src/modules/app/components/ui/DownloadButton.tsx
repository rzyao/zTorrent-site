import React from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { useDownloadStatusStore } from "@/modules/app/stores/downloadStatusStore";

const downloadButtonVariants = cva(
  "group relative flex items-center justify-center gap-2 rounded-2xl border-[0.5px] transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      size: "sm", // 保持原来的默认高度 h-8 对应 sm，或者如果想统一为和 ToggleButton 一样的默认 h-10，则设为 md。
      // 原代码是 h-8, px-3, text-sm。所以这里 sm 最接近原版。
      // 修正：用户可能希望默认也是 md (h-10) 以匹配 ToggleButton。
      // 既然用户之前是在 SeriesDetail 页面对比，那里是 h-10。
      // 但为了不破坏 ListView 里的布局（那里可能需要小点的），我先把默认设为 sm (h-8) 并在详情页显式用 md。
      // 或者，既然用户明确要求"设置三种size"，我定义 sm=h-8, md=h-10, lg=h-12。
    },
  },
);

export interface DownloadButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    VariantProps<typeof downloadButtonVariants> {
  /** 种子 ID，用于跟踪下载状态 */
  torrentId: string;
  /** 点击下载时的回调 */
  onDownload?: () => void;
  /** 各状态下的文案配置 */
  labels?: {
    idle: string;
    loading: string;
    success: string;
  };
}

/**
 * 极简下载按钮 (DownloadButton)
 * 状态由全局 Store 管理，支持跨组件同步
 *
 * 状态流转: Idle -> Loading -> Success -> Idle
 */
export function DownloadButton({
  className,
  torrentId,
  onDownload,
  labels = {
    idle: "下载",
    loading: "下载中...",
    success: "已下载",
  },
  disabled,
  size = "sm", // 默认为 sm (h-8)，与之前保持一致。
  ...props
}: DownloadButtonProps) {
  // 从全局 Store 获取当前种子的下载状态
  const status = useDownloadStatusStore((state) => state.getStatus(torrentId));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 阻止冒泡
    e.stopPropagation();

    if (status !== "idle" || disabled) return;

    // 触发下载回调（状态更新由外部通过 Store 控制）
    onDownload?.();
  };

  // 根据 size 调整 icon 尺寸
  const iconSize = size === "sm" ? 16 : size === "lg" ? 20 : 18;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || status !== "idle"}
      className={cn(
        downloadButtonVariants({ size }),
        // Idle State
        status === "idle" &&
          "cursor-pointer border-neutral-500/20 bg-amber-100/10 text-[#d4a733] hover:border-amber-500/70 hover:bg-amber-500/10 hover:text-[#e8bc4a]",
        // Loading State
        status === "loading" &&
          "cursor-not-allowed border-[#92702a]/30 bg-[#92702a]/10 text-[#92702a]",
        // Success State
        status === "success" && "border-green-500/30 bg-green-500/20 text-green-500",
        className,
      )}
      {...props}
    >
      {/* 图标区域 */}
      <div
        className={cn(
          "relative flex items-center justify-center",
          `h-${iconSize / 4} w-${iconSize / 4}`,
        )}
      >
        {status === "idle" && <Download size={iconSize} />}
        {status === "loading" && <Loader2 size={iconSize} className="animate-spin" />}
        {status === "success" && (
          <Check size={iconSize} className="animate-in zoom-in duration-300" />
        )}
      </div>

      {/* 文字区域 */}
      <span className="text-left">
        {status === "idle" && labels.idle}
        {status === "loading" && labels.loading}
        {status === "success" && labels.success}
      </span>
    </button>
  );
}
