/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePunishmentDictDto } from '../models/CreatePunishmentDictDto';
import type { ListPunishmentDictDto } from '../models/ListPunishmentDictDto';
import type { PunishmentDictIdDto } from '../models/PunishmentDictIdDto';
import type { UpdatePunishmentDictDto } from '../models/UpdatePunishmentDictDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PunishmentDictsService {
    /**
     * 创建处罚字典项
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentDictsControllerCreate(
        requestBody: CreatePunishmentDictDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishment-dicts/create',
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
     * 更新处罚字典项
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentDictsControllerUpdate(
        requestBody: {
            id: string;
            data: UpdatePunishmentDictDto;
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
            url: '/punishment-dicts/update',
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
     * 删除处罚字典项
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentDictsControllerDelete(
        requestBody: PunishmentDictIdDto,
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
            url: '/punishment-dicts/delete',
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
     * 列出处罚字典项
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentDictsControllerList(
        requestBody: ListPunishmentDictDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishment-dicts/list',
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
     * 获取处罚字典选项 (下拉菜单用)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentDictsControllerOptions(
        requestBody: {
            category: 'BAN_DAYS' | 'BAN_REASON' | 'PUNISHMENT_TYPE' | 'UNBAN_REASON';
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            key?: string;
            label?: string;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishment-dicts/options',
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
