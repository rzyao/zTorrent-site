/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFeedRequestDto } from '../models/CreateFeedRequestDto';
import type { CreateFeedResultDto } from '../models/CreateFeedResultDto';
import type { DeleteFeedRequestDto } from '../models/DeleteFeedRequestDto';
import type { FeedStatsRequestDto } from '../models/FeedStatsRequestDto';
import type { FeedStatsResultDto } from '../models/FeedStatsResultDto';
import type { ListFeedsRequestDto } from '../models/ListFeedsRequestDto';
import type { ListFeedsResultDto } from '../models/ListFeedsResultDto';
import type { UpdateFeedRequestDto } from '../models/UpdateFeedRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RssFeedsService {
    /**
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rssFeedsControllerList(
        requestBody: ListFeedsRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListFeedsResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rss/feeds/list',
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
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rssFeedsControllerCreate(
        requestBody: CreateFeedRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: CreateFeedResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rss/feeds/create',
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
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rssFeedsControllerUpdate(
        requestBody: UpdateFeedRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rss/feeds/update',
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
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rssFeedsControllerDelete(
        requestBody: DeleteFeedRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rss/feeds/delete',
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
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rssFeedsControllerStats(
        requestBody: FeedStatsRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: FeedStatsResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rss/feeds/stats',
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
