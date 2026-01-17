export type ForumTopicBountyStatus = 'open' | 'awarded' | 'expired' | 'canceled';
export type ForumTopicBountyCancelRequestStatus = 'none' | 'pending' | 'approved' | 'rejected';

export type ForumTopicBounty = {
  id: string;
  topicId: string;
  sponsorUserId: string;
  amount: string;
  expiresAt: string;
  status: ForumTopicBountyStatus;
  cancelRequestStatus: ForumTopicBountyCancelRequestStatus;
  cancelRequestedAt?: string;
  cancelRequestReason?: string;
  winnerPostId?: string;
  winnerUserId?: string;
  awardedAt?: string;
  expiredAt?: string;
  expiredPayoutUserCount?: number;
  expiredPayoutPerUser?: string;
};

