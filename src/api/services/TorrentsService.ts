/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddUserTorrentDto } from '../models/AddUserTorrentDto';
import type { AutoUploadTorrentDto } from '../models/AutoUploadTorrentDto';
import type { CreateTorrentDto } from '../models/CreateTorrentDto';
import type { DeleteTorrentDto } from '../models/DeleteTorrentDto';
import type { GetTorrentDto } from '../models/GetTorrentDto';
import type { ListTorrentsDto } from '../models/ListTorrentsDto';
import type { ListTorrentUsersDto } from '../models/ListTorrentUsersDto';
import type { ListUserTorrentsDto } from '../models/ListUserTorrentsDto';
import type { RecordDownloadDto } from '../models/RecordDownloadDto';
import type { RemoveUserTorrentDto } from '../models/RemoveUserTorrentDto';
import type { ReportUserTorrentDto } from '../models/ReportUserTorrentDto';
import type { UpdateTorrentDto } from '../models/UpdateTorrentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentsService {
    /**
     * 上传并创建种子
     * @param formData
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerUpload(
        formData: CreateTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * 脚本自动上传种子（Base64）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerUploadAuto(
        requestBody: AutoUploadTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/upload/auto',
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
     * 按ID获取种子详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerGet(
        requestBody: GetTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/get',
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
     * 查询种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerList(
        requestBody: ListTorrentsDto,
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
            url: '/torrents/list',
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
     * 更新种子元数据
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerUpdate(
        requestBody: UpdateTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/update',
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
     * 删除（软删除）种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerDelete(
        requestBody: DeleteTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/delete',
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
     * 记录下载请求
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerRecordDownload(
        requestBody: RecordDownloadDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/record-download',
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
     * 创建用户-种子关联
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerAddUserTorrent(
        requestBody: AddUserTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/user-torrents/add',
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
     * 移除用户-种子关联
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerRemoveUserTorrent(
        requestBody: RemoveUserTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/user-torrents/remove',
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
     * 按用户查询其关联的种子ID列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerListUserTorrents(
        requestBody: ListUserTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            torrentIds?: Array<string>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/user-torrents/list-by-user',
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
     * 按种子查询其关联的用户ID列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerListTorrentUsers(
        requestBody: ListTorrentUsersDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            userIds?: Array<string>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/user-torrents/list-by-torrent',
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
     * 上报用户-种子做种与统计数据（仅本人）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerReportUserTorrent(
        requestBody: ReportUserTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/user-torrents/report',
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
