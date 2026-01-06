import { useState } from 'react';
import { toast } from 'sonner';
import { OpenAPI } from '@/api/core/OpenAPI';
import { request as __request } from '@/api/core/request';
import { unwrapResponse, extractErrorMessage } from '../utils/utils';

export function useReply() {
  const [replyContent, setReplyContent] = useState('');
  const [replyFormat, setReplyFormat] = useState<'plain' | 'markdown' | 'html'>('plain');
  const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      const resp = await __request(OpenAPI, { method: 'POST', url: '/images/upload', formData: { file }, mediaType: 'multipart/form-data' });
      const data = unwrapResponse<{ url: string }>(resp);
      const url = (data as any)?.url;
      if (typeof url === 'string' && url) {
        setReplyAttachments(prev => [...prev, url]);
        toast.success('图片上传成功');
      } else {
        toast.error('图片上传失败');
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  };

  const clearReply = () => {
    setReplyContent('');
    setReplyAttachments([]);
    setReplyToMessageId(null);
  };

  const sendReply = async (peerUserId: string) => {
    try {
      if (!peerUserId || !replyContent) {
        toast.error('请填写回复内容');
        return;
      }
      const resp = await __request(OpenAPI, {
        method: 'POST',
        url: '/messages/reply',
        body: {
          peerUserId,
          replyToMessageId: replyToMessageId || undefined,
          content: replyContent,
          format: replyFormat,
          attachments: replyAttachments,
        },
        mediaType: 'application/json',
      });
      unwrapResponse(resp);
      toast.success('回复已发送');
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

