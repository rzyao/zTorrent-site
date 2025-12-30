/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePostParamDto } from '../models/CreatePostParamDto';
import type { ForumPost } from '../models/ForumPost';
import type { IdParamDto } from '../models/IdParamDto';
import type { ListPostsByTopicDto } from '../models/ListPostsByTopicDto';
import type { Object } from '../models/Object';
import type { PaginationParamDto } from '../models/PaginationParamDto';
import type { PostPaginatedResponseDto } from '../models/PostPaginatedResponseDto';
import type { SetPostSystemDto } from '../models/SetPostSystemDto';
import type { UpdatePostParamDto } from '../models/UpdatePostParamDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsPostsService {
    /**
     * 获取回复列表
     * @param requestBody
     * @returns any 回复分页列表
     * @throws ApiError
     */
    public static postsControllerFindAll(
        requestBody: ListPostsByTopicDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PostPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/posts/list',
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
     * 获取回复详情
     * @param requestBody
     * @returns any 回复详情
     * @throws ApiError
     */
    public static postsControllerFindOne(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumPost;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/posts/detail',
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
     * 发表回复
     * @param requestBody
     * @returns any 发表成功
     * @throws ApiError
     */
    public static postsControllerCreate(
        requestBody: CreatePostParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumPost;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/posts/create',
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
     * 更新回复
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static postsControllerUpdate(
        requestBody: UpdatePostParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumPost;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/posts/update',
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
     * 删除回复
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static postsControllerRemove(
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
            url: '/forums/posts/delete',
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
     * 获取我的回复列表
     * @param requestBody
     * @returns any 回复分页列表
     * @throws ApiError
     */
    public static postsControllerFindMyPosts(
        requestBody: PaginationParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PostPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/posts/my-list',
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
     * 恢复已删除的回复 (管理员)
     * @param requestBody
     * @returns any 恢复成功
     * @throws ApiError
     */
    public static postsControllerRestore(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumPost;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/posts/admin/restore',
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
     * 删除回复 (管理员)
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static postsControllerAdminRemove(
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
            url: '/forums/posts/admin/delete',
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
     * 设置回复为系统消息 (管理员)
     * @param requestBody
     * @returns any 设置成功
     * @throws ApiError
     */
    public static postsControllerSetAsSystem(
        requestBody: SetPostSystemDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumPost;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/posts/admin/set-system',
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
