/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddThreadStickyDto } from '../models/AddThreadStickyDto';
import type { ListThreadStickiesDto } from '../models/ListThreadStickiesDto';
import type { ThreadStickyIdDto } from '../models/ThreadStickyIdDto';
import type { UpdateThreadStickyDto } from '../models/UpdateThreadStickyDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumStickiesService {
    /**
     * 添加主题置顶
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumStickiesControllerAdd(
        requestBody: AddThreadStickyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/stickies/add',
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
     * 更新主题置顶
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumStickiesControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateThreadStickyDto;
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
            url: '/forum/stickies/update',
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
     * 删除主题置顶
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumStickiesControllerDelete(
        requestBody: ThreadStickyIdDto,
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
            url: '/forum/stickies/delete',
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
     * 主题置顶列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumStickiesControllerListStickies(
        requestBody: ListThreadStickiesDto,
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
            url: '/forum/stickies/list-stickies',
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
     * @deprecated
     * 主题置顶列表（旧）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumStickiesControllerListStickiesLegacy(
        requestBody: ListThreadStickiesDto,
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
            url: '/forum/stickies/list',
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
