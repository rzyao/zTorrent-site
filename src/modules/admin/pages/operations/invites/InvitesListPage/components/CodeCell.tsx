import { memo, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/modules/admin/components/ui/button";

interface CodeCellProps {
  code?: string;
}

/**
 * 邀请码显示组件
 * 支持显示/隐藏邀请码
 * 使用 memo 优化，避免不必要的重渲染
 */
export const CodeCell = memo(function CodeCell({ code }: CodeCellProps) {
  const [show, setShow] = useState(false);

  // 计算遮罩后的邀请码
  const masked = useMemo(() => {
    if (!code) return "";
    if (code.length <= 4) return "****";
    return `${"*".repeat(Math.max(0, code.length - 4))}${code.slice(-4)}`;
  }, [code]);

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{show ? code : masked}</span>
      <Button variant="text" size="sm" className="h-6 w-6 p-0" onClick={() => setShow((s) => !s)}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
});
