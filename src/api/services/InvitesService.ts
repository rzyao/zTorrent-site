/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExportInvitesDto } from '../models/ExportInvitesDto';
import type { GrantQuotaDto } from '../models/GrantQuotaDto';
import type { ListInviteQuotaDto } from '../models/ListInviteQuotaDto';
import type { ListInvitesDto } from '../models/ListInvitesDto';
import type { ResendInviteDto } from '../models/ResendInviteDto';
import type { RevokeInviteDto } from '../models/RevokeInviteDto';
import type { SendInviteDto } from '../models/SendInviteDto';
import type { StatisticsDto } from '../models/StatisticsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitesService {
    /**
     * 分页查询邀请记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerListInvites(
        requestBody: ListInvitesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: any[];
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/list',
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
    /**
     * 分页查询邀请名额
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerListQuotas(
        requestBody: ListInviteQuotaDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: any[];
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/quota/list',
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
    /**
     * 撤销未使用的邀请
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerRevoke(
        requestBody: RevokeInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            recordId?: number;
            status?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/revoke',
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
    /**
     * 重发邀请邮件
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerResend(
        requestBody: ResendInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            recordId?: number;
            lastEmailSentAt?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/resend',
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
    /**
     * 邀请记录统计聚合
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerStatistics(
        requestBody: StatisticsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            buckets?: any[];
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/statistics',
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
    /**
     * 导出邀请记录为CSV
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerExport(
        requestBody: ExportInvitesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            url?: string;
            expiresAt?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/export',
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
    /**
     * 发送私人邀请（消耗一个邀请名额）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerSendPrivate(
        requestBody: SendInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            code?: string;
            recordId?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/send-private',
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
    /**
     * 发送官方邀请（不消耗用户名额）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerSendOfficial(
        requestBody: SendInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            code?: string;
            recordId?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/send-official',
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
    /**
     * 授予用户邀请名额（永久/临时）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerGrantQuota(
        requestBody: GrantQuotaDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            added?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/quota/grant',
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
