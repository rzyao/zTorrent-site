/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentRecordService {
    /**
     * 用户已发布的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param userId 指定用户ID，缺省为当前登录用户
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindPublished(
        userId?: string,
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/published',
            query: {
                'userId': userId,
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
     * 用户正在做种的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param userId 指定用户ID，缺省为当前登录用户
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindSeeding(
        userId?: string,
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/seeding',
            query: {
                'userId': userId,
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
     * 用户正在下载的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param userId 指定用户ID，缺省为当前登录用户
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindDownloading(
        userId?: string,
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/downloading',
            query: {
                'userId': userId,
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
     * 用户已下载完成的种子列表（可指定userId）
     * @param userId 指定用户ID，缺省为当前登录用户
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindCompleted(
        userId?: string,
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/completed',
            query: {
                'userId': userId,
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
     * 用户未完成下载的种子列表（可指定userId）；返回字段新增 downloads/seeders/leechers
     * @param userId 指定用户ID，缺省为当前登录用户
     * @param search
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindIncomplete(
        userId?: string,
        search?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/incomplete',
            query: {
                'userId': userId,
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
    /**
     * 查询下载记录列表（支持userId、torrentId、分页）
     * @param userId 指定用户ID，缺省为当前登录用户
     * @param torrentId
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerFindRecords(
        userId?: string,
        torrentId?: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/torrent-records',
            query: {
                'userId': userId,
                'torrentId': torrentId,
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
     * 根据种子ID查询正在下载的记录（Redis leech集合→passkey映射）；列表每条新增 downloads/seeders/leechers
     * @param torrentId
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerDownloadingToorrent(
        torrentId: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/downloading-toorrent',
            query: {
                'torrentId': torrentId,
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
     * 根据种子ID查询发布的种子（列表结构返回单条）；返回字段新增 downloads/seeders/leechers
     * @param torrentId
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerPublishedToorrent(
        torrentId: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/published-toorrent',
            query: {
                'torrentId': torrentId,
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
     * 根据种子ID查询正在做种的记录（Redis集合→passkey筛选）；列表每条新增 downloads/seeders/leechers
     * @param torrentId
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerSeedingToorrent(
        torrentId: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/seeding-toorrent',
            query: {
                'torrentId': torrentId,
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
     * 根据种子ID查询已完成的下载记录
     * @param torrentId
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerCompletedToorrent(
        torrentId: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/completed-toorrent',
            query: {
                'torrentId': torrentId,
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
     * 根据种子ID查询未完成的下载记录；列表每条新增 downloads/seeders/leechers
     * @param torrentId
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerIncompleteToorrent(
        torrentId: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/incomplete-toorrent',
            query: {
                'torrentId': torrentId,
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
     * 按用户ID查询下载记录列表
     * @param userId
     * @param limit
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static torrentRecordControllerUserRecords(
        userId: string,
        limit?: number,
        page?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/torrent-record/user_records',
            query: {
                'userId': userId,
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
}
