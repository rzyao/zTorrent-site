/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { MovieReviewHistoryDto } from '../models/MovieReviewHistoryDto';
import type { Object } from '../models/Object';
import type { PendingMoviesDto } from '../models/PendingMoviesDto';
import type { PendingMoviesResponseDto } from '../models/PendingMoviesResponseDto';
import type { ReviewMovieDto } from '../models/ReviewMovieDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MoviesReviewService {
    /**
     * 待审核电影列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static movieReviewControllerListPending(
        requestBody: PendingMoviesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PendingMoviesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/review/pending',
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
     * 审核电影（通过/驳回）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static movieReviewControllerReview(
        requestBody: ReviewMovieDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/review/action',
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
     * 电影审核历史记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static movieReviewControllerReviewHistory(
        requestBody: MovieReviewHistoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/review/history',
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
