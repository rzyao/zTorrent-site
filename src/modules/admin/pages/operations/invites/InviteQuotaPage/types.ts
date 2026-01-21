/**
 * 邀请名额类型定义
 */
export interface InviteQuota {
  id: string;
  userId: string;
  isPermanent: boolean;
  expiresAt?: string;
  consumedAt?: string;
  consumedRecordId?: string;
}

/**
 * 邀请名额查询参数
 */
export interface InviteQuotaQuery {
  page: number;
  limit: number;
  userId?: string;
  permanentOnly?: boolean;
  activeOnly?: boolean;
}
