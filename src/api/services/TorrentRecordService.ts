/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { FindRecordsByTorrentIdDto } from '../models/FindRecordsByTorrentIdDto';
import type { FindTorrentRecordsDto } from '../models/FindTorrentRecordsDto';
import type { FindUserRecordsDto } from '../models/FindUserRecordsDto';
import type { FindUserTorrentsDto } from '../models/FindUserTorrentsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentRecordService {
    /**
     * 用户已发布的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerFindPublished(
        requestBody: FindUserTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/published',
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
     * 用户正在做种的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerFindSeeding(
        requestBody: FindUserTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/seeding',
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
     * 用户正在下载的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerFindDownloading(
        requestBody: FindUserTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/downloading',
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
     * 用户已下载完成的种子列表（可指定userId）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerFindCompleted(
        requestBody: FindUserTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/completed',
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
     * 用户未完成下载的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerFindIncomplete(
        requestBody: FindUserTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/incomplete',
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
     * 统计各类型种子数量
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerGetStats(
        requestBody: EmptyObjectDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/stats',
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
     * 查询下载记录列表（支持userId、torrentId、分页）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerFindRecords(
        requestBody: FindTorrentRecordsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/records/list',
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
     * 根据种子ID查询正在下载的记录（Redis leech集合→passkey映射）；列表每条新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerDownloadingToorrent(
        requestBody: FindRecordsByTorrentIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/torrent/downloading/list',
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
     * 根据种子ID查询发布的种子（列表结构返回单条）；返回字段新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerPublishedToorrent(
        requestBody: FindRecordsByTorrentIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/torrent/published/list',
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
     * 根据种子ID查询正在做种的记录（Redis集合→passkey筛选）；列表每条新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerSeedingToorrent(
        requestBody: FindRecordsByTorrentIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/torrent/seeding/list',
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
     * 根据种子ID查询已完成的下载记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerCompletedToorrent(
        requestBody: FindRecordsByTorrentIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/torrent/completed/list',
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
     * 根据种子ID查询未完成的下载记录；列表每条新增 downloads/seeders/leechers
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerIncompleteToorrent(
        requestBody: FindRecordsByTorrentIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/torrent/incomplete/list',
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
     * 按用户ID查询下载记录列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentRecordControllerUserRecords(
        requestBody: FindUserRecordsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrent-record/user/records/list',
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
