import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";
import { useEffect } from "react";
import { useTagGroupsQuery } from "../hooks/useTagGroups";
import { useForumTheme } from "../context/ForumThemeContext";
import { cn } from "@/utils/cn";

const formSchema = z.object({
  name: z.string().min(1, "标签名称不能为空"),
  groupIds: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 创建标签模态框
 */
export function CreateTagModal({ isOpen, onClose }: CreateTagModalProps) {
  const queryClient = useQueryClient();
  const { colors } = useForumTheme();

  // 获取所有标签组，用于选择
  const { data: tagGroupsData, isLoading: isLoadingGroups } = useTagGroupsQuery(1, 100);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      groupIds: [],
    },
  });

  // 重置表单当模态框打开时
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        groupIds: [],
      });
    }
  }, [isOpen, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormValues) => {
      console.log("Creating tag with data:", data);
      return ForumsTagsService.tagsControllerCreate({
        name: data.name,
        groupIds: data.groupIds,
      });
    },
    onSuccess: () => {
      toast.success("标签创建成功");
      queryClient.invalidateQueries({ queryKey: ["forums", "tags"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "创建标签失败");
    },
  });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[500px]", colors.cardBg, colors.textPrimary)}>
        <DialogHeader>
          <DialogTitle className={colors.titleColor}>创建新标签</DialogTitle>
          <DialogDescription className={colors.textSecondary}>
            创建一个新标签并可选地将其分配给标签组。
          </DialogDescription>
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
                      placeholder="输入标签名称..."
                      {...field}
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
                    <FormDescription className={colors.textMuted}>
                      选择标签所属的组（可选，可多选）
                    </FormDescription>
                  </div>
                  <div className={cn("rounded-md border p-3", colors.borderColor, colors.inputBg)}>
                    <ScrollArea className="h-[150px]">
                      {isLoadingGroups ? (
                        <div className={cn("py-4 text-center text-sm", colors.textMuted)}>
                          加载标签组...
                        </div>
                      ) : tagGroupsData?.items && tagGroupsData.items.length > 0 ? (
                        <div className="space-y-3">
                          {tagGroupsData.items.map((group) => (
                            <FormField
                              key={group.id}
                              control={form.control}
                              name="groupIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={group.id}
                                    className="flex flex-row items-start space-y-0 space-x-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(group.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, group.id])
                                            : field.onChange(
                                              field.value?.filter((value) => value !== group.id),
                                            );
                                        }}
                                        className={cn(
                                          // 将选中态统一为 #0088CC，满足视觉规范
                                          "data-[state=checked]:bg-[#0088CC] data-[state=checked]:text-white data-[state=checked]:border-[#0088CC] border-gray-400",
                                          colors.borderColor,
                                        )}
                                      /* 边框不再继承标签组颜色，避免出现红色/其他色的边框
                                         说明：组色指示通过右侧的小圆点展示；未选中时边框保持中性灰，选中时为 #0088CC */
                                      />
                                    </FormControl>
                                    <FormLabel
                                      className={cn(
                                        "flex cursor-pointer items-center gap-2 font-normal",
                                        colors.textPrimary,
                                      )}
                                    >
                                      <span>{group.name}</span>
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={cn("py-4 text-center text-sm", colors.textMuted)}>
                          暂无标签组
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="cancel"
                onClick={onClose}
                className={cn(colors.buttonSecondary, "border-transparent")}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className={colors.buttonPrimary}
              >
                {createMutation.isPending ? "创建中..." : "创建"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
