import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/utils/cn";
import { useForumTheme } from "../context/ForumThemeContext";
import { ActionButton } from "../components/ui/ActionButton";
import { ColorPicker } from "../components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import {
  useTagGroupsQuery,
  useCreateTagGroupMutation,
  useUpdateTagGroupMutation,
  useDeleteTagGroupMutation,
  ForumTagGroupWithId,
} from "../hooks/useTagGroups";
import { ManageGroupTagsDialog } from "../components/TagGroups/ManageGroupTagsDialog";

// Schema definition
const formSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  color: z.string().default("#6b7280"),
  sortOrder: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof formSchema>;

export function TagGroupsPage() {
  const { theme, colors } = useForumTheme();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data: tagGroupsData, isLoading, isRefetching, refetch } = useTagGroupsQuery(page, 100);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ForumTagGroupWithId | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<ForumTagGroupWithId | null>(null);
  const [manageTagsGroup, setManageTagsGroup] = useState<ForumTagGroupWithId | null>(null);

  // Mutations
  const createMutation = useCreateTagGroupMutation();
  const updateMutation = useUpdateTagGroupMutation();
  const deleteMutation = useDeleteTagGroupMutation();

  // Create Form
  const createForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#6b7280",
      sortOrder: 0,
    },
  });

  // Edit Form
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#6b7280",
      sortOrder: 0,
    },
  });

  // Handlers
  const handleCreate = async (values: FormValues) => {
    // Explicitly construct DTO to avoid type mismatch
    await createMutation.mutate({
      name: values.name,
      color: values.color,
      sortOrder: values.sortOrder,
    });
    setIsCreateOpen(false);
    createForm.reset();
  };

  const handleEdit = async (values: FormValues) => {
    if (!editingGroup) return;
    await updateMutation.mutate({
      id: editingGroup.id,
      ...values,
    });
    setEditingGroup(null);
  };

  const handleDelete = async () => {
    if (!deletingGroup) return;
    await deleteMutation.mutate(deletingGroup.id);
    setDeletingGroup(null);
  };

  const openEditDialog = (group: ForumTagGroupWithId) => {
    setEditingGroup(group);
    editForm.reset({
      name: group.name,
      color: group.color || "#6b7280",
      sortOrder: group.sortOrder || 0,
    });
  };

  return (
    <div className="container mx-auto max-w-5xl py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${colors.textPrimary}`}>标签组管理</h1>
          <p className={`mt-1 text-sm ${colors.textMuted}`}>管理论坛标签组、颜色及排序。</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="icon"
            onClick={() => refetch()}
            className="mr-2"
            disabled={isRefetching}
          >
            <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
          </Button>
          <ActionButton onClick={() => setIsCreateOpen(true)} icon={Plus}>
            新建标签组
          </ActionButton>
        </div>
      </div>

      {/* Content */}
      <div className={cn("rounded-md border shadow-sm", colors.cardBg, colors.cardBorder)}>
        <Table>
          <TableHeader>
            <TableRow className={colors.borderColor}>
              <TableHead className={cn("w-[100px]", colors.textSecondary)}>颜色</TableHead>
              <TableHead className={colors.textSecondary}>名称</TableHead>
              <TableHead className={cn("w-[100px] text-center", colors.textSecondary)}>
                排序
              </TableHead>
              <TableHead className={cn("w-[150px] text-right", colors.textSecondary)}>
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className={colors.borderColor}>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className={cn("flex items-center justify-center gap-2", colors.textMuted)}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>加载中...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tagGroupsData?.items?.length === 0 ? (
              <TableRow className={colors.borderColor}>
                <TableCell colSpan={4} className={cn("h-24 text-center", colors.textMuted)}>
                  暂无标签组
                </TableCell>
              </TableRow>
            ) : (
              tagGroupsData?.items?.map((group: ForumTagGroupWithId) => (
                <TableRow
                  key={group.id}
                  className={cn(
                    colors.borderColor,
                    "hover:bg-muted/50 data-[state=selected]:bg-muted",
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("h-6 w-6 rounded border", colors.borderColor)}
                        style={{ backgroundColor: group.color || "#6b7280" }}
                      />
                      <span className={cn("font-mono text-xs", colors.textMuted)}>
                        {group.color || "Default"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("font-medium", colors.textPrimary)}>
                    {group.name}
                  </TableCell>
                  <TableCell className={cn("text-center", colors.textSecondary)}>
                    {group.sortOrder}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* 添加标签到该组 */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", colors.textSecondary, colors.buttonHover)}
                        onClick={() => setManageTagsGroup(group)}
                        title="为该标签组添加标签"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", colors.textSecondary, colors.buttonHover)}
                        onClick={() => openEditDialog(group)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 hover:text-red-500",
                          colors.textSecondary,
                          colors.buttonHover,
                        )}
                        onClick={() => setDeletingGroup(group)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 添加标签对话框 */}
      {manageTagsGroup && (
        <ManageGroupTagsDialog
          groupId={manageTagsGroup.id}
          groupName={manageTagsGroup.name}
          open={!!manageTagsGroup}
          onClose={() => setManageTagsGroup(null)}
          onSaved={() => {
            // 刷新列表以反映可能的数量/展示变化
            refetch();
          }}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className={cn(colors.cardBg, colors.textPrimary)}>
          <DialogHeader>
            <DialogTitle className={colors.titleColor}>新建标签组</DialogTitle>
            <DialogDescription className={colors.textSecondary}>
              创建新的标签组来分类管理标签。
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>名称</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例如：编程语言"
                        {...field}
                        className={cn("focus-visible:ring-2", colors.inputBg, colors.inputBorder)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>颜色</FormLabel>
                    <FormControl>
                      <ColorPicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>排序权重</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className={cn("focus-visible:ring-2", colors.inputBg, colors.inputBorder)}
                      />
                    </FormControl>
                    <FormDescription className={colors.textMuted}>
                      数值越小排序越靠前
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsCreateOpen(false)}
                  className={cn(colors.buttonSecondary, "border-transparent")}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className={cn(colors.buttonPrimary)}
                >
                  {createMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  创建
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingGroup} onOpenChange={(open) => !open && setEditingGroup(null)}>
        <DialogContent className={cn(colors.cardBg, colors.textPrimary)}>
          <DialogHeader>
            <DialogTitle className={colors.titleColor}>编辑标签组</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>名称</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例如：编程语言"
                        {...field}
                        className={cn("focus-visible:ring-2", colors.inputBg, colors.inputBorder)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>颜色</FormLabel>
                    <FormControl>
                      <ColorPicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>排序权重</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className={cn("focus-visible:ring-2", colors.inputBg, colors.inputBorder)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setEditingGroup(null)}
                  className={cn(colors.buttonSecondary, "border-transparent")}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className={cn(colors.buttonPrimary)}
                >
                  {updateMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  保存
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deletingGroup} onOpenChange={(open) => !open && setDeletingGroup(null)}>
        <AlertDialogContent className={cn(colors.cardBg, colors.textPrimary)}>
          <AlertDialogHeader>
            <AlertDialogTitle className={colors.titleColor}>确认删除？</AlertDialogTitle>
            <AlertDialogDescription className={colors.textSecondary}>
              您确定要删除标签组 "{deletingGroup?.name}"
              吗？此操作不可恢复，且可能影响组内标签的显示。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn(colors.buttonSecondary, "border-transparent")}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
