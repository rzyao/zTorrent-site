/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddTorrentStickyDto } from '../models/AddTorrentStickyDto';
import type { CreateStickyDto } from '../models/CreateStickyDto';
import type { ListStickiesDto } from '../models/ListStickiesDto';
import type { ListTorrentStickiesDto } from '../models/ListTorrentStickiesDto';
import type { StickyIdDto } from '../models/StickyIdDto';
import type { TorrentStickyIdDto } from '../models/TorrentStickyIdDto';
import type { UpdateStickyDto } from '../models/UpdateStickyDto';
import type { UpdateTorrentStickyDto } from '../models/UpdateTorrentStickyDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StickiesService {
    /**
     * 创建置顶类型
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerCreate(
        requestBody: CreateStickyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stickies/create',
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
     * 更新置顶类型
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateStickyDto;
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
            url: '/stickies/update',
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
     * 删除置顶类型
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerDelete(
        requestBody: StickyIdDto,
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
            url: '/stickies/delete',
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
     * 列出置顶类型列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerListStickyTypes(
        requestBody: ListStickiesDto,
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
            url: '/stickies/list',
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
     * 添加种子置顶
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerAddTorrentSticky(
        requestBody: AddTorrentStickyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stickies/torrents/add',
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
     * 更新种子置顶
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerUpdateTorrentSticky(
        requestBody: {
            id: string;
            data: UpdateTorrentStickyDto;
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
            url: '/stickies/torrents/update',
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
     * 删除种子置顶
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerDeleteTorrentSticky(
        requestBody: TorrentStickyIdDto,
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
            url: '/stickies/torrents/delete',
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
     * 列出某种子的置顶列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static stickiesControllerListTorrentStickies(
        requestBody: ListTorrentStickiesDto,
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
            url: '/stickies/torrents/list',
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
