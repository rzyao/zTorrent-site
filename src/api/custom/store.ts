import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

/**
 * 积分商城相关类型定义
 * 说明：后端目前仅示例 invite_code；后续可扩展更多 key/type
 */
export type StoreItem = {
  id: string;
  key: string; // 商品唯一标识，如 'invite_code'
  title: string;
  type: 'virtual' | 'physical' | string;
  pricePoints: string; // 扣除积分，后端返回为字符串
  status: 'active' | 'inactive' | string; // 上架状态
};

export type PurchaseRequest = {
  userId?: string; // 来自 JWT 的 sub；后端可自行解析，允许前端不传
  itemKey: string; // 商品 key，例如 'invite_code'
  quantity: number; // 购买数量
  payload?: Record<string, any>; // 根据商品类型扩展字段；invite_code 需要 { email }
};

export type DeliveryResult = {
  ok?: boolean;
  code?: string; // 邀请码等交付结果
  recordId?: string; // 交付记录ID，便于售后或重试
};

export type PurchaseResult = {
  id?: string; // 订单号
  status?: string; // 订单状态，如 delivered/failed
  pointsCharged?: string; // 本次扣除积分（字符串）
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

/**
 * 获取商城商品列表
 * GET /store/items
 */
export async function getStoreItems(): Promise<StoreItem[]> {
  const resp = await __request(OpenAPI, {
    method: 'GET',
    url: '/store/items',
  });
  return unwrap<StoreItem[]>(resp);
}

/**
 * 提交积分购买订单
 * POST /store/purchase
 */
export async function purchaseItem(requestBody: PurchaseRequest): Promise<PurchaseResult> {
  const resp = await __request(OpenAPI, {
    method: 'POST',
    url: '/store/purchase',
    body: requestBody,
    mediaType: 'application/json',
  });
  return unwrap<PurchaseResult>(resp);
}

