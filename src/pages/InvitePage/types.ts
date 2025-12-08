export interface InviteCode {
  id: string;
  code: string;
  status: 'unused' | 'used' | 'expired';
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
  expiresAt: string;
}

export interface SentInvite {
  id: string;
  code: string;
  recipientName: string;
  recipientEmail: string;
  status: 'registered' | 'pending' | 'expired';
  sentAt: string;
  registeredAt?: string;
  expiresAt: string;
}

export interface InvitedUser {
  id: string;
  username: string;
  email: string;
  joinedAt: string;
  uploadData: string;
  downloadData: string;
  shareRatio: string;
  status: 'active' | 'vip';
  inviteCode: string;
}
