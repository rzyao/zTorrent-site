/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchFavoriteActionDto } from '../models/BatchFavoriteActionDto';
import type { FavoriteActionDto } from '../models/FavoriteActionDto';
import type { FollowActionDto } from '../models/FollowActionDto';
import type { ListFavoritesDto } from '../models/ListFavoritesDto';
import type { ListFavoritesResponseDto } from '../models/ListFavoritesResponseDto';
import type { ListFollowsDto } from '../models/ListFollowsDto';
import type { ListSubscriptionsDto } from '../models/ListSubscriptionsDto';
import type { Object } from '../models/Object';
import type { SubscriptionActionDto } from '../models/SubscriptionActionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 添加订阅
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerAdd(
        requestBody: SubscriptionActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/add',
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
     * 取消订阅
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerRemove(
        requestBody: SubscriptionActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/remove',
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
     * 检查是否已订阅
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerCheck(
        requestBody: SubscriptionActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/check',
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
     * 获取我的订阅列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerList(
        requestBody: ListSubscriptionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/list',
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
     * 添加关注
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static followsControllerAdd(
        requestBody: FollowActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/follows/add',
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
     * 取消关注
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static followsControllerRemove(
        requestBody: FollowActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/follows/remove',
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
     * 检查是否已关注
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static followsControllerCheck(
        requestBody: FollowActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/follows/check',
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
     * 获取我的关注列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static followsControllerList(
        requestBody: ListFollowsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/follows/list',
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
     * 添加收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerAdd(
        requestBody: FavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/add',
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
     * 批量添加收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerBatchAdd(
        requestBody: BatchFavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/batch-add',
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
     * 取消收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerRemove(
        requestBody: FavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/remove',
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
     * 批量取消收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerBatchRemove(
        requestBody: BatchFavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/batch-remove',
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
     * 检查是否已收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerCheck(
        requestBody: FavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/check',
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
     * 获取我的收藏列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerList(
        requestBody: ListFavoritesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListFavoritesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/list',
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
