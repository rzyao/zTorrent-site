/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * 发送邀请的系统通知（站内信/邮件）
     * @returns any 成功
     * @throws ApiError
     */
    public static notificationsControllerSendInvite(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            delivered?: boolean;
            messageId?: string;
            channel?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications/send-invite',
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
