import { getOpenAPI, getRequest } from '../lazy';

/**
 * 魔力值/积分相关接口轻量封装
 */
export type BonusBalance = {
  balance?: string | number;
  lockedBalance?: string | number;
  updatedAt?: string;
  [key: string]: any;
};

function unwrap<T>(body: any): T {
  const maybeWrapped = body?.data ?? body;
  return maybeWrapped as T;
}

export async function getBonusBalance(): Promise<BonusBalance> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/bonus/balance',
    body: {},
    mediaType: 'application/json',
  });
  return unwrap<BonusBalance>(resp);
}

export type BonusOverview = {
  balance: string | number;
  totalEarned: string | number;
  totalSpent: string | number;
  monthTrend: Array<{ month: string; earned: string | number; spent: string | number }>;
  rank?: number;
  updatedAt?: string;
};

export async function getBonusOverview(): Promise<BonusOverview> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/bonus/overview',
    body: {},
    mediaType: 'application/json',
  });
  return unwrap<BonusOverview>(resp);
}

export type LedgerItem = {
  id: string;
  userId?: string;
  delta: string | number;
  reason: string;
  refType?: string | null;
  refId?: string | null;
  externalRef?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
};

export type LedgerRequest = {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
  types?: Array<'earn' | 'spend'>;
  reasons?: string[];
};

export type LedgerResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: LedgerItem[];
};

export async function getBonusLedger(body: LedgerRequest): Promise<LedgerResponse> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/bonus/ledger',
    body,
    mediaType: 'application/json',
  });
  return unwrap<LedgerResponse>(resp);
}
