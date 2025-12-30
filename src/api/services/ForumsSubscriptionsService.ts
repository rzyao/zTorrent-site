/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumSubscription } from '../models/ForumSubscription';
import type { Object } from '../models/Object';
import type { QuerySubscriptionDto } from '../models/QuerySubscriptionDto';
import type { SubscribeTopicDto } from '../models/SubscribeTopicDto';
import type { SubscriptionCheckResponseDto } from '../models/SubscriptionCheckResponseDto';
import type { SubscriptionPaginatedResponseDto } from '../models/SubscriptionPaginatedResponseDto';
import type { TopicIdParamDto } from '../models/TopicIdParamDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsSubscriptionsService {
    /**
     * 订阅话题
     * @param requestBody
     * @returns any 订阅成功
     * @throws ApiError
     */
    public static subscriptionsControllerSubscribe(
        requestBody: SubscribeTopicDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumSubscription;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/subscriptions/subscribe',
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
     * 取消订阅话题
     * @param requestBody
     * @returns any 操作成功
     * @throws ApiError
     */
    public static subscriptionsControllerUnsubscribe(
        requestBody: TopicIdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/subscriptions/unsubscribe',
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
     * @returns any 订阅分页列表
     * @throws ApiError
     */
    public static subscriptionsControllerFindMySubscriptions(
        requestBody: QuerySubscriptionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SubscriptionPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/subscriptions/my-list',
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
     * 检查是否已订阅话题
     * @param requestBody
     * @returns any 状态检查结果
     * @throws ApiError
     */
    public static subscriptionsControllerCheckSubscription(
        requestBody: TopicIdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SubscriptionCheckResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/subscriptions/check',
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
