import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { TicketsService } from "@/api/services/TicketsService";

const replySchema = z.object({
  content: z.string().min(1, "请输入回复内容"),
  attachments: z.array(z.any()).optional().default([]),
});

export type ReplyFormValues = z.infer<typeof replySchema>;

export interface TicketAttachment {
  uid: string;
  name: string;
  url: string;
  size?: number;
}

export function useTicketDetailLogic() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<TicketAttachment[]>([]);

  // RHF setup
  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
      attachments: [],
    },
  });

  // Query Detail
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const res: any = await TicketsService.ticketsControllerDetail({ ticketId: id } as any);
      return {
        detail: res?.data || {},
        messages: res?.data?.messages ?? [],
      };
    },
    enabled: !!id,
  });

  // Mutations
  const closeMutation = useMutation({
    mutationFn: async () => {
      await TicketsService.ticketsControllerClose({
        ticketId: id,
        reason: "后台关闭",
      } as any);
    },
    onSuccess: () => {
      toast.success("已关闭");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || "关闭失败");
    },
  });

  // Resolve Mutation
  const resolveMutation = useMutation({
    mutationFn: async () => {
      await TicketsService.ticketsControllerConfirmResolved({ ticketId: id } as any);
    },
    onSuccess: () => {
      toast.success("已确认");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || "操作失败");
    },
  });

  // Reply Mutation
  const replyMutation = useMutation({
    mutationFn: async (values: ReplyFormValues) => {
      await TicketsService.ticketsControllerReply({
        ticketId: id,
        content: values.content,
        attachments: values.attachments,
      } as any);
    },
    onSuccess: () => {
      toast.success("已回复");
      form.reset({ content: "", attachments: [] });
      setFiles([]);
      refetch();
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || "回复失败");
    },
  });

  // Upload Logic
  const handleFileUpload = async (file: File) => {
    try {
      const res: any = await TicketsService.ticketsControllerUpload({
        ticketId: id,
        purpose: "reply",
        file,
      } as any);

      const att = res?.data?.attachment || res?.data;
      const currentAttachments = form.getValues("attachments") || [];

      form.setValue("attachments", [
        ...currentAttachments,
        {
          attachmentId: att?.attachmentId,
          url: att?.url,
          name: att?.name || file.name,
          size: att?.size || file.size,
        },
      ]);

      setFiles((prev) => [
        ...prev,
        {
          uid: String(Date.now() + Math.random()),
          name: att?.name || file.name,
          url: att?.url,
          size: att?.size || file.size,
        },
      ]);

      toast.success(`附件 ${file.name} 上传成功`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "上传失败");
    }
  };

  const onRemoveFile = (uid: string) => {
    const fileToRemove = files.find((f) => f.uid === uid);
    if (!fileToRemove) return;

    setFiles((fs) => fs.filter((x) => x.uid !== uid));
    const currentAttachments = form.getValues("attachments") || [];
    const newAttachments = currentAttachments.filter(
      (x: any) => x.name !== fileToRemove.name || x.url !== fileToRemove.url,
    );
    form.setValue("attachments", newAttachments);
  };

  const handleReply = form.handleSubmit((values) => {
    replyMutation.mutate(values);
  });

  return {
    id,
    navigate,
    loading: isLoading,
    detail: data?.detail,
    messages: data?.messages,
    form,
    files,
    setFiles,
    handleFileUpload,
    onRemoveFile,
    closeTicket: closeMutation.mutate,
    resolveTicket: resolveMutation.mutate,
    handleReply,
    replying: replyMutation.isPending,
  };
}
