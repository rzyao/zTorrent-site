/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUnbanReasonDto } from '../models/CreateUnbanReasonDto';
import type { ListUnbanReasonDto } from '../models/ListUnbanReasonDto';
import type { UnbanReasonIdDto } from '../models/UnbanReasonIdDto';
import type { UpdateUnbanReasonDto } from '../models/UpdateUnbanReasonDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UnbanReasonsService {
    /**
     * 创建解封原因
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static unbanReasonControllerCreate(
        requestBody: CreateUnbanReasonDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/unban-reasons/create',
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
     * 更新解封原因
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static unbanReasonControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateUnbanReasonDto;
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
            url: '/unban-reasons/update',
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
     * 删除解封原因
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static unbanReasonControllerDelete(
        requestBody: UnbanReasonIdDto,
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
            url: '/unban-reasons/delete',
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
     * 列出解封原因列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static unbanReasonControllerListUnbanReasons(
        requestBody: ListUnbanReasonDto,
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
            url: '/unban-reasons/list',
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
