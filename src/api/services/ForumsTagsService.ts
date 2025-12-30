/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTagDto } from '../models/CreateTagDto';
import type { ForumTag } from '../models/ForumTag';
import type { IdParamDto } from '../models/IdParamDto';
import type { LimitParamDto } from '../models/LimitParamDto';
import type { MergeTagDto } from '../models/MergeTagDto';
import type { Object } from '../models/Object';
import type { PaginationParamDto } from '../models/PaginationParamDto';
import type { SearchTagDto } from '../models/SearchTagDto';
import type { TagPaginatedResponseDto } from '../models/TagPaginatedResponseDto';
import type { UpdateTagDto } from '../models/UpdateTagDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsTagsService {
    /**
     * 搜索标签
     * @param requestBody
     * @returns any 标签列表
     * @throws ApiError
     */
    public static tagsControllerSearch(
        requestBody: SearchTagDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<ForumTag>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/search',
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
     * 获取热门标签
     * @param requestBody
     * @returns any 热门标签
     * @throws ApiError
     */
    public static tagsControllerFindHot(
        requestBody: LimitParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<ForumTag>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/hot',
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
     * 获取所有标签
     * @param requestBody
     * @returns any 标签分页列表
     * @throws ApiError
     */
    public static tagsControllerFindAll(
        requestBody: PaginationParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: TagPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/list',
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
     * 获取标签详情
     * @param requestBody
     * @returns any 标签详情
     * @throws ApiError
     */
    public static tagsControllerFindOne(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTag;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/detail',
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
     * 创建标签 (管理员)
     * @param requestBody
     * @returns any 创建成功
     * @throws ApiError
     */
    public static tagsControllerCreate(
        requestBody: CreateTagDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTag;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/create',
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
     * 更新标签 (管理员)
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static tagsControllerUpdate(
        requestBody: UpdateTagDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTag;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/update',
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
     * 删除标签 (管理员)
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static tagsControllerRemove(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/delete',
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
     * 合并标签 (管理员)
     * @param requestBody
     * @returns any 合并成功
     * @throws ApiError
     */
    public static tagsControllerMerge(
        requestBody: MergeTagDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTag;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tags/merge',
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
