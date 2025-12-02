/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BonusService {
    /**
     * 查询积分余额
     * @param userId
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerBalance(
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bonus/balance',
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * 查询积分余额（POST）
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerBalancePost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/balance',
        });
    }
    /**
     * 查询积分流水
     * @param userId
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerLedger(
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bonus/ledger',
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * 查询积分流水（POST）
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerLedgerPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/ledger',
        });
    }
    /**
     * 按规则计算并发放积分（管理员/系统）
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerApply(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/apply',
        });
    }
    /**
     * 积分概览
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerOverview(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/overview',
        });
    }
}
