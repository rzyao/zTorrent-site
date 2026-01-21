import { useState } from "react";
import { toast } from "sonner";
import { ImagesService } from "@/api/services/ImagesService";
import { unwrapResponse, extractErrorMessage } from "../utils/utils";
import { MessagesService } from "@/api/services/MessagesService";
import { ReplyMessageDto } from "@/api/models/ReplyMessageDto";

export function useReply() {
  const [replyContent, setReplyContent] = useState("");
  const [replyFormat, setReplyFormat] = useState<"plain" | "markdown" | "html">("plain");
  const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

  const fileToBase64 = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const uploadImage = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const resp = await ImagesService.imagesControllerUpload({
        content: base64,
        filename: file.name,
      });
      const url = resp?.data?.url;
      if (typeof url === "string" && url) {
        setReplyAttachments((prev) => [...prev, url]);
        toast.success("图片上传成功");
      } else {
        toast.error("图片上传失败");
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const clearReply = () => {
    setReplyContent("");
    setReplyAttachments([]);
    setReplyToMessageId(null);
  };

  const sendReply = async (peerUserId: string) => {
    try {
      if (!peerUserId || !replyContent) {
        toast.error("请填写回复内容");
        return;
      }
      const resp = await MessagesService.messagesControllerReply({
        peerUserId,
        replyToMessageId: replyToMessageId || undefined,
        content: replyContent,
        format: replyFormat as ReplyMessageDto.format,
        attachments: replyAttachments,
      });
      unwrapResponse(resp);
      toast.success("回复已发送");
      clearReply();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    replyContent,
    setReplyContent,
    replyFormat,
    setReplyFormat,
    replyAttachments,
    setReplyAttachments,
    replyToMessageId,
    setReplyToMessageId,
    uploadImage,
    clearReply,
    sendReply,
  } as const;
}
