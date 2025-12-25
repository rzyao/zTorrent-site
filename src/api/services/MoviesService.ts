/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BindTorrentsDto } from '../models/BindTorrentsDto';
import type { CreateMovieDto } from '../models/CreateMovieDto';
import type { DeleteMovieDto } from '../models/DeleteMovieDto';
import type { DeleteMovieResponseDto } from '../models/DeleteMovieResponseDto';
import type { GetMovieDto } from '../models/GetMovieDto';
import type { ListMoviesDto } from '../models/ListMoviesDto';
import type { ListMoviesResponseDto } from '../models/ListMoviesResponseDto';
import type { MovieDetailDto } from '../models/MovieDetailDto';
import type { MovieTorrentDto } from '../models/MovieTorrentDto';
import type { Object } from '../models/Object';
import type { UnbindTorrentsDto } from '../models/UnbindTorrentsDto';
import type { UpdateMovieDto } from '../models/UpdateMovieDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MoviesService {
    /**
     * 绑定种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static moviesControllerBindTorrents(
        requestBody: BindTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/torrents/bind',
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
    public static moviesControllerUnbindTorrents(
        requestBody: UnbindTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/torrents/unbind',
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
     * 创建电影
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static moviesControllerCreate(
        requestBody: CreateMovieDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: MovieDetailDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/create',
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
     * 更新电影
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static moviesControllerUpdate(
        requestBody: UpdateMovieDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: MovieDetailDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/update',
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
     * 删除电影
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static moviesControllerDelete(
        requestBody: DeleteMovieDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: DeleteMovieResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/delete',
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
     * 获取电影详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static moviesControllerGetDetail(
        requestBody: GetMovieDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: MovieDetailDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/detail',
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
     * 获取电影绑定的种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static moviesControllerListTorrents(
        requestBody: GetMovieDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<MovieTorrentDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/torrents/list',
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
     * 电影列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static moviesControllerList(
        requestBody: ListMoviesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListMoviesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/movies/list',
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
