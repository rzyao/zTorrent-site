import { getOpenAPI, getRequest } from '../lazy';

/**
 * 积分商城相关类型定义
 * 说明：后端目前仅示例 invite_code；后续可扩展更多 key/type
 */
export type StoreItem = {
  id: string;
  key: string;
  title: string;
  type: 'virtual' | 'physical' | string;
  pricePoints: string;
  status: 'active' | 'inactive' | string;
  stock?: number | null;
};

export type PurchaseRequest = {
  userId?: string;
  itemKey: string;
  quantity: number;
  payload?: Record<string, any>;
};

export type DeliveryResult = {
  ok?: boolean;
  code?: string;
  recordId?: string;
  added?: number;
  targetUserId?: string;
  expiresAt?: string;
};

export type PurchaseResult = {
  id?: string;
  status?: string;
  pointsCharged?: string;
  quantity?: number;
  payload?: Record<string, any>;
  deliveryResult?: DeliveryResult;
};

/**
 * 响应标准化：兼容两种后端响应结构
 * 1) 直接返回对象数组
 * 2) 包裹结构 { code, message, data }
 */
function unwrap<T>(body: any): T {
  const maybeWrapped = body?.data ?? body;
  return maybeWrapped as T;
}

export type StoreItemListRequest = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: 'active' | 'inactive' | string;
};

export async function getStoreItems(body: StoreItemListRequest = {}): Promise<StoreItem[]> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/store/items/list',
    body,
    mediaType: 'application/json',
  });
  const list = unwrap<any>(resp);
  if (Array.isArray(list)) return list as StoreItem[];
  return unwrap<{ items: StoreItem[] }>(resp).items ?? [];
}

/**
 * 提交积分购买订单
 * POST /store/purchase
 */
export async function purchaseItem(requestBody: PurchaseRequest, idempotencyKey?: string): Promise<PurchaseResult> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/store/purchase',
    body: requestBody,
    mediaType: 'application/json',
    headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
  });
  return unwrap<PurchaseResult>(resp);
}

export async function purchaseInviteCode(quantity: number = 1, idempotencyKey?: string): Promise<PurchaseResult> {
  return purchaseItem({ itemKey: 'invite_code', quantity }, idempotencyKey);
}

export type OrderDetail = {
  id: string;
  userId?: string;
  itemId?: string;
  status: string;
  pointsCharged?: string;
  quantity?: number;
  payload?: Record<string, any>;
  deliveryResult?: DeliveryResult;
  createdAt?: string;
  updatedAt?: string;
};

export async function getOrderDetail(body: { id: string }): Promise<OrderDetail> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/store/orders/detail',
    body,
    mediaType: 'application/json',
  });
  return unwrap<OrderDetail>(resp);
}

export type OrdersListRequest = {
  page?: number;
  pageSize?: number;
  status?: string;
  from?: string;
  to?: string;
};

export type OrdersListResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: Array<Pick<OrderDetail, 'id' | 'status' | 'pointsCharged' | 'quantity' | 'createdAt'>>;
};

export async function getOrdersList(body: OrdersListRequest): Promise<OrdersListResponse> {
  const OpenAPI = await getOpenAPI();
  const request = await getRequest();
  const resp = await (request as any)(OpenAPI, {
    method: 'POST',
    url: '/store/orders/list',
    body,
    mediaType: 'application/json',
  });
  return unwrap<OrdersListResponse>(resp);
}
