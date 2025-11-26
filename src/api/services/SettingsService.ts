/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSettingDto } from '../models/CreateSettingDto';
import type { UpdateSettingsDto } from '../models/UpdateSettingsDto';
import type { UpdateSettingsItemsDto } from '../models/UpdateSettingsItemsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * 获取设置列表（详细字段）
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerListSetting(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            id?: string;
            createdAt?: string;
            updatedAt?: string;
            deletedAt?: string | null;
            key?: string;
            value?: string;
            comment?: string | null;
            type?: 'string' | 'number' | 'boolean' | 'json';
            group?: string;
            description?: string | null;
            mutable?: number;
            jsonSchema?: string | null;
            updatedBy?: string | null;
            version?: number;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/settings/list-setting',
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
     * 按分组获取系统设置
     * @param group
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerGetGroup(
        group: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/settings/groups/{group}',
            path: {
                'group': group,
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
     * 批量更新系统设置（通用 items 数组）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerUpdateItems(
        requestBody: UpdateSettingsItemsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/settings/items',
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
