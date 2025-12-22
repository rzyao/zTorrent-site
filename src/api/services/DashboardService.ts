/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardService {
    /**
     * 用户概要查询（上传/下载/分享率/魔力值/未读通知/未读收件箱）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static dashboardControllerSummary(
        requestBody: EmptyObjectDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            uploadedBytes?: number;
            downloadedBytes?: number;
            ratio?: number;
            bonus?: string;
            unreadNotifications?: number;
            unreadInbox?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dashboard/me/summary',
            body: requestBody,
            mediaType: 'application/json',
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
