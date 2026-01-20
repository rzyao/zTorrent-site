import { useState } from "react";
import { toast } from "sonner";
import { MessagesService } from "@/api/services/MessagesService";
import { ImagesService } from "@/api/services/ImagesService";
import { unwrapResponse, extractErrorMessage } from "../utils/utils";

export function useCompose() {
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState<"plain" | "markdown" | "html">("plain");
  const [attachments, setAttachments] = useState<string[]>([]);

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
        setAttachments((prev) => [...prev, url]);
        toast.success("图片上传成功");
      } else {
        toast.error("图片上传失败");
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const sendMessage = async () => {
    try {
      if (!recipientId || !content) {
        toast.error("请填写收件人与内容");
        return;
      }
      const resp = await MessagesService.messagesControllerSend({
        recipientId,
        content,
        format,
        attachments,
      } as any);
      unwrapResponse(resp);
      toast.success("消息已发送");
      setRecipientId("");
      setSubject("");
      setContent("");
      setAttachments([]);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    recipientId,
    setRecipientId,
    subject,
    setSubject,
    content,
    setContent,
    format,
    setFormat,
    attachments,
    setAttachments,
    uploadImage,
    sendMessage,
  } as const;
}
