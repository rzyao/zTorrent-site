/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentRecordService {
    /**
     * 用户已发布的种子列表
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindPublished(
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/published',
            query: {
                'search': search,
                'limit': limit,
                'page': page,
            },
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
     * 用户正在做种的种子列表
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindSeeding(
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/seeding',
            query: {
                'search': search,
                'limit': limit,
                'page': page,
            },
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
     * 用户正在下载的种子列表
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindDownloading(
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/downloading',
            query: {
                'search': search,
                'limit': limit,
                'page': page,
            },
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
     * 用户已下载完成的种子列表
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindCompleted(
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/completed',
            query: {
                'search': search,
                'limit': limit,
                'page': page,
            },
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
     * 用户未完成下载的种子列表
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindIncomplete(
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/incomplete',
            query: {
                'search': search,
                'limit': limit,
                'page': page,
            },
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
     * 统计各类型种子数量
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerGetStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/stats',
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
