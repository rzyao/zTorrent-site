import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ForumsTagsService } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/modules/forum/components/ui/dialog";
import { Button } from "@/modules/forum/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/forum/components/ui/form";
import { Input } from "@/modules/forum/components/ui/input";
import { Checkbox } from "@/modules/forum/components/ui/checkbox";
import { ScrollArea } from "@/modules/forum/components/ui/scroll-area";
import { useTagGroupsQuery } from "../hooks/useTagGroups";
import { useForumTheme } from "../context/ForumThemeContext";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "标签名称不能为空"),
  groupIds: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: string;
}

export function EditTagModal({ isOpen, onClose, tagId }: EditTagModalProps) {
  const queryClient = useQueryClient();
  const { colors } = useForumTheme();
  const { data: tagGroupsData, isLoading: isLoadingGroups } = useTagGroupsQuery(1, 200);

  const { data: tagDetail } = useQuery({
    queryKey: ["forum", "tag", "detail", tagId],
    queryFn: async () => {
      const res = await ForumsTagsService.tagsControllerFindOne({ id: tagId } as any);
      return res.data as any;
    },
    enabled: isOpen && !!tagId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      groupIds: [],
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    // 统一依据后端返回的 groups 字段计算默认选中
    // 说明：后端已将 /forums/tags/detail 的返回补齐 groups: ForumTagGroup[]
    // 因此这里不再兼容旧的 groupIds 字段，直接使用 groups[].id
    const name = String(tagDetail?.name ?? "");
    const groupIds = Array.isArray(tagDetail?.groups)
      ? (tagDetail?.groups as any[]).map((g: any) => String(g?.id))
      : [];
    form.reset({ name, groupIds });
  }, [isOpen, tagDetail, form]);

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) =>
      ForumsTagsService.tagsControllerUpdate({
        id: tagId,
        name: data.name,
        groupIds: data.groupIds,
      }),
    onSuccess: () => {
      toast.success("标签更新成功");
      queryClient.invalidateQueries({ queryKey: ["forums", "tags"] });
      queryClient.invalidateQueries({ queryKey: ["forum", "tag", "detail", tagId] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新失败");
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[500px]", colors.cardBg, colors.textPrimary)}>
        <DialogHeader>
          <DialogTitle className={colors.titleColor}>编辑标签</DialogTitle>
          <DialogDescription className={colors.textSecondary}>修改标签名称与所属标签组</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={colors.textSecondary}>名称</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="标签名称不可修改"
                      {...field}
                      disabled
                      readOnly
                      className={cn("focus-visible:ring-2", colors.inputBg, colors.inputBorder)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupIds"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className={colors.textSecondary}>所属标签组</FormLabel>
                    <FormDescription className={colors.textMuted}>可多选</FormDescription>
                  </div>
                  <div className={cn("rounded-md border p-3", colors.borderColor, colors.inputBg)}>
                    <ScrollArea className="h-[150px]">
                      {isLoadingGroups ? (
                        <div className={cn("py-4 text-center text-sm", colors.textMuted)}>加载标签组...</div>
                      ) : tagGroupsData?.items && tagGroupsData.items.length > 0 ? (
                        <div className="space-y-3">
                          {tagGroupsData.items.map((group) => (
                            <FormField
                              key={group.id}
                              control={form.control}
                              name="groupIds"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(String(group.id))}
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? field.onChange([...field.value, String(group.id)])
                                          : field.onChange(field.value?.filter((v) => v !== String(group.id)))
                                      }
                                      className={cn(
                                        // 将选中态统一为 #0088CC，满足视觉规范
                                        "data-[state=checked]:bg-[#0088CC] data-[state=checked]:text-white data-[state=checked]:border-[#0088CC] border-gray-400",
                                        colors.borderColor,
                                      )}
                                    /* 边框不再继承标签组颜色，避免出现红色/其他色的边框
                                       说明：组色指示通过右侧的小圆点展示；未选中时边框保持中性灰，选中时为 #0088CC */
                                    />
                                  </FormControl>
                                  <FormLabel className={cn("flex cursor-pointer items-center gap-2 font-normal", colors.textPrimary)}>
                                    <span>{group.name}</span>
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={cn("py-4 text-center text-sm", colors.textMuted)}>暂无标签组</div>
                      )}
                    </ScrollArea>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {/* 使用 Button 的语义化变体“cancel”，替代不受支持的“outline”
                 原因：Button 组件的 variant 类型为 "none" | "default" | "primary" | "cancel" | "danger" | "destructive"
                 而 "outline" 不在允许范围内，导致类型错误。这里选择 "cancel" 以符合“取消”按钮语义与样式 */}
              <Button type="button" variant="cancel" onClick={onClose} >
                取消
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className={colors.buttonPrimary}>
                {updateMutation.isPending ? "保存中..." : "保存更改"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
