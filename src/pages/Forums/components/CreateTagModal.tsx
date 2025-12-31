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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "标签名称不能为空"),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 重置表单当模态框打开时
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
      });
    }
  }, [isOpen, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormValues) => {
      return ForumsTagsService.tagsControllerCreate({
        name: data.name,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建新标签</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入标签名称..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "创建中..." : "创建"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
