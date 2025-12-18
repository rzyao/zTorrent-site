/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BindTorrentDto } from '../models/BindTorrentDto';
import type { CreateEpisodeDto } from '../models/CreateEpisodeDto';
import type { CreateSeriesDto } from '../models/CreateSeriesDto';
import type { DeleteEpisodeDto } from '../models/DeleteEpisodeDto';
import type { DeleteSeriesDto } from '../models/DeleteSeriesDto';
import type { DeleteSeriesResponseDto } from '../models/DeleteSeriesResponseDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { EpisodeDetailResponseDto } from '../models/EpisodeDetailResponseDto';
import type { GetEpisodeDetailDto } from '../models/GetEpisodeDetailDto';
import type { GetSeriesDto } from '../models/GetSeriesDto';
import type { ListEpisodesDto } from '../models/ListEpisodesDto';
import type { ListEpisodesResponseDto } from '../models/ListEpisodesResponseDto';
import type { ListSeriesDto } from '../models/ListSeriesDto';
import type { ListSeriesResponseDto } from '../models/ListSeriesResponseDto';
import type { ListSeriesTorrentsDto } from '../models/ListSeriesTorrentsDto';
import type { ListSeriesTorrentsResponseDto } from '../models/ListSeriesTorrentsResponseDto';
import type { SeriesDetailDto } from '../models/SeriesDetailDto';
import type { SuccessDto } from '../models/SuccessDto';
import type { UnbindTorrentDto } from '../models/UnbindTorrentDto';
import type { UpdateEpisodeDto } from '../models/UpdateEpisodeDto';
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
    public static seriesControllerCreate(
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
    public static seriesControllerUpdate(
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
    public static seriesControllerDelete(
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
    public static seriesControllerGetDetail(
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
    public static seriesControllerList(
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
     * 获取分集列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesEpisodesControllerList(
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
    public static seriesEpisodesControllerDetail(
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
    public static seriesEpisodesControllerCreate(
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
    public static seriesEpisodesControllerUpdate(
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
    public static seriesEpisodesControllerDelete(
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
}
