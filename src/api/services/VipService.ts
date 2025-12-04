/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VipMonthlyInvitesResponseDto } from '../models/VipMonthlyInvitesResponseDto';
import type { VipStatusResponseDto } from '../models/VipStatusResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VipService {
    /**
     * VIP 状态查询
     * @returns any 成功
     * @throws ApiError
     */
    public static vipControllerStatus(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: VipStatusResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vip/status',
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
     * VIP 月度赠码查询
     * @returns any 成功
     * @throws ApiError
     */
    public static vipControllerMonthlyInvites(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: VipMonthlyInvitesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vip/monthly-invites',
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
