import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/admin/components/ui/dialog";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Button } from "@/modules/admin/components/ui/button";
import { Label } from "@/modules/admin/components/ui/label";
import { CreateRouteDto } from "@/api/models/CreateRouteDto";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { componentRegistry } from "@/routes/componentRegistry";

const createRouteSchema = z.object({
  routeKey: z
    .string()
    .min(1, "其中包含必填项")
    .regex(/^[a-zA-Z0-9_-]+$/, "仅支持字母、数字、下划线和连字符"),
  path: z.string().min(1, "其中包含必填项"),
  name: z.string().optional(),
  parentId: z.string().optional().nullable(),
  component: z.string().optional(),
  layout: z.string().optional(),
  redirect: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  icon: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  isVisible: z.boolean().default(true),
  isEnabled: z.boolean().default(true),
  isIndex: z.boolean().default(false),
  openInNewTab: z.boolean().default(false),
});

type CreateRouteFormValues = z.infer<typeof createRouteSchema>;

interface CreateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treeData: RouteTreeNodeDto[];
  onSubmit: (values: CreateRouteDto) => Promise<void>;
  initialLayout?: string;
}

// Convert tree to flat options with indentation
function flattenTreeOptions(
  nodes: RouteTreeNodeDto[],
  depth = 0,
): { value: string; label: string }[] {
  let options: { value: string; label: string }[] = [];

  nodes.forEach((node) => {
    const prefix = depth > 0 ? "— ".repeat(depth) : "";
    const name = typeof node.name === "string" ? node.name : node.id;

    options.push({
      value: node.id,
      label: `${prefix}${name} (${node.id})`,
    });

    if (node.children && node.children.length > 0) {
      options = options.concat(flattenTreeOptions(node.children, depth + 1));
    }
  });

  return options;
}

export function CreateRouteModal({
  open,
  onOpenChange,
  treeData,
  onSubmit,
  initialLayout = "app",
}: CreateRouteModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRouteFormValues>({
    resolver: zodResolver(createRouteSchema),
    defaultValues: {
      layout: initialLayout,
      isVisible: true,
      isEnabled: true,
      isIndex: false,
      openInNewTab: false,
      sortOrder: 0,
      permissions: [],
    },
  });

  const componentList = useMemo(() => Object.keys(componentRegistry).sort(), []);

  const parentOptions = useMemo(() => {
    // Flatten logic
    return flattenTreeOptions(treeData);
  }, [treeData]);

  useEffect(() => {
    if (open) {
      reset({
        layout: initialLayout,
        isVisible: true,
        isEnabled: true,
        isIndex: false,
        openInNewTab: false,
        sortOrder: 0,
        permissions: [],
        routeKey: "",
        path: "",
        name: "",
        parentId: null,
      });
    }
  }, [open, initialLayout, reset]);

  const onFormSubmit = async (values: CreateRouteFormValues) => {
    await onSubmit({
      ...values,
      isIndex: values.isIndex ?? false,
      openInNewTab: values.openInNewTab ?? false,
      permissions: values.permissions || [],
      // Ensure null is handled if API expects string | undefined
      parentId: values.parentId || undefined,
    } as any);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新建路由节点</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* 基础信息 */}
          <div>
            <h4 className="text-muted-foreground mb-3 text-xs font-bold uppercase">基础信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>路由标识 (routeKey) *</Label>
                <Controller
                  control={control}
                  name="routeKey"
                  render={({ field }) => (
                    <>
                      <Input {...field} placeholder="admin-users" />
                      {errors.routeKey && (
                        <p className="text-xs text-red-500">{errors.routeKey.message}</p>
                      )}
                    </>
                  )}
                />
                <p className="text-muted-foreground text-xs">全局唯一标识</p>
              </div>

              <div className="space-y-2">
                <Label>路由路径 (path) *</Label>
                <Controller
                  control={control}
                  name="path"
                  render={({ field }) => (
                    <>
                      <Input {...field} placeholder="/admin/users" />
                      {errors.path && <p className="text-xs text-red-500">{errors.path.message}</p>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>显示名称</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => <Input {...field} placeholder="用户管理" />}
                />
              </div>

              <div className="space-y-2">
                <Label>父级节点</Label>
                <Controller
                  control={control}
                  name="parentId"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      options={parentOptions}
                      placeholder="根节点 (无父级)"
                      className="w-full"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-muted-foreground mb-3 text-xs font-bold uppercase">渲染配置</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>渲染组件</Label>
                <Controller
                  control={control}
                  name="component"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={componentList.map((c) => ({ value: c, label: c }))}
                      placeholder="选择组件"
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
                      options={[
                        { value: "none", label: "无布局 (None)" },
                        { value: "app", label: "前台布局 (AppLayout)" },
                        { value: "forum", label: "论坛布局 (ForumLayout)" },
                        { value: "admin", label: "后台布局 (AdminLayout)" },
                      ]}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>重定向</Label>
                <Controller
                  control={control}
                  name="redirect"
                  render={({ field }) => <Input {...field} placeholder="可选" />}
                />
              </div>

              <div className="space-y-2">
                <Label>排序权重</Label>
                <Controller
                  control={control}
                  name="sortOrder"
                  render={({ field }) => (
                    <Input {...field} type="number" step="10" placeholder="0" />
                  )}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>图标 (Lucide:Home)</Label>
                <Controller
                  control={control}
                  name="icon"
                  render={({ field }) => <Input {...field} placeholder="Lucide:Home" />}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-muted-foreground mb-3 text-xs font-bold uppercase">控制选项</h4>
            <div className="flex flex-wrap gap-6">
              <Controller
                control={control}
                name="isVisible"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <Label>菜单可见</Label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="isEnabled"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <Label>启用</Label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="isIndex"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <Label>索引路由</Label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="openInNewTab"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <Label>新签页</Label>
                  </div>
                )}
              />
            </div>

            <div className="mt-4 space-y-2">
              <Label>访问权限 (输入Key回车 - 暂用逗号分隔字符串)</Label>
              <Controller
                control={control}
                name="permissions"
                render={({ field }) => (
                  <Input
                    value={field.value?.join(",") || ""}
                    onChange={(e) => field.onChange(e.target.value.split(",").filter(Boolean))}
                    placeholder="admin:read, admin:write"
                  />
                )}
              />
              <p className="text-muted-foreground text-xs">多个权限请用逗号分隔</p>
            </div>
          </div>

          <div className="bg-muted/20 -mx-6 -mb-6 flex justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="default" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              创建
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
