/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateForumCategoryDto } from '../models/CreateForumCategoryDto';
import type { ForumCategoryIdDto } from '../models/ForumCategoryIdDto';
import type { ListForumCategoriesDto } from '../models/ListForumCategoriesDto';
import type { UpdateForumCategoryDto } from '../models/UpdateForumCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumCategoriesService {
    /**
     * 创建板块
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumCategoriesControllerCreate(
        requestBody: CreateForumCategoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/categories/create',
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
     * 更新板块
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumCategoriesControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateForumCategoryDto;
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
            url: '/forum/categories/update',
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
     * 删除板块
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumCategoriesControllerDelete(
        requestBody: ForumCategoryIdDto,
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
            url: '/forum/categories/delete',
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
     * 板块列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumCategoriesControllerListCategories(
        requestBody: ListForumCategoriesDto,
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
            url: '/forum/categories/list-categories',
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
     * 板块列表（旧）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumCategoriesControllerListCategoriesLegacy(
        requestBody: ListForumCategoriesDto,
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
            url: '/forum/categories/list',
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
