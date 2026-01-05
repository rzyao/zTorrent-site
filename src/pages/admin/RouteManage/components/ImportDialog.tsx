import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { Upload, FileJson, AlertTriangle } from "lucide-react";
import { customToast } from "@/hooks/useToast"; // Correct toast import
import { PlatformAdminRoutesService } from "@/api/services/PlatformAdminRoutesService";
import { useQueryClient } from "@tanstack/react-query";
import { ImportRoutesDto } from "@/api/models/ImportRoutesDto";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const queryClient = useQueryClient();
  const [jsonContent, setJsonContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Validate JSON
        JSON.parse(content);
        setJsonContent(content);
        customToast.success("文件读取成功");
      } catch (err) {
        customToast.error("JSON 格式无效");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    try {
      setIsUploading(true);
      let parsed: any;
      try {
        parsed = JSON.parse(jsonContent);
      } catch (e) {
        throw new Error("JSON 格式错误，请检查语法");
      }

      // 根据后端 DTO 定义构造请求体
      // ImportRoutesDto 可能定义为 { items: [...] } 或者直接是数组
      // 我们先尝试智能适配
      let payload: ImportRoutesDto;

      if (Array.isArray(parsed)) {
        // 如果用户粘贴的是数组，包装为后端期望的格式 (参考之前的脚本修复经验)
        payload = { items: parsed };
      } else if (parsed.items || parsed.routes) {
        // 如果已经包含了 items 或 routes 字段
        payload = parsed;
      } else {
        // 既不是数组也没有 items，可能是错误的格式
        throw new Error("JSON 结构不符合要求，根节点应为路由数组或包含 items 字段的对象");
      }

      await PlatformAdminRoutesService.adminRoutesControllerImport(payload);

      customToast.success("批量导入成功", { description: "路由配置已全量更新" });
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
      onOpenChange(false);
    } catch (err: any) {
      customToast.error("导入失败", { description: err.message || "未知错误" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>批量导入路由 (Batch Import)</DialogTitle>
          <DialogDescription>
            请粘贴完整的路由配置 JSON，或上传配置文件。
            <div className="mt-2 flex items-center gap-1 font-medium text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              警告：此操作将全量覆盖现有路由配置！
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 gap-4 py-4">
          {/* 左侧编辑器 */}
          <div className="relative flex-1 overflow-hidden rounded-md border bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={jsonContent}
              onChange={(value) => setJsonContent(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
            {!jsonContent && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground opacity-50">在此粘贴 JSON 配置...</span>
              </div>
            )}
          </div>

          {/* 右侧操作区 */}
          <div className="flex w-48 shrink-0 flex-col gap-4">
            <div className="bg-muted/20 space-y-2 rounded-lg border p-4 text-sm">
              <h4 className="text-foreground font-medium">格式说明</h4>
              <p className="text-muted-foreground">支持 RouteTreeNodeDto 数组结构。</p>
              <code className="bg-muted block rounded p-2 text-xs break-all">
                [{`{"path":"/home","name":"首页"}`},...]
              </code>
            </div>

            <div className="border-t pt-4">
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileJson className="mr-2 h-4 w-4" />
                读取文件
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleImport} disabled={isUploading || !jsonContent.trim()}>
            {isUploading ? "导入中..." : "确认覆盖导入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
