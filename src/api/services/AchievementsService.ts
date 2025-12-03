/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AchievementsService {
    /**
     * 成就列表（展示与进度）
     * @returns any 成功
     * @throws ApiError
     */
    public static achievementsControllerList(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: any[];
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/achievements/list',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 领取成就奖励
     * @returns any 成功
     * @throws ApiError
     */
    public static achievementsControllerClaim(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            claimed?: boolean;
            invitesGranted?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/achievements/claim',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
}
