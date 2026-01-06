import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { componentRegistry } from "@/routes/componentRegistry";
import { useEffect, useState } from "react";
import { Save, RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DetailsPanelProps {
  node: RouteTreeNodeDto | null;
  onSave: (node: RouteTreeNodeDto) => void;
  onDelete: (nodeId: string) => void;
  isSaving?: boolean;
}

export function DetailsPanel({ node, onSave, onDelete, isSaving }: DetailsPanelProps) {
  const [formData, setFormData] = useState<RouteTreeNodeDto | null>(null);
  const [componentList] = useState(Object.keys(componentRegistry).sort());

  useEffect(() => {
    setFormData(node);
  }, [node]);

  if (!node || !formData) {
    return (
      <div className="border-antd-border-secondary bg-antd-bg-container/50 flex h-full items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-antd-text-description text-sm">请在左侧选择一个路由节点</p>
          <p className="text-antd-text-placeholder mt-1 text-xs">或点击顶部"新建"按钮</p>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof RouteTreeNodeDto, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handlePermissionsChange = (value: string) => {
    const perms = value
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    handleChange("permissions", perms);
  };

  const getStringValue = (val: any): string => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object") return JSON.stringify(val);
    return "";
  };

  const displayName = getStringValue(formData.name) || formData.id;
  const isHidden = formData.isVisible === false;

  return (
    <div className="border-antd-border-secondary bg-antd-bg-container flex h-full flex-col overflow-hidden rounded-md border shadow-sm">
      <div className="border-antd-border-secondary flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-antd-text flex items-center gap-2 text-base font-semibold">
            {displayName}
            {isHidden && (
              <Badge
                color="red"
                border="red"
                className="text-antd-error bg-transparent font-normal"
              >
                已隐藏
              </Badge>
            )}
          </h2>
          <p className="text-antd-text-description mt-1 font-mono text-xs">{formData.id}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(formData.id)}
          className="text-antd-text-description hover:bg-antd-error/10 hover:text-antd-error"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-antd-text-description text-xs font-medium">基础配置</h3>
            <div className="space-y-2">
              <Label className="text-antd-text text-xs">ID (唯一标识)</Label>
              <Input
                value={formData.id}
                disabled
                className="bg-antd-bg-layout border-antd-border-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-antd-text text-xs">路径 Path</Label>
              <Input
                value={formData.path}
                onChange={(e) => handleChange("path", e.target.value)}
                placeholder="/admin/users"
                className="border-antd-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-antd-text text-xs">显示名称 Name</Label>
              <Input
                value={getStringValue(formData.name)}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="用户管理"
                className="border-antd-border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-antd-text-description text-xs font-medium">渲染配置</h3>
            <div className="space-y-2">
              <Label className="text-antd-text text-xs">渲染组件 Component</Label>
              <Input
                list="component-options"
                value={getStringValue(formData.component)}
                onChange={(e) => handleChange("component", e.target.value)}
                placeholder="选择或输入组件名"
                className="border-antd-border"
              />
              <datalist id="component-options">
                {componentList.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label className="text-antd-text text-xs">所属布局 Layout</Label>
              <Select
                value={formData.layout || "none"}
                onValueChange={(val) => handleChange("layout", val as RouteTreeNodeDto.layout)}
              >
                <SelectTrigger className="border-antd-border text-antd-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-antd-border-secondary bg-antd-bg-container">
                  <SelectItem value="none">无布局 (None)</SelectItem>
                  <SelectItem value="app">前台布局 (AppLayout)</SelectItem>
                  <SelectItem value="forum">论坛布局 (ForumLayout)</SelectItem>
                  <SelectItem value="admin">后台布局 (AdminLayout)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-antd-border-secondary space-y-4 border-t pt-6">
          <h3 className="text-antd-text-description text-xs font-medium">访问控制</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-antd-text text-xs">访问权限</Label>
              <Input
                value={formData.permissions?.join(", ") || ""}
                onChange={(e) => handlePermissionsChange(e.target.value)}
                placeholder="perm:read, perm:write"
                className="border-antd-border"
              />
            </div>
            <div className="border-antd-border-secondary bg-antd-bg-layout/20 flex items-center justify-between rounded-md border p-4">
              <div>
                <Label className="text-antd-text text-sm">菜单可见性</Label>
                <p className="text-antd-text-description text-xs">控制此路由是否在侧边栏中展示</p>
              </div>
              <Switch
                checked={formData.isVisible !== false}
                onCheckedChange={(checked) => handleChange("isVisible", checked)}
                className="data-[state=checked]:bg-antd-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-antd-border-secondary bg-antd-bg-layout/10 flex justify-end gap-3 border-t px-6 py-4">
        <Button
          variant="outline"
          onClick={() => setFormData(node)}
          disabled={isSaving}
          className="border-antd-border text-antd-text"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          重置
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={isSaving}
          className="bg-antd-primary hover:bg-antd-primary-hover text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "保存中..." : "保存变更"}
        </Button>
      </div>
    </div>
  );
}
