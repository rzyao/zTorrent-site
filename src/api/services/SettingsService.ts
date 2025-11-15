/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSettingDto } from '../models/CreateSettingDto';
import type { UpdateSettingsDto } from '../models/UpdateSettingsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * 获取系统设置
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerGet(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/settings',
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
     * 更新系统设置（部分字段）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerUpdate(
        requestBody: UpdateSettingsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/settings',
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
     * 新增设置（仅在不存在时创建）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerCreate(
        requestBody: CreateSettingDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/settings',
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
     * 按键删除设置
     * @param key
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerRemove(
        key: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/settings/{key}',
            path: {
                'key': key,
            },
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
