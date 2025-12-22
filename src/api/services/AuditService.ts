/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuditHistoryDto } from '../models/AuditHistoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuditService {
    /**
     * 统一审核历史查询
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static auditControllerHistory(
        requestBody: AuditHistoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<{
                reviewer?: string;
                action?: string;
                note?: string | null;
                timestamp?: string;
            }>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/audit/history',
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
