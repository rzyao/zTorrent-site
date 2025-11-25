/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddSeriesFilmDto } from '../models/AddSeriesFilmDto';
import type { CreateSeriesDto } from '../models/CreateSeriesDto';
import type { ListSeriesDto } from '../models/ListSeriesDto';
import type { ListSeriesFilmsDto } from '../models/ListSeriesFilmsDto';
import type { SeriesFilmIdDto } from '../models/SeriesFilmIdDto';
import type { SeriesIdDto } from '../models/SeriesIdDto';
import type { UpdateSeriesDto } from '../models/UpdateSeriesDto';
import type { UpdateSeriesFilmDto } from '../models/UpdateSeriesFilmDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SeriesService {
    /**
     * 创建系列
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerCreate(
        requestBody: CreateSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/create-series',
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
     * 更新系列
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateSeriesDto;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/update-series',
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
     * 删除系列
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerDelete(
        requestBody: SeriesIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/delete-series',
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
     * 列出系列列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerListSeries(
        requestBody: ListSeriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/list-series',
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
     * 添加系列影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerAddFilm(
        requestBody: AddSeriesFilmDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/series-add-film',
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
     * 更新系列影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerUpdateFilm(
        requestBody: {
            id: string;
            data: UpdateSeriesFilmDto;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/series-update-film',
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
     * 删除系列影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerDeleteFilm(
        requestBody: SeriesFilmIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/series-delete-film',
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
     * 列表系列影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static seriesControllerListFilms(
        requestBody: ListSeriesFilmsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/series/series-list-films',
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
