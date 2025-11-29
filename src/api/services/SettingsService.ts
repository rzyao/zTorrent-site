/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSettingDto } from '../models/CreateSettingDto';
import type { UpdateSettingsItemsDto } from '../models/UpdateSettingsItemsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * 获取设置列表
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerListDetailedSettingsLegacy(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            id?: number;
            createdAt?: string;
            updatedAt?: string;
            deletedAt?: string | null;
            key?: string;
            value?: string;
            comment?: string | null;
            type?: 'string' | 'number' | 'boolean' | 'json';
            group?: string;
            sort?: number;
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
     * 按分组获取设置列表（详细字段）
     * @param requestBody 按分组查询设置列表的请求体
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerListSettingsByGroup(
        requestBody: {
            group: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            id?: number;
            createdAt?: string;
            updatedAt?: string;
            deletedAt?: string | null;
            key?: string;
            value?: string;
            comment?: string | null;
            type?: 'string' | 'number' | 'boolean' | 'json';
            group?: string;
            sort?: number;
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
            url: '/settings/list-setting-by-group',
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
    public static settingsControllerUpdateSettingsItems(
        requestBody: UpdateSettingsItemsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/settings/update-items',
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
            url: '/settings/create-setting',
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
     * @param requestBody 按键删除设置的请求体
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerDeleteSettingByKey(
        requestBody: {
            key: string;
        },
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
            method: 'POST',
            url: '/settings/delete-setting',
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
     * 读取审核开关（只读）
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerGetReviewSwitches(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            filmReview?: boolean;
            playlistReview?: boolean;
            torrentReview?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/settings/review-switches',
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
