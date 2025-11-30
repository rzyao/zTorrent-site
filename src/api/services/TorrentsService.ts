/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddUserTorrentDto } from '../models/AddUserTorrentDto';
import type { AdminListTorrentsDto } from '../models/AdminListTorrentsDto';
import type { AutoUploadTorrentDto } from '../models/AutoUploadTorrentDto';
import type { CheckInfoHashDto } from '../models/CheckInfoHashDto';
import type { CreateSimpleTorrentDto } from '../models/CreateSimpleTorrentDto';
import type { CreateTorrentDto } from '../models/CreateTorrentDto';
import type { DeleteTorrentDto } from '../models/DeleteTorrentDto';
import type { GetTorrentDto } from '../models/GetTorrentDto';
import type { ListPendingCoversDto } from '../models/ListPendingCoversDto';
import type { ListTorrentsDto } from '../models/ListTorrentsDto';
import type { ListTorrentUsersDto } from '../models/ListTorrentUsersDto';
import type { ListUserTorrentsDto } from '../models/ListUserTorrentsDto';
import type { RecordDownloadDto } from '../models/RecordDownloadDto';
import type { RemoveUserTorrentDto } from '../models/RemoveUserTorrentDto';
import type { ReportUserTorrentDto } from '../models/ReportUserTorrentDto';
import type { ReviewDto } from '../models/ReviewDto';
import type { UpdateTorrentDto } from '../models/UpdateTorrentDto';
import type { UserListTorrentsDto } from '../models/UserListTorrentsDto';
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
     * 获取尚未压缩处理的封面链接列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerListPendingCovers(
        requestBody: ListPendingCoversDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<{
                id?: string;
                cover?: string;
            }>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/covers/pending',
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
     * 上传封面缩略图并标记已处理
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerUploadCoverThumb(
        requestBody: {
            id: string;
            full_base64?: string | null;
            thumb_base64: string;
            medium_base64?: string | null;
            large_base64?: string | null;
        },
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
            url: '/torrents/covers/upload-thumb',
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
     * 验证 infohash 是否存在
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerExistsByInfoHash(
        requestBody: CheckInfoHashDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            exists?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/exists/infohash',
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
            url: '/torrents/detail',
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
     * 前台用户列出可展示种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerListTorrentsForUser(
        requestBody: UserListTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<{
                seedersRealtime?: number;
                leechersRealtime?: number;
            }>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/user/list-torrents',
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
     * 后台管理员列出种子列表（高级筛选）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerListTorrentsForAdmin(
        requestBody: AdminListTorrentsDto,
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
            url: '/torrents/admin/list-torrents',
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
     * 简化列出种子列表（分页+关键词）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerListSimple(
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
     * 创建种子（Base64 文件 + 元数据）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerCreate(
        requestBody: CreateSimpleTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/create',
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
     * 审核种子（通过/驳回）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerReview(
        requestBody: ReviewDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review',
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
