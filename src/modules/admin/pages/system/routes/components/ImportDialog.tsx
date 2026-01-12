import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Upload, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/modules/admin/components/ui/dialog";
import { Button } from "@/modules/admin/components/ui/button";
import { ImportRoutesDto } from "@/api/models/ImportRoutesDto";
import { PlatformRoutesService } from "@/api/services/PlatformRoutesService";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const queryClient = useQueryClient();
  const [jsonContent, setJsonContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content); // Validate JSON
        setJsonContent(content);
        toast.success("文件读取成功");
        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch {
        toast.error("JSON 格式无效");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonContent.trim()) return;
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

      await PlatformRoutesService.routesControllerImport(payload);
      toast.success("批量导入成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(`导入失败: ${err.message || "未知错误"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>批量导入路由</DialogTitle>
        </DialogHeader>

        <div className="flex h-[500px]">
           {/* Editor */}
           <div className="flex-1 border-r bg-[#1e1e1e] relative">
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
                  <span className="text-sm text-white/30">在此粘贴 JSON 或上传文件...</span>
                </div>
              )}
           </div>

           {/* Sidebar */}
           <div className="w-80 p-6 bg-muted/30 space-y-6">
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
                 <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">高风险操作</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-500/90 leading-relaxed">
                            此操作将<strong>全量覆盖</strong>现有配置，请确保 JSON 数据完整且正确。
                        </p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                  <div className="rounded-md border bg-card p-4 space-y-2">
                     <h4 className="text-sm font-medium">格式说明</h4>
                     <p className="text-xs text-muted-foreground">
                        支持 Route DTO 数组 `[]` 或包含 `{ items: [] }` 的对象。
                     </p>
                  </div>

                  <div>
                     <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        className="hidden"
                        onChange={handleFileChange}
                     />
                     <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => fileInputRef.current?.click()}
                     >
                        <FileText className="mr-2 h-4 w-4" />
                        读取 JSON 文件
                     </Button>
                  </div>
              </div>
           </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10">
           <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
           <Button onClick={handleImport} disabled={isUploading || !jsonContent}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认导入
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

