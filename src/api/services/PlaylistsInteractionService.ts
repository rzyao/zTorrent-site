/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowDto } from '../models/FollowDto';
import type { FollowResponseDto } from '../models/FollowResponseDto';
import type { IncrementViewsDto } from '../models/IncrementViewsDto';
import type { IncrementViewsResponseDto } from '../models/IncrementViewsResponseDto';
import type { IsFollowingDto } from '../models/IsFollowingDto';
import type { IsFollowingResponseDto } from '../models/IsFollowingResponseDto';
import type { IsSubscribedDto } from '../models/IsSubscribedDto';
import type { IsSubscribedResponseDto } from '../models/IsSubscribedResponseDto';
import type { LikePlaylistDto } from '../models/LikePlaylistDto';
import type { LikePlaylistResponseDto } from '../models/LikePlaylistResponseDto';
import type { SubscribeDto } from '../models/SubscribeDto';
import type { SubscribeResponseDto } from '../models/SubscribeResponseDto';
import type { UpdateSubscriptionNotifyDto } from '../models/UpdateSubscriptionNotifyDto';
import type { UpdateSubscriptionNotifyResponseDto } from '../models/UpdateSubscriptionNotifyResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlaylistsInteractionService {
    /**
     * 统计：浏览增加
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistInteractionControllerIncViews(
        requestBody: IncrementViewsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: IncrementViewsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/inc-views',
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
     * 统计：点赞
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistInteractionControllerLike(
        requestBody: LikePlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: LikePlaylistResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/like',
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
     * 关注/取消关注片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistInteractionControllerFollow(
        requestBody: FollowDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: FollowResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/follow',
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
     * 检查是否已关注片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistInteractionControllerIsFollowing(
        requestBody: IsFollowingDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: IsFollowingResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/is-following',
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
     * 订阅/取消订阅片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistInteractionControllerSubscribe(
        requestBody: SubscribeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SubscribeResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/subscribe',
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
     * 检查是否已订阅片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistInteractionControllerIsSubscribed(
        requestBody: IsSubscribedDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: IsSubscribedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/is-subscribed',
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
     * 更新订阅通知设置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistInteractionControllerUpdateSubscriptionNotify(
        requestBody: UpdateSubscriptionNotifyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UpdateSubscriptionNotifyResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/update-subscription-notify',
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
