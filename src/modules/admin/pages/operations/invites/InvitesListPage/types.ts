/**
 * 邀请状态类型
 */
export type InviteStatus = "sent" | "accepted" | "expired" | "revoked";

/**
 * 邀请类型
 */
export type InviteType = "private-invitation" | "office-invitation";

/**
 * 邀请记录
 */
export interface InviteRecord {
  id: string;
  createdAt: string;
  inviterUserId: string;
  inviteeEmail: string;
  code: string;
  status: InviteStatus;
  type: InviteType;
  expiresAt: string;
  acceptedAt?: string;
}

/**
 * 邀请列表查询参数
 */
export interface InvitesListQuery {
  page: number;
  limit: number;
  status?: InviteStatus;
  type?: InviteType;
  email?: string;
  issuerId?: string;
  dateFrom?: string;
  dateTo?: string;
}
