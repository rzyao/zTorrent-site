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
      <div className="text-muted-foreground flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/50 dark:bg-gray-900/50">
        <div className="text-center">
          <p>请在左侧选择一个路由节点</p>
          <p className="mt-1 text-sm">或点击顶部"新建"按钮</p>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof RouteTreeNodeDto, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handlePermissionsChange = (value: string) => {
    // 简单的文本分割处理，后续可用 Tag Input 优化
    const perms = value
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    handleChange("permissions", perms);
  };

  // 从 DTO 中安全获取字符串值
  const getStringValue = (val: any): string => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object") return JSON.stringify(val);
    return "";
  };

  // 注意：RouteTreeNodeDto 中没有 isEnabled 和 routeKey 字段
  // 我们使用 isVisible 代替，并用 id 作为唯一标识
  const displayName = getStringValue(formData.name) || formData.id;
  const isDisabled = formData.isVisible === false; // 用 isVisible 反向表示禁用状态

  return (
    <div className="bg-card h-full space-y-6 overflow-y-auto rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {displayName}
            {isDisabled && <Badge color="destructive">已隐藏</Badge>}
          </h2>
          <p className="text-muted-foreground mt-1 font-mono text-sm">{formData.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="icon" onClick={() => onDelete(formData.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 基础信息 */}
        <div className="space-y-4">
          <h3 className="text-muted-foreground text-sm font-medium">基础配置</h3>

          <div className="space-y-2">
            <Label>ID (只读)</Label>
            <Input value={formData.id} disabled />
          </div>

          <div className="space-y-2">
            <Label>路径 Path</Label>
            <Input
              value={formData.path}
              onChange={(e) => handleChange("path", e.target.value)}
              placeholder="/admin/users"
            />
          </div>

          <div className="space-y-2">
            <Label>显示名称 Name</Label>
            <Input
              value={getStringValue(formData.name)}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="用户管理"
            />
          </div>
        </div>

        {/* 组件与布局 */}
        <div className="space-y-4">
          <h3 className="text-muted-foreground text-sm font-medium">渲染配置</h3>

          <div className="space-y-2">
            <Label>组件 Component</Label>
            <div className="relative">
              <Input
                list="component-options"
                value={getStringValue(formData.component)}
                onChange={(e) => handleChange("component", e.target.value)}
                placeholder="选择或输入组件名"
              />
              <datalist id="component-options">
                {componentList.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <p className="text-muted-foreground text-xs">输入 componentRegistry 中的键名</p>
          </div>

          <div className="space-y-2">
            <Label>布局 Layout</Label>
            <Select
              value={formData.layout || "none"}
              onValueChange={(val) => handleChange("layout", val as RouteTreeNodeDto.layout)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无布局 (None)</SelectItem>
                <SelectItem value="app">前台布局 (AppLayout)</SelectItem>
                <SelectItem value="forum">论坛布局 (ForumLayout)</SelectItem>
                <SelectItem value="admin">后台布局 (AdminLayout)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 权限与状态 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-muted-foreground text-sm font-medium">访问控制</h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>所需权限</Label>
            <Input
              value={formData.permissions?.join(", ") || ""}
              onChange={(e) => handlePermissionsChange(e.target.value)}
              placeholder="perm:read, perm:write (逗号分隔)"
            />
            <p className="text-muted-foreground text-xs">拥有任一权限即可访问</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">菜单可见 (Visible)</Label>
                <p className="text-muted-foreground text-xs">关闭后不显示在菜单中</p>
              </div>
              <Switch
                checked={formData.isVisible !== false}
                onCheckedChange={(checked) => handleChange("isVisible", checked)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t pt-6">
        <Button variant="outline" onClick={() => setFormData(node)} disabled={isSaving}>
          <RotateCcw className="mr-2 h-4 w-4" />
          重置
        </Button>
        <Button onClick={() => onSave(formData)} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "保存中..." : "保存变更"}
        </Button>
      </div>
    </div>
  );
}
