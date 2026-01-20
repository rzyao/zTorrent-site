import { useQuery } from "@tanstack/react-query";
import { AttachmentsService } from "@/api/services/AttachmentsService";
import type { AttachmentDto } from "@/api/models/AttachmentDto";

/**
 * useAttachments
 * 统一按附件绑定关系查询图片/文件列表，并缓存结果。
 * 参数：
 * - attachableType: 业务对象类型（如 'torrent' | 'series' | 'movie' | 'playlist'）
 * - attachableId: 业务对象 ID
 * - field: 语义字段（如 'cover' | 'cover_thumb' | 'cover_medium' | 'cover_large' | 'still'）
 */
export function useAttachments(attachableType: string, attachableId: string, field?: string) {
  const enabled = Boolean(attachableType && attachableId);
  const queryKey = ["attachments", attachableType, attachableId, field || "all"];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      const resp = await AttachmentsService.attachmentsControllerList(
        attachableType,
        attachableId,
        field
      );
      const list = resp?.data ?? [];
      return list as AttachmentDto[];
    },
  });

  return {
    loading: isLoading,
    error,
    items: data || [],
    refetch,
    urls: (data || []).map((a) => a.url),
  };
}
