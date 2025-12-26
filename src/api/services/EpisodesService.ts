/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEpisodeDto } from '../models/CreateEpisodeDto';
import type { DeleteEpisodeDto } from '../models/DeleteEpisodeDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { EpisodeDetailResponseDto } from '../models/EpisodeDetailResponseDto';
import type { EpisodeReviewHistoryDto } from '../models/EpisodeReviewHistoryDto';
import type { EpisodeReviewHistoryResponseDto } from '../models/EpisodeReviewHistoryResponseDto';
import type { GetEpisodeDetailDto } from '../models/GetEpisodeDetailDto';
import type { ListEpisodesDto } from '../models/ListEpisodesDto';
import type { ListEpisodesResponseDto } from '../models/ListEpisodesResponseDto';
import type { ListPendingEpisodesDto } from '../models/ListPendingEpisodesDto';
import type { ListPendingEpisodesResponseDto } from '../models/ListPendingEpisodesResponseDto';
import type { ReviewEpisodeDto } from '../models/ReviewEpisodeDto';
import type { SuccessDto } from '../models/SuccessDto';
import type { UpdateEpisodeDto } from '../models/UpdateEpisodeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EpisodesService {
    /**
     * 获取分集列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static episodesControllerList(
        requestBody: ListEpisodesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListEpisodesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/episodes/list',
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
     * 获取分集详情（含关联剧集与种子）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static episodesControllerDetail(
        requestBody: GetEpisodeDetailDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EpisodeDetailResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/episodes/detail',
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
     * 创建分集
     * @param requestBody
     * @returns any 已创建
     * @throws ApiError
     */
    public static episodesControllerCreate(
        requestBody: CreateEpisodeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SuccessDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/episodes/create',
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
     * 更新分集
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static episodesControllerUpdate(
        requestBody: UpdateEpisodeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/episodes/update',
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
     * 删除分集
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static episodesControllerDelete(
        requestBody: DeleteEpisodeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/episodes/delete',
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
     * 待审核分集列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static episodeReviewControllerListPending(
        requestBody: ListPendingEpisodesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListPendingEpisodesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/episodes/review/pending',
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
     * 审核分集
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static episodeReviewControllerReview(
        requestBody: ReviewEpisodeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/episodes/review/action',
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
     * 分集审核历史
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static episodeReviewControllerHistory(
        requestBody: EpisodeReviewHistoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EpisodeReviewHistoryResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/episodes/review/history',
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
