import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { Upload, FileJson, AlertTriangle } from "lucide-react";
import { customToast } from "@/hooks/useToast";
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
        JSON.parse(content);
        setJsonContent(content);
        customToast.success("文件读取成功");
      } catch {
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
      } catch {
        throw new Error("JSON 格式错误");
      }
      let payload: ImportRoutesDto;
      if (Array.isArray(parsed)) payload = { items: parsed };
      else if (parsed.items || parsed.routes) payload = parsed;
      else throw new Error("JSON 结构不符合要求");
      await PlatformAdminRoutesService.adminRoutesControllerImport(payload);
      customToast.success("批量导入成功");
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
      <DialogContent className="border-antd-border-secondary bg-antd-bg-container flex h-[80vh] max-w-4xl flex-col overflow-hidden rounded-lg p-0 shadow-lg">
        <div className="border-antd-border-secondary bg-antd-bg-layout/30 border-b px-6 py-4">
          <DialogTitle className="text-antd-text text-base font-semibold">批量导入路由</DialogTitle>
          <DialogDescription className="text-antd-text-description mt-1 text-sm">
            请粘贴完整的路由配置 JSON 或上传配置文件。
          </DialogDescription>
        </div>
        <div className="flex min-h-0 flex-1 gap-4 p-6">
          <div className="border-antd-border-secondary relative flex-1 overflow-hidden rounded-md border bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={jsonContent}
              onChange={(v) => setJsonContent(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
            {!jsonContent && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-white/30">在此粘贴 JSON...</span>
              </div>
            )}
          </div>
          <div className="flex w-56 shrink-0 flex-col gap-4">
            <div className="border-antd-warning/20 bg-antd-warning/5 rounded-md border p-3">
              <div className="text-antd-warning flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span className="text-sm font-medium">高风险操作</span>
              </div>
              <p className="text-antd-warning/80 mt-1 text-xs">此操作将全量覆盖现有配置。</p>
            </div>
            <div className="border-antd-border-secondary bg-antd-bg-layout/30 flex-1 space-y-2 rounded-md border p-3">
              <h4 className="text-antd-text text-sm font-medium">格式说明</h4>
              <p className="text-antd-text-description text-xs">支持 Route DTO 数组。</p>
            </div>
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              className="border-antd-border text-antd-text w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileJson className="mr-2 h-4 w-4" />
              读取文件
            </Button>
          </div>
        </div>
        <div className="border-antd-border-secondary bg-antd-bg-layout/10 flex justify-end gap-3 border-t px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="border-antd-border text-antd-text"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={isUploading || !jsonContent.trim()}
            className="bg-antd-primary hover:bg-antd-primary-hover text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "导入中..." : "确认导入"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
