/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { ListPendingPlaylistsDto } from '../models/ListPendingPlaylistsDto';
import type { ListPendingPlaylistsResponseDto } from '../models/ListPendingPlaylistsResponseDto';
import type { Object } from '../models/Object';
import type { PlaylistReviewHistoryDto } from '../models/PlaylistReviewHistoryDto';
import type { ReviewDto } from '../models/ReviewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlaylistsReviewService {
    /**
     * 审核片单（通过/驳回）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistReviewControllerReview(
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
            url: '/playlists/review/action',
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
     * 待审核片单列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistReviewControllerPending(
        requestBody: ListPendingPlaylistsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListPendingPlaylistsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/review/pending',
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
     * 片单审核历史
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistReviewControllerHistory(
        requestBody: PlaylistReviewHistoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/review/history',
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
