export interface UserBonusLedger {
  id?: string | number;
  userId: string;
  username?: string;
  delta: string;
  reason: string;
  refType?: string;
  refId?: string;
  externalRef?: string;
  type: string;
  correlationId?: string;
  createdAt?: string;
  balanceAfter?: string;
}

export interface BonusLedgerQuery {
  userId?: string;
  type?: string;
  reason?: string;
  externalRef?: string;
  correlationId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}
