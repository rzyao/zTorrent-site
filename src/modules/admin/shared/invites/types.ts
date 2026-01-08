export type InviteStatus = "sent" | "accepted" | "expired" | "revoked";

export type InviteType = "private-invitation" | "office-invitation";

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

export interface InviteQuota {
  id: string;
  userId: string;
  isPermanent: boolean;
  expiresAt?: string;
  consumedAt?: string;
  consumedRecordId?: string;
}

export interface StatisticRow {
  time: string;
  total: number;
  unused: number;
  accepted: number;
  expired: number;
  revoked: number;
}
