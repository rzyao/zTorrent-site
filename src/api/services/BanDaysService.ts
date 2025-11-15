/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BanDaysIdDto } from '../models/BanDaysIdDto';
import type { CreateBanDaysDto } from '../models/CreateBanDaysDto';
import type { ListBanDaysDto } from '../models/ListBanDaysDto';
import type { UpdateBanDaysDto } from '../models/UpdateBanDaysDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BanDaysService {
    /**
     * 创建封禁天数
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banDaysControllerCreate(
        requestBody: CreateBanDaysDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ban-days/create',
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
     * 更新封禁天数
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banDaysControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateBanDaysDto;
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
            url: '/ban-days/update',
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
     * 删除封禁天数
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banDaysControllerDelete(
        requestBody: BanDaysIdDto,
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
            url: '/ban-days/delete',
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
     * 列表封禁天数
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static banDaysControllerList(
        requestBody: ListBanDaysDto,
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
            url: '/ban-days/list',
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
