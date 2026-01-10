import { useState, useRef } from "react";
import { Modal, Button, Upload, Alert, Typography, App } from "antd";
import Editor from "@monaco-editor/react";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import { PlatformRoutesService } from "@/api/services/PlatformRoutesService";
import { useQueryClient } from "@tanstack/react-query";
import { ImportRoutesDto } from "@/api/models/ImportRoutesDto";

const { Title, Text } = Typography;

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [jsonContent, setJsonContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  // Antd Upload handles file reading differently, typically it's for posting to server.
  // For client-side read, we use 'beforeUpload' to intercept.
  const handleBeforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content);
        setJsonContent(content);
        message.success("文件读取成功");
        setFileList([]); // clear file list visual
      } catch {
        message.error("JSON 格式无效");
      }
    };
    reader.readAsText(file);
    return false; // Prevent auto upload
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
      message.success("批量导入成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
      onOpenChange(false);
    } catch (err: any) {
      message.error(`导入失败: ${err.message || "未知错误"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      title="批量导入路由"
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={handleImport}
      confirmLoading={isUploading}
      okText="确认导入"
      cancelText="取消"
      width={900}
      styles={{ body: { padding: 0 } }} // Custom body padding if needed
      destroyOnHidden
    >
      <div className="flex h-[600px] gap-4 p-4">
        {/* Editor Area */}
        <div className="relative flex-1 overflow-hidden rounded border border-[#303030] bg-[#1e1e1e]">
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

        {/* Sidebar */}
        <div className="flex w-64 flex-col gap-4">
          <Alert
            message="高风险操作"
            description="此操作将全量覆盖现有配置，请确保 JSON 数据完整且正确。"
            type="warning"
            showIcon
          />

          <div className="rounded border border-gray-100 bg-gray-50 p-3">
            <Text strong className="mb-2 block text-sm">
              格式说明
            </Text>
            <Text type="secondary" className="text-xs">
              支持 Route DTO 数组或包含 items 字段的对象。
            </Text>
          </div>

          <Upload
            beforeUpload={handleBeforeUpload}
            fileList={fileList}
            showUploadList={false}
            accept=".json"
          >
            <Button block icon={<FileTextOutlined />}>
              读取 JSON 文件
            </Button>
          </Upload>
        </div>
      </div>
    </Modal>
  );
}
