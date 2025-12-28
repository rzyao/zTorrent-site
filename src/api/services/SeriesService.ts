/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BindTorrentDto } from '../models/BindTorrentDto';
import type { CreateSeriesDto } from '../models/CreateSeriesDto';
import type { DeleteSeriesDto } from '../models/DeleteSeriesDto';
import type { DeleteSeriesResponseDto } from '../models/DeleteSeriesResponseDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { GetSeriesDto } from '../models/GetSeriesDto';
import type { ListApprovedSeriesDto } from '../models/ListApprovedSeriesDto';
import type { ListApprovedSeriesResponseDto } from '../models/ListApprovedSeriesResponseDto';
import type { ListPendingSeriesDto } from '../models/ListPendingSeriesDto';
import type { ListPendingSeriesResponseDto } from '../models/ListPendingSeriesResponseDto';
import type { ListRejectedSeriesDto } from '../models/ListRejectedSeriesDto';
import type { ListRejectedSeriesResponseDto } from '../models/ListRejectedSeriesResponseDto';
import type { ListSeriesDto } from '../models/ListSeriesDto';
import type { ListSeriesResponseDto } from '../models/ListSeriesResponseDto';
import type { ListSeriesTorrentsDto } from '../models/ListSeriesTorrentsDto';
import type { ListSeriesTorrentsResponseDto } from '../models/ListSeriesTorrentsResponseDto';
import type { ReviewSeriesDto } from '../models/ReviewSeriesDto';
import type { SeriesDetailDto } from '../models/SeriesDetailDto';
import type { SeriesReviewHistoryDto } from '../models/SeriesReviewHistoryDto';
import type { SeriesReviewHistoryResponseDto } from '../models/SeriesReviewHistoryResponseDto';
import type { UnbindTorrentDto } from '../models/UnbindTorrentDto';
import type { UpdateSeriesDto } from '../models/UpdateSeriesDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SeriesService {
    /**
     * 创建剧集
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesBaseControllerCreate(
        requestBody: CreateSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SeriesDetailDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/create',
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
     * 更新剧集
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesBaseControllerUpdate(
        requestBody: UpdateSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SeriesDetailDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/update',
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
     * 删除剧集
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesBaseControllerDelete(
        requestBody: DeleteSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: DeleteSeriesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/delete',
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
     * 获取剧集详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesBaseControllerGetDetail(
        requestBody: GetSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SeriesDetailDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/detail',
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
     * 剧集列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesBaseControllerList(
        requestBody: ListSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListSeriesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/list',
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
     * 获取关联种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesTorrentsControllerList(
        requestBody: ListSeriesTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListSeriesTorrentsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/torrents/list',
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
     * 绑定种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesTorrentsControllerBind(
        requestBody: BindTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/torrents/bind',
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
     * 解绑种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesTorrentsControllerUnbind(
        requestBody: UnbindTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/torrents/unbind',
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
     * 待审核剧集列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesReviewControllerListPending(
        requestBody: ListPendingSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListPendingSeriesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/review/pending',
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
     * 审核剧集
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesReviewControllerReview(
        requestBody: ReviewSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/review/action',
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
     * 剧集审核历史
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesReviewControllerHistory(
        requestBody: SeriesReviewHistoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SeriesReviewHistoryResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/review/history',
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
     * 已通过剧集列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesReviewControllerApproved(
        requestBody: ListApprovedSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListApprovedSeriesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/review/approved',
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
     * 已驳回剧集列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesReviewControllerRejected(
        requestBody: ListRejectedSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListRejectedSeriesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/review/rejected',
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
