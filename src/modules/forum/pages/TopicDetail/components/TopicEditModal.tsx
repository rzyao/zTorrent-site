import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ForumsTopicsService } from "@/api";
import { useForumTheme } from "../../../context/ForumThemeContext";
import { useForumsCategories } from "../../../hooks/useForumsCategories";
import { useForumsTagsQuery } from "../../../hooks/useForumsTagsQuery";
import { useAllowedTagsForCategory } from "../../../hooks/useAllowedTagsForCategory";
import { cn } from "@/utils/cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/forum/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/modules/forum/components/ui/form";
import { Input } from "@/modules/forum/components/ui/input";
import { Button } from "@/modules/forum/components/ui/button";
import { RichTextEditor } from "@/modules/forum/components/Composer/RichTextEditor";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/forum/components/ui/select";
import { Checkbox } from "@/modules/forum/components/ui/checkbox";
import { ScrollArea } from "@/modules/forum/components/ui/scroll-area";
import { MultiSelect } from "@/modules/forum/components/ui/MultiSelect";

const schema = z.object({
  title: z.string().min(1, "标题不能为空"),
  categoryId: z.string().min(1, "请选择分类"),
  tagNames: z.array(z.string()).default([]),
  content: z.string().min(1, "正文不能为空"),
});

type FormValues = z.infer<typeof schema>;

interface TopicEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  initial: { title: string; categoryId?: string; tags: string[]; content: string };
}

export function TopicEditModal({ isOpen, onClose, topicId, initial }: TopicEditModalProps) {
  const { colors } = useForumTheme();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useForumsCategories();
  const { data: tags = [] } = useForumsTagsQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial.title || "",
      categoryId: (initial.categoryId as string) || "",
      tagNames: initial.tags || [],
      content: initial.content || "",
    },
  });

  const categoryIdWatch = form.watch("categoryId");
  const { filterByAllowed } = useAllowedTagsForCategory(categoryIdWatch);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: initial.title || "",
        categoryId: (initial.categoryId as string) || "",
        tagNames: initial.tags || [],
        content: initial.content || "",
      });
    }
  }, [isOpen, initial, form]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      ForumsTopicsService.topicsControllerUpdate({
        id: topicId,
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        tagNames: data.tagNames,
      } as any),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["forum", "topic", topicId] });
      await queryClient.invalidateQueries({ queryKey: ["forum", "posts", topicId] });
      toast.success("保存成功");
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[720px]", colors.cardBg, colors.textPrimary)}>
        <DialogHeader>
          <DialogTitle className={colors.titleColor}>编辑话题</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={colors.textSecondary}>标题</FormLabel>
                  <FormControl>
                    <Input {...field} className={cn(colors.inputBg, colors.inputBorder)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>分类</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={cn("h-10 w-full", colors.inputBorder)}>
                          <SelectValue placeholder="请选择分类" />
                        </SelectTrigger>
                        <SelectContent className={cn(colors.borderColor, colors.inputBg)}>
                          {categories.map((c: any) => (
                            <SelectItem key={String((c as any).id)} value={String((c as any).id)}>
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 rounded"
                                  style={{ backgroundColor: `#${c.color}` }}
                                />
                                <span>{c.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tagNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={colors.textSecondary}>标签（多选）</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={filterByAllowed(tags).map((t: any) => ({
                          label: t.name,
                          value: t.name,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="请选择标签"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={colors.textSecondary}>正文</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      placeholder="编辑话题正文..."
                      className="min-h-[220px]"
                      isUploading={false}
                      onImageUploadClick={() => {}}
                      toolbarPrefix={null}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="cancel" size="sm" onClick={onClose}>
                取消
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={mutation.isPending}>
                保存更改
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
