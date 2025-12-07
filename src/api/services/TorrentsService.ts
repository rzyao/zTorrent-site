/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminListTorrentsDto } from '../models/AdminListTorrentsDto';
import type { AdminListTorrentsResponseDto } from '../models/AdminListTorrentsResponseDto';
import type { AutoUploadTorrentDto } from '../models/AutoUploadTorrentDto';
import type { CheckInfoHashDto } from '../models/CheckInfoHashDto';
import type { CreateDownloadUrlDto } from '../models/CreateDownloadUrlDto';
import type { CreateSimpleTorrentDto } from '../models/CreateSimpleTorrentDto';
import type { CreateTorrentDto } from '../models/CreateTorrentDto';
import type { DeleteTorrentDto } from '../models/DeleteTorrentDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { ExistsDto } from '../models/ExistsDto';
import type { GetTorrentDto } from '../models/GetTorrentDto';
import type { ListPendingCoversDto } from '../models/ListPendingCoversDto';
import type { ListPendingCoversResponseDto } from '../models/ListPendingCoversResponseDto';
import type { ListTorrentsDto } from '../models/ListTorrentsDto';
import type { ListTorrentsResponseDto } from '../models/ListTorrentsResponseDto';
import type { OkDto } from '../models/OkDto';
import type { RecordDownloadDto } from '../models/RecordDownloadDto';
import type { ReviewDto } from '../models/ReviewDto';
import type { SearchTorrentsDto } from '../models/SearchTorrentsDto';
import type { SearchTorrentsResponseDto } from '../models/SearchTorrentsResponseDto';
import type { UpdateTorrentDto } from '../models/UpdateTorrentDto';
import type { UploadCoverThumbDto } from '../models/UploadCoverThumbDto';
import type { UrlDto } from '../models/UrlDto';
import type { UserListTorrentsDto } from '../models/UserListTorrentsDto';
import type { UserListTorrentsResponseDto } from '../models/UserListTorrentsResponseDto';
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
        data?: EmptyObjectDto;
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
     * 生成一次性下载链接
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerCreateDownloadUrl(
        requestBody: CreateDownloadUrlDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UrlDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/download-url',
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
        data?: EmptyObjectDto;
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
        data?: ListPendingCoversResponseDto;
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
        requestBody: UploadCoverThumbDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: OkDto;
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
        data?: ExistsDto;
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
        data?: EmptyObjectDto;
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
        data?: UserListTorrentsResponseDto;
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
     * 搜索：字符串+影片ID；排除已关联该影片的种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerSearch(
        requestBody: SearchTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SearchTorrentsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/search',
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
        data?: AdminListTorrentsResponseDto;
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
        data?: ListTorrentsResponseDto;
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
        data?: EmptyObjectDto;
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
        data?: EmptyObjectDto;
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
        data?: EmptyObjectDto;
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
        data?: OkDto;
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
        data?: OkDto;
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
}
