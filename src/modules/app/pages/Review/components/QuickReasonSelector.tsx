import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { X } from "lucide-react";

/**
 * 预设的常用驳回理由库
 */
const PRESET_REASONS = [
  "缺少MediaInfo",
  "文件列表不全",
  "截图加载失败",
  "标题格式错误",
  "简介与内容不符",
  "画质不达标",
  "包含违规内容",
  "重复资源",
  "种子失效/无法下载",
  "分类错误",
];

interface QuickReasonSelectorProps {
  /** 当前已选理由（可能只是文本字符串，我们这里简化为追加模式，或者受控模式） */
  // 为了简单集成到 textarea，我们使用 "点击即触发回调" 的模式
  onAddReason: (reason: string) => void;
  className?: string;
}

/**
 * QuickReasonSelector
 * - 展示一组 Tag
 * - 点击 Tag，将理由文本传递给父组件
 */
export function QuickReasonSelector({ onAddReason, className }: QuickReasonSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-xs text-neutral-400">快捷理由 (点击添加):</div>
      <div className="flex flex-wrap gap-2">
        {PRESET_REASONS.map((reason) => (
          <Badge
            key={reason}
            variant="outline"
            className="cursor-pointer border-neutral-700 bg-neutral-800/50 text-neutral-400 transition-colors hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400"
            onClick={() => onAddReason(reason)}
          >
            {reason}
          </Badge>
        ))}
      </div>
    </div>
  );
}
