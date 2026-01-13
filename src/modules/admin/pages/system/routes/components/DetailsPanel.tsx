import { memo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Button } from "@/modules/admin/components/ui/button";
import { Label } from "@/modules/admin/components/ui/label";
import { Tag } from "@/modules/admin/components/ui/tag";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { componentRegistry } from "@/routes/componentRegistry";
import DynamicIcon from "@/modules/admin/components/DynamicIcon";
import { Save, RefreshCw, Trash2, Loader2 } from "lucide-react";

const editRouteSchema = z.object({
  id: z.string(),
  path: z.string().min(1, "必填"),
  name: z.string().optional(),
  redirect: z.string().optional(),
  component: z.string().optional(),
  layout: z.string().optional(),
  icon: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  isVisible: z.boolean().default(true),
  isEnabled: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
  index: z.boolean().default(false),
});

type EditRouteFormValues = z.infer<typeof editRouteSchema>;

interface DetailsPanelProps {
  node: RouteTreeNodeDto | null;
  onSave: (node: RouteTreeNodeDto) => void;
  onDelete: (nodeId: string) => void;
  isSaving?: boolean;
}

const COMPONENT_OPTIONS = [
  { value: "__NONE__", label: "无组件 (仅作为容器)" },
  ...Object.keys(componentRegistry)
    .sort()
    .map((c) => ({ value: c, label: c })),
];

const LAYOUT_OPTIONS = [
  { value: "none", label: "无布局 (None)" },
  { value: "app", label: "前台布局 (AppLayout)" },
  { value: "forum", label: "论坛布局 (ForumLayout)" },
  { value: "admin", label: "后台布局 (AdminLayout)" },
];

const EmptyState = memo(function EmptyState() {
  return (
    <div className="bg-card text-muted-foreground flex h-full items-center justify-center rounded-lg border border-dashed p-12">
      <div className="text-center">
        <p>请在左侧选择一个路由节点</p>
      </div>
    </div>
  );
});

