/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateForumThreadDto } from '../models/CreateForumThreadDto';
import type { ForumThreadIdDto } from '../models/ForumThreadIdDto';
import type { ListForumThreadsDto } from '../models/ListForumThreadsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumThreadsService {
    /**
     * 创建论坛主题
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumThreadsControllerCreate(
        requestBody: CreateForumThreadDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/threads/create',
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
     * 获取主题详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumThreadsControllerGetThread(
        requestBody: ForumThreadIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/threads/get-thread',
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
     * 获取主题详情（旧）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumThreadsControllerGetThreadLegacy(
        requestBody: ForumThreadIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/threads/get',
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
     * 主题列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumThreadsControllerListThreads(
        requestBody: ListForumThreadsDto,
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
            url: '/forum/threads/list-threads',
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
     * 主题列表（旧）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumThreadsControllerListThreadsLegacy(
        requestBody: ListForumThreadsDto,
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
            url: '/forum/threads/list',
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
     * 递增主题浏览次数
     * 说明：后端若未在 `get-thread` 内置递增，可显式调用该端点实现统计。
     * 请求：`POST /forum/threads/inc-views`
     * 返回：最新 `viewsCount` 或统一响应包装（兼容 unwrapResponse）。
     */
    public static forumThreadsControllerIncViews(
        requestBody: ForumThreadIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/threads/inc-views',
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
