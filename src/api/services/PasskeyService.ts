/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { PasskeyDto } from '../models/PasskeyDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PasskeyService {
    /**
     * 回源校验：检查passkey是否有效（用于Tracker）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static passkeyControllerVerify(
        requestBody: PasskeyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            valid?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/passkey/verify',
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
     * 将passkey加入Redis白名单集合
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static passkeyControllerAdd(
        requestBody: PasskeyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/passkey/add',
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
     * 从Redis白名单集合移除passkey
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static passkeyControllerRemove(
        requestBody: PasskeyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/passkey/remove',
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
     * 从数据库全量刷新白名单（原子切换）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static passkeyControllerRefresh(
        requestBody: EmptyObjectDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            count?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/passkey/refresh',
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
