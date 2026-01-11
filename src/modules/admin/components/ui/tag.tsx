import * as React from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2, Clock, X } from "lucide-react";
import { cn } from "@/utils/cn";

// --- Types & Constants ---

export const PRESET_COLORS = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
] as const;

export const STATUS_COLORS = ["success", "processing", "error", "warning", "default"] as const;

export type PresetColorType = (typeof PRESET_COLORS)[number];
export type StatusColorType = (typeof STATUS_COLORS)[number];
export type TagType = "filled" | "outlined" | "solid";

interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** 标签颜色，支持预设值、状态值或 HEX 颜色值 */
  color?: PresetColorType | StatusColorType | string;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭时的回调 */
  onClose?: (e: React.MouseEvent) => void;
  /** 图标，传入 ReactNode 或 boolean。如果是 Status 颜色，默认会显示对应图标。 */
  icon?: React.ReactNode;
  /** 标签样式类型 */
  bordered?: boolean; // antd prop compatibility
  type?: TagType; // Custom type prop for filled/outlined/solid
}

// --- Icons Configuration ---

const STATUS_ICONS: Record<StatusColorType, React.ElementType> = {
  success: CheckCircle2,
  processing: Loader2,
  error: XCircle,
  warning: AlertCircle,
  default: Clock,
};

// --- Color Mapping (Tailwind Classes) ---
const TAILWIND_COLOR_MAP: Record<string, { filled: string; outlined: string; solid: string }> = {
  // Presets
  magenta: {
    filled: "bg-pink-50 border-pink-200 text-pink-600",
    outlined: "border-pink-300 text-pink-600",
    solid: "bg-pink-600 border-pink-600 text-white",
  },
  red: {
    filled: "bg-red-50 border-red-200 text-red-600",
    outlined: "border-red-300 text-red-600",
    solid: "bg-red-600 border-red-600 text-white",
  },
  volcano: {
    filled: "bg-orange-100 border-orange-200 text-orange-700",
    outlined: "border-orange-300 text-orange-700",
    solid: "bg-orange-600 border-orange-600 text-white",
  },
  orange: {
    filled: "bg-orange-50 border-orange-200 text-orange-600",
    outlined: "border-orange-300 text-orange-600",
    solid: "bg-orange-500 border-orange-500 text-white",
  },
  gold: {
    filled: "bg-amber-50 border-amber-200 text-amber-600",
    outlined: "border-amber-300 text-amber-600",
    solid: "bg-amber-500 border-amber-500 text-white",
  },
  lime: {
    filled: "bg-lime-50 border-lime-200 text-lime-600",
    outlined: "border-lime-300 text-lime-600",
    solid: "bg-lime-500 border-lime-500 text-white",
  },
  green: {
    filled: "bg-green-50 border-green-200 text-green-600",
    outlined: "border-green-300 text-green-600",
    solid: "bg-green-600 border-green-600 text-white",
  },
  cyan: {
    filled: "bg-cyan-50 border-cyan-200 text-cyan-600",
    outlined: "border-cyan-300 text-cyan-600",
    solid: "bg-cyan-600 border-cyan-600 text-white",
  },
  blue: {
    filled: "bg-blue-50 border-blue-200 text-blue-600",
    outlined: "border-blue-300 text-blue-600",
    solid: "bg-blue-600 border-blue-600 text-white",
  },
  geekblue: {
    filled: "bg-indigo-50 border-indigo-200 text-indigo-600",
    outlined: "border-indigo-300 text-indigo-600",
    solid: "bg-indigo-600 border-indigo-600 text-white",
  },
  purple: {
    filled: "bg-purple-50 border-purple-200 text-purple-600",
    outlined: "border-purple-300 text-purple-600",
    solid: "bg-purple-600 border-purple-600 text-white",
  },

  // Status
  success: {
    filled: "bg-green-50 border-green-200 text-green-600",
    outlined: "border-green-300 text-green-600",
    solid: "bg-green-600 border-green-600 text-white",
  },
  processing: {
    filled: "bg-blue-50 border-blue-200 text-blue-600",
    outlined: "border-blue-300 text-blue-600",
    solid: "bg-blue-600 border-blue-600 text-white",
  },
  error: {
    filled: "bg-red-50 border-red-200 text-red-600",
    outlined: "border-red-300 text-red-600",
    solid: "bg-red-600 border-red-600 text-white",
  },
  warning: {
    filled: "bg-amber-50 border-amber-200 text-amber-600",
    outlined: "border-amber-300 text-amber-600",
    solid: "bg-amber-500 border-amber-500 text-white",
  },
  default: {
    filled: "bg-gray-100 border-gray-200 text-gray-600",
    outlined: "border-gray-300 text-gray-600",
    solid: "bg-gray-600 border-gray-600 text-white",
  },
};

// --- Helpers ---

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Tag 组件
 */
export function Tag({
  className,
  color = "default",
  closable,
  onClose,
  icon,
  bordered = true,
  type,
  children,
  style,
  ...props
}: TagProps) {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (visible) return;
  }, [visible]);

  if (!visible) return null;

  const styleType: TagType = type || "filled";

  // Check if color is custom HEX
  const isCustomColor = color.startsWith("#");
  const isPresetOrStatus = !isCustomColor && color in TAILWIND_COLOR_MAP;

  // Icon handling
  let IconComp = null;
  const isStatus = STATUS_COLORS.includes(color as any);

  if (icon !== undefined) {
    if (icon) {
      IconComp = () => <>{icon}</>;
    }
    // If icon is null/false but defined, IconComp remains null (disabled)
  } else if (isStatus) {
    IconComp = STATUS_ICONS[color as StatusColorType];
  }

  // Styles handling
  let computedClass = "";
  let computedStyle: React.CSSProperties = { ...style };

  if (isPresetOrStatus) {
    const map = TAILWIND_COLOR_MAP[color];
    computedClass = map[styleType];
  } else if (isCustomColor) {
    if (styleType === "solid") {
      computedStyle = {
        ...computedStyle,
        backgroundColor: color,
        borderColor: color,
        color: "#fff",
      };
    } else if (styleType === "outlined") {
      computedStyle = {
        ...computedStyle,
        borderColor: color,
        color: color,
        background: "transparent",
      };
    } else {
      // filled
      computedStyle = {
        ...computedStyle,
        backgroundColor: hexToRgba(color, 0.1),
        borderColor: hexToRgba(color, 0.3),
        color: color,
      };
    }
  } else {
    // Fallback for unknown strings
    const map = TAILWIND_COLOR_MAP["default"];
    computedClass = map[styleType];
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.(e);
    if (!e.defaultPrevented) {
      setVisible(false);
    }
  };

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded border px-2 text-xs font-normal whitespace-nowrap transition-all",
        !bordered && "border-transparent",
        computedClass,
        className,
      )}
      style={computedStyle}
      {...props}
    >
      {IconComp && (
        <span className="mr-1.5 inline-flex items-center">
          {typeof icon === "object" ? (
            icon
          ) : (
            <IconComp className={cn("h-3.5 w-3.5", color === "processing" && "animate-spin")} />
          )}
        </span>
      )}
      <span>{children}</span>
      {closable && (
        <X
          className="ml-1.5 h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
          onClick={handleClose}
        />
      )}
    </span>
  );
}

export default Tag;
