/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTagGroupDto } from '../models/CreateTagGroupDto';
import type { ForumTagGroup } from '../models/ForumTagGroup';
import type { IdParamDto } from '../models/IdParamDto';
import type { Object } from '../models/Object';
import type { PaginationParamDto } from '../models/PaginationParamDto';
import type { TagGroupPaginatedResponseDto } from '../models/TagGroupPaginatedResponseDto';
import type { UpdateTagGroupDto } from '../models/UpdateTagGroupDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsTagGroupsService {
    /**
     * 获取标签组列表 (管理员)
     * @param requestBody
     * @returns any 标签组分页列表
     * @throws ApiError
     */
    public static tagGroupsControllerFindAll(
        requestBody: PaginationParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: TagGroupPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tag-groups/list',
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
     * 获取标签组详情 (管理员)
     * @param requestBody
     * @returns any 标签组详情
     * @throws ApiError
     */
    public static tagGroupsControllerFindOne(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTagGroup;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tag-groups/detail',
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
     * 创建标签组 (管理员)
     * @param requestBody
     * @returns any 创建成功
     * @throws ApiError
     */
    public static tagGroupsControllerCreate(
        requestBody: CreateTagGroupDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTagGroup;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tag-groups/create',
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
     * 更新标签组 (管理员)
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static tagGroupsControllerUpdate(
        requestBody: UpdateTagGroupDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTagGroup;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/tag-groups/update',
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
     * 删除标签组 (管理员)
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static tagGroupsControllerRemove(
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
            url: '/forums/tag-groups/delete',
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
