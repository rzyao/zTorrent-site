/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DevService {
    /**
     * 发现所有 @Permissions 装饰器中的权限key并构建权限树
     * @returns any 成功
     * @throws ApiError
     */
    public static devControllerDiscover(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dev/permissions/discover',
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
     * 将发现的权限key插入到权限表（父级优先）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static devControllerSeed(
        requestBody: {
            /**
             * 操作者ID；未提供则尝试从登录用户中取
             */
            operatorId?: string;
            /**
             * 默认类型
             */
            type?: 'api' | 'page' | 'button';
            /**
             * 默认作用范围
             */
            scope?: 'web' | 'admin';
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dev/permissions/seed',
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
