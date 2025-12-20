/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TorrentCountsBatchItemDto } from '../models/TorrentCountsBatchItemDto';
import type { TorrentCountsBatchRequestDto } from '../models/TorrentCountsBatchRequestDto';
import type { UserCountsBatchItemDto } from '../models/UserCountsBatchItemDto';
import type { UserCountsBatchRequestDto } from '../models/UserCountsBatchRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivityService {
    /**
     * 查询某用户当前做种的种子集合
     * @param userId 用户ID
     * @returns any 成功
     * @throws ApiError
     */
    public static activityControllerUserSeeds(
        userId: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activity/user/{userId}/seeds',
            path: {
                'userId': userId,
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
     * 查询某用户当前下载的种子集合
     * @param userId 用户ID
     * @returns any 成功
     * @throws ApiError
     */
    public static activityControllerUserLeeches(
        userId: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activity/user/{userId}/leeches',
            path: {
                'userId': userId,
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
     * 查询用户批量下载/做种的数量统计
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static activityControllerUserCounts(
        requestBody: UserCountsBatchRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<UserCountsBatchItemDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/activity/user/counts',
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
     * 查询某种子当前做种的用户集合（userId）
     * @param infoHash 种子 infohash（小写十六进制）
     * @returns any 成功
     * @throws ApiError
     */
    public static activityControllerTorrentSeeds(
        infoHash: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activity/torrent/{infoHash}/seeds',
            path: {
                'infoHash': infoHash,
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
     * 查询某种子当前下载的用户集合（userId）
     * @param infoHash 种子 infohash（小写十六进制）
     * @returns any 成功
     * @throws ApiError
     */
    public static activityControllerTorrentLeeches(
        infoHash: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activity/torrent/{infoHash}/leeches',
            path: {
                'infoHash': infoHash,
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
     * 批量查询种子下载/做种的数量统计
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static activityControllerTorrentCounts(
        requestBody: TorrentCountsBatchRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<TorrentCountsBatchItemDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/activity/torrent/counts',
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
