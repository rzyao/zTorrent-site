/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { ListApprovedTorrentsDto } from '../models/ListApprovedTorrentsDto';
import type { ListApprovedTorrentsResponseDto } from '../models/ListApprovedTorrentsResponseDto';
import type { ListRejectedTorrentsDto } from '../models/ListRejectedTorrentsDto';
import type { ListRejectedTorrentsResponseDto } from '../models/ListRejectedTorrentsResponseDto';
import type { PendingReviewsDto } from '../models/PendingReviewsDto';
import type { PendingReviewsResponseDto } from '../models/PendingReviewsResponseDto';
import type { ReviewDto } from '../models/ReviewDto';
import type { ReviewHistoryDto } from '../models/ReviewHistoryDto';
import type { ReviewHistoryResponseDto } from '../models/ReviewHistoryResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentsReviewService {
    /**
     * 待审核种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentReviewControllerPending(
        requestBody: PendingReviewsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PendingReviewsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review/pending',
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
     * 审核历史记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentReviewControllerReviewHistory(
        requestBody: ReviewHistoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ReviewHistoryResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review/history',
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
     * 审核种子（通过/驳回）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentReviewControllerReview(
        requestBody: ReviewDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review/action',
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
     * 已通过种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentReviewControllerApproved(
        requestBody: ListApprovedTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListApprovedTorrentsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review/approved',
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
     * 已驳回种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentReviewControllerRejected(
        requestBody: ListRejectedTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListRejectedTorrentsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review/rejected',
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
