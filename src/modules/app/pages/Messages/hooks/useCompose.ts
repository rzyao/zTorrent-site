import { useState } from 'react';
import { toast } from 'sonner';
import { OpenAPI } from '@/api/core/OpenAPI';
import { MessagesService } from '@/api/services/MessagesService';
import { request as __request } from '@/api/core/request';
import { unwrapResponse, extractErrorMessage } from '../utils/utils';

export function useCompose() {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [format, setFormat] = useState<'plain' | 'markdown' | 'html'>('plain');
  const [attachments, setAttachments] = useState<string[]>([]);

  const uploadImage = async (file: File) => {
    try {
      const resp = await __request(OpenAPI, { method: 'POST', url: '/images/upload', formData: { file }, mediaType: 'multipart/form-data' });
      const data = unwrapResponse<{ url: string }>(resp);
      const url = (data as any)?.url;
      if (typeof url === 'string' && url) {
        setAttachments(prev => [...prev, url]);
        toast.success('图片上传成功');
      } else {
        toast.error('图片上传失败');
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const sendMessage = async () => {
    try {
      if (!recipientId || !content) {
        toast.error('请填写收件人与内容');
        return;
      }
      const resp = await MessagesService.messagesControllerSend({ recipientId, content, format, attachments } as any);
      unwrapResponse(resp);
      toast.success('消息已发送');
      setRecipientId('');
      setSubject('');
      setContent('');
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