export const DetailsPanel = memo(function DetailsPanel({
  node,
  onSave,
  onDelete,
  isSaving,
}: DetailsPanelProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<EditRouteFormValues>({
    resolver: zodResolver(editRouteSchema),
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (node) {
      setIsTransitioning(true);
      reset({
        id: node.id,
        path: node.path,
        name:
          node.name && typeof node.name === "object"
            ? (node.name as any).zh || (node.name as any).default || node.name || ""
            : node.name || "",
        redirect:
          node.redirect && typeof node.redirect === "object"
            ? (node.redirect as any).url || node.redirect || ""
            : node.redirect || "",
        component:
          node.component && typeof node.component === "object"
            ? (node.component as any).component || node.component || "__NONE__"
            : node.component || "__NONE__",
        layout: (node.layout as string) || "none",
        icon: (node as any).icon || "",
        permissions: node.permissions || [],
        isVisible: node.isVisible !== false,
        isEnabled: (node as any).isEnabled !== false,
        openInNewTab: (node as any).openInNewTab || false,
        index: node.index || false,
      });
      // Small delay to simulate smooth transition if needed, or mostly just reset logic
      const t = setTimeout(() => setIsTransitioning(false), 50);
      return () => clearTimeout(t);
    }
  }, [node, reset]);

  const onFormSubmit = (values: EditRouteFormValues) => {
    console.log("Form submitted with values:", values);
    if (!node) {
      console.error("No node selected");
      return;
    }
    const updatedNode = {
      ...node,
      ...values,
      // 将 __NONE__ 转换回空字符串
      component: values.component === "__NONE__" ? "" : values.component,
      permissions: values.permissions || [],
    } as any;
    console.log("Calling onSave with:", updatedNode);
    onSave(updatedNode);
  };

  const currentIcon = watch("icon");

  if (!node) {
    return <EmptyState />;
  }

  const displayName =
    node.name && typeof node.name === "object"
      ? (node.name as any).zh || (node.name as any).default || node.id
      : node.name || node.id;

  return (
    <div className="bg-card flex h-full flex-col overflow-hidden rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg leading-none font-semibold tracking-tight">
              {displayName || "..."}
            </h3>
            {node.isVisible === false && <Tag color="error">已隐藏</Tag>}
          </div>
          <p className="text-muted-foreground mt-1 font-mono text-sm">{node.id}</p>
        </div>
        <Button
          variant="text"
          danger
          size="small"
          onClick={() => onDelete(node.id)}
          title="删除路由"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isTransitioning ? (
          <div className="animate-pulse space-y-4">
            <div className="bg-muted h-8 w-full rounded"></div>
            <div className="bg-muted h-24 w-full rounded"></div>
            <div className="bg-muted h-24 w-full rounded"></div>
          </div>
        ) : (
          <form id="details-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            {/* Basic Config */}
            <div>
              <h4 className="text-muted-foreground mb-4 text-xs font-bold uppercase">基础配置</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>ID (唯一标识)</Label>
                  <Input value={node.id} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>路径 Path</Label>
                  <Controller
                    control={control}
                    name="path"
                    render={({ field }) => <Input {...field} placeholder="/admin/users" />}
                  />
                </div>

                <div className="space-y-2">
                  <Label>显示名称 Name</Label>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => <Input {...field} placeholder="用户管理" />}
                  />
                </div>

                <div className="space-y-2">
                  <Label>重定向 Redirect</Label>
                  <Controller
                    control={control}
                    name="redirect"
                    render={({ field }) => <Input {...field} placeholder="可选" />}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-8">
                  <Controller
                    control={control}
                    name="index"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <div className="grid gap-1.5 leading-none">
                          <Label>索引路由</Label>
                          <p className="text-muted-foreground text-xs">作为父路由的默认子路由</p>
                        </div>
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="openInNewTab"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <div className="grid gap-1.5 leading-none">
                          <Label>新标签页打开</Label>
                          <p className="text-muted-foreground text-xs">仅在设置了重定向时生效</p>
                        </div>
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="isEnabled"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <div className="grid gap-1.5 leading-none">
                          <Label>是否启用</Label>
                          <p className="text-muted-foreground text-xs">禁用后无法访问</p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-muted-foreground mb-4 text-xs font-bold uppercase">渲染配置</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>渲染组件</Label>
                  <Controller
                    control={control}
                    name="component"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        options={COMPONENT_OPTIONS}
                        placeholder="选择组件"
                        className="w-full"
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>所属布局</Label>
                  <Controller
                    control={control}
                    name="layout"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        options={LAYOUT_OPTIONS}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>图标 Icon</Label>
                  <Controller
                    control={control}
                    name="icon"
                    render={({ field }) => <Input {...field} placeholder="Lucide:Home" />}
                  />
                </div>

                <div className="space-y-2">
                  <Label>图标预览</Label>
                  <div className="text-muted-foreground flex h-10 items-center">
                    {currentIcon ? (
                      <DynamicIcon iconName={currentIcon} size={20} />
                    ) : (
                      <span className="text-xs">输入后预览</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-muted-foreground mb-4 text-xs font-bold uppercase">访问控制</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>访问权限 Permissions (逗号分隔)</Label>
                  <Controller
                    control={control}
                    name="permissions"
                    render={({ field }) => (
                      <Input
                        value={field.value?.join(",") || ""}
                        onChange={(e) => field.onChange(e.target.value.split(",").filter(Boolean))}
                        placeholder="admin:read"
                      />
                    )}
                  />
                </div>

                <div className="flex items-center pt-8">
                  <Controller
                    control={control}
                    name="isVisible"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <div className="grid gap-1.5 leading-none">
                          <Label>侧边栏显示</Label>
                          <p className="text-muted-foreground text-xs">控制菜单显隐</p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="bg-muted/40 flex justify-end gap-3 border-t px-6 py-4">
        <Button
          variant="default"
          onClick={() => reset()}
          disabled={isSaving || !isDirty || isTransitioning}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          重置
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit(onFormSubmit)}
          disabled={isSaving || isTransitioning}
          loading={isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          保存变更
        </Button>
      </div>
    </div>
  );
});
