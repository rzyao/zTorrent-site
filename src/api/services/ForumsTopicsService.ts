/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTopicDto } from '../models/CreateTopicDto';
import type { ForumTopic } from '../models/ForumTopic';
import type { IdParamDto } from '../models/IdParamDto';
import type { MoveTopicDto } from '../models/MoveTopicDto';
import type { Object } from '../models/Object';
import type { PaginationParamDto } from '../models/PaginationParamDto';
import type { QueryTopicDto } from '../models/QueryTopicDto';
import type { TopicPaginatedResponseDto } from '../models/TopicPaginatedResponseDto';
import type { UpdateTopicParamDto } from '../models/UpdateTopicParamDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsTopicsService {
    /**
     * 获取话题列表
     * @param requestBody
     * @returns any 话题分页列表
     * @throws ApiError
     */
    public static topicsControllerFindAll(
        requestBody: QueryTopicDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: TopicPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/list',
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
     * 获取话题详情
     * @param requestBody
     * @returns any 话题详情
     * @throws ApiError
     */
    public static topicsControllerFindOne(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/detail',
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
     * 发布话题
     * @param requestBody
     * @returns any 发布成功
     * @throws ApiError
     */
    public static topicsControllerCreate(
        requestBody: CreateTopicDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/create',
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
     * 更新话题
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static topicsControllerUpdate(
        requestBody: UpdateTopicParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/update',
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
     * 删除话题
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static topicsControllerRemove(
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
            url: '/forums/topics/delete',
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
     * 获取我的话题列表
     * @param requestBody
     * @returns any 话题分页列表
     * @throws ApiError
     */
    public static topicsControllerFindMyTopics(
        requestBody: PaginationParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: TopicPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/my-list',
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
     * 锁定/解锁话题 (管理员)
     * @param requestBody
     * @returns any 操作成功
     * @throws ApiError
     */
    public static topicsControllerToggleLock(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/admin/toggle-lock',
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
     * 置顶/取消置顶话题 (管理员)
     * @param requestBody
     * @returns any 操作成功
     * @throws ApiError
     */
    public static topicsControllerTogglePin(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/admin/toggle-pin',
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
     * 设置/取消热门 (管理员)
     * @param requestBody
     * @returns any 操作成功
     * @throws ApiError
     */
    public static topicsControllerToggleTrending(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/admin/toggle-trending',
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
     * 移动话题到其他分类 (管理员)
     * @param requestBody
     * @returns any 移动成功
     * @throws ApiError
     */
    public static topicsControllerMoveToCategory(
        requestBody: MoveTopicDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/admin/move',
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
     * 恢复已删除的话题 (管理员)
     * @param requestBody
     * @returns any 恢复成功
     * @throws ApiError
     */
    public static topicsControllerRestore(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/admin/restore',
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
     * 删除话题 (管理员)
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static topicsControllerAdminRemove(
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
            url: '/forums/topics/admin/delete',
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
     * 获取话题详情 (路径参数)
     * @param id
     * @returns any 话题详情
     * @throws ApiError
     */
    public static topicsControllerFindOneByParam(
        id: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumTopic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/topics/{id}',
            path: {
                'id': id,
            },
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
