/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BindTorrentsDto } from '../models/BindTorrentsDto';
import type { GetMovieDto } from '../models/GetMovieDto';
import type { MovieTorrentDto } from '../models/MovieTorrentDto';
import type { Object } from '../models/Object';
import type { UnbindTorrentsDto } from '../models/UnbindTorrentsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MoviesTorrentsService {
    /**
     * 绑定种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static movieTorrentsControllerBindTorrents(
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
    public static movieTorrentsControllerUnbindTorrents(
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
     * 获取电影绑定的种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static movieTorrentsControllerListTorrents(
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
}
