import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

/**
 * 魔力值/积分相关接口轻量封装
 */
export type BonusBalance = {
  balance?: number;
  [key: string]: any;
};

function unwrap<T>(body: any): T {
  const maybeWrapped = body?.data ?? body;
  return maybeWrapped as T;
}

/**
 * 查询用户积分余额
 * GET /bonus/balance
 */
export async function getBonusBalance(): Promise<BonusBalance> {
  const resp = await __request(OpenAPI, {
    method: 'GET',
    url: '/bonus/balance',
  });
  return unwrap<BonusBalance>(resp);
}

