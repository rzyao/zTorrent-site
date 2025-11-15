/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GrantQuotaDto } from '../models/GrantQuotaDto';
import type { SendInviteDto } from '../models/SendInviteDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitesService {
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
