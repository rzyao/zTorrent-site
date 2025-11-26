/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCreateNotificationDto } from '../models/AdminCreateNotificationDto';
import type { AdminCreateTargetedNotificationDto } from '../models/AdminCreateTargetedNotificationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MessagesAdminService {
    /**
     * 创建广播通知
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static adminMessagesControllerCreate(
        requestBody: AdminCreateNotificationDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            id?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/messages/notifications/create',
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
     * 创建定向通知
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static adminMessagesControllerCreateTargeted(
        requestBody: AdminCreateTargetedNotificationDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            id?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/messages/notifications/create-targeted',
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
