/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BanReasonIdDto } from '../models/BanReasonIdDto';
import type { CreateBanReasonDto } from '../models/CreateBanReasonDto';
import type { ListBanReasonDto } from '../models/ListBanReasonDto';
import type { UpdateBanReasonDto } from '../models/UpdateBanReasonDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BanReasonsService {
    /**
     * 创建封禁原因
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banReasonControllerCreate(
        requestBody: CreateBanReasonDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ban-reasons/create',
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
     * 更新封禁原因
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banReasonControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateBanReasonDto;
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
            url: '/ban-reasons/update',
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
     * 删除封禁原因
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banReasonControllerDelete(
        requestBody: BanReasonIdDto,
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
            url: '/ban-reasons/delete',
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
     * 列出封禁原因列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banReasonControllerListBanReasons(
        requestBody: ListBanReasonDto,
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
            url: '/ban-reasons/list',
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
