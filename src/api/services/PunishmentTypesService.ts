/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePunishmentTypeDto } from '../models/CreatePunishmentTypeDto';
import type { ListPunishmentTypeDto } from '../models/ListPunishmentTypeDto';
import type { PunishmentTypeIdDto } from '../models/PunishmentTypeIdDto';
import type { UpdatePunishmentTypeDto } from '../models/UpdatePunishmentTypeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PunishmentTypesService {
    /**
     * 创建处罚类型
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentTypeControllerCreate(
        requestBody: CreatePunishmentTypeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishment-types/create',
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
     * 更新处罚类型
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentTypeControllerUpdate(
        requestBody: {
            id: string;
            data: UpdatePunishmentTypeDto;
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
            url: '/punishment-types/update',
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
     * 删除处罚类型
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentTypeControllerDelete(
        requestBody: PunishmentTypeIdDto,
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
            url: '/punishment-types/delete',
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
     * 列表处罚类型
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentTypeControllerList(
        requestBody: ListPunishmentTypeDto,
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
            url: '/punishment-types/list',
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
