import { useRef } from "react";
import { Button } from "@/modules/admin/components/ui/button";
import { Upload as UploadIcon, FileJson, Trash2, Play } from "lucide-react";
import { Textarea } from "@/modules/admin/components/ui/textarea";

interface ImportPanelProps {
  text: string;
  onTextChange: (val: string) => void;
  onParseCsv: (file: any) => Promise<boolean>;
  onParseJson: () => void;
  onClear: () => void;
  onSubmit: () => void;
  loading: boolean;
  hasItems: boolean;
}

export function ImportPanel({
  text,
  onTextChange,
  onParseCsv,
  onParseJson,
  onClear,
  onSubmit,
  loading,
  hasItems,
}: ImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onParseCsv(file);
      // Reset input to allow re-selection
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="w-full shrink-0 space-y-4 lg:w-[480px]">
        <div className="bg-muted/30 rounded-lg border p-4">
          <h3 className="mb-3 font-medium">数据导入</h3>

          <div className="space-y-4">
            <div>
              <div className="text-muted-foreground mb-2 text-xs">
                方式一：上传 CSV 文件 (UserId, Delta, Reason...)
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="default"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start"
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                选择 CSV 文件
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">OR</span>
              </div>
            </div>

            <div>
              <div className="text-muted-foreground mb-2 text-xs">方式二：粘贴 JSON 数组</div>
              <Textarea
                rows={12}
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder='例如：[{"userId":"100","delta":"1000","reason":"活动奖励","externalRef":"REF-001"}]'
                className="font-mono text-xs"
              />

              <div className="mt-2 flex gap-2">
                <Button variant="default" onClick={onParseJson} className="flex-1" disabled={!text}>
                  <FileJson className="mr-2 h-4 w-4" />
                  解析 JSON
                </Button>
                <Button
                  variant="default"
                  onClick={onClear}
                  className="w-auto px-3"
                  disabled={!text && !hasItems}
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="primary" // Changed to primary for main action
          size="large"
          className="w-full"
          onClick={onSubmit}
          loading={loading}
          disabled={!hasItems}
        >
          <Play className="mr-2 h-4 w-4" />
          开始执行批量调账
        </Button>

        <div className="text-muted-foreground text-xs leading-relaxed">
          建议为每条记录提供唯一 externalRef 以避免重复执行；冻结账户将拒绝负向记账。
        </div>
      </div>
    </div>
  );
}
