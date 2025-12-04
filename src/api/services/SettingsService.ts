/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSettingDto } from '../models/CreateSettingDto';
import type { DeleteSettingDto } from '../models/DeleteSettingDto';
import type { DeleteSettingResponseDto } from '../models/DeleteSettingResponseDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { ListSettingsByGroupDto } from '../models/ListSettingsByGroupDto';
import type { ReviewSwitchesResponseDto } from '../models/ReviewSwitchesResponseDto';
import type { SettingItemDto } from '../models/SettingItemDto';
import type { UpdateSettingMetaDto } from '../models/UpdateSettingMetaDto';
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
        data?: Array<SettingItemDto>;
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
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerListSettingsByGroup(
        requestBody: ListSettingsByGroupDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<SettingItemDto>;
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
     * 批量更新系统设置（仅更新值，不支持重命名）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerUpdateSettingsItems(
        requestBody: UpdateSettingsItemsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
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
                409: `资源冲突`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 新增设置（仅当键不存在时创建；存在则返回冲突）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerCreate(
        requestBody: CreateSettingDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: string;
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
                409: `资源冲突`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 按键删除设置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerDeleteSettingByKey(
        requestBody: DeleteSettingDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: DeleteSettingResponseDto;
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
     * 更新设置项的元数据（支持重命名 key）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static settingsControllerUpdateSettingMeta(
        requestBody: UpdateSettingMetaDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SettingItemDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/settings/update-setting-meta',
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
        data?: ReviewSwitchesResponseDto;
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
