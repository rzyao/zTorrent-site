/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDownloaderDto } from '../models/CreateDownloaderDto';
import type { DeleteCategoryDto } from '../models/DeleteCategoryDto';
import type { DownloadDto } from '../models/DownloadDto';
import type { Downloader } from '../models/Downloader';
import type { IdDto } from '../models/IdDto';
import type { UpdateDownloaderDto } from '../models/UpdateDownloaderDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DownloadersService {
    /**
     * 获取当前用户的下载器列表（含分类与路径快照）
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerList(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            id?: string;
            name?: string;
            type?: string;
            host?: string;
            port?: number;
            username?: string | null;
            password?: string | null;
            ssl?: boolean;
            status?: string;
            version?: string | null;
            uploadSpeed?: number | null;
            downloadSpeed?: number | null;
            activeTorrents?: number | null;
            totalTorrents?: number | null;
            freeSpace?: number | null;
            categories?: Array<string>;
            tags?: Array<string>;
            downloadPaths?: Array<{
                name?: string;
                path?: string;
                freeSpace?: number;
            }>;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/list',
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
     * 新增下载器
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerCreate(
        requestBody: CreateDownloaderDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Downloader;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/create',
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
     * 查询下载器详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerDetail(
        requestBody: IdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Downloader;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/detail',
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
     * 编辑下载器配置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerUpdate(
        requestBody: UpdateDownloaderDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Downloader;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/update',
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
     * 删除下载器
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerDelete(
        requestBody: IdDto,
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
            url: '/downloaders/delete',
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
     * 测试下载器连接（返回状态与版本等）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerTest(
        requestBody: IdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Downloader;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/test',
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
     * 推送到远程下载器下载
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerDownload(
        requestBody: DownloadDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
            message?: string;
            id?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/download',
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
     * 获取远程下载器的分类/标签列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerCategories(
        requestBody: IdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/categories/list',
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
     * 按索引删除分类（部分客户端可能不支持）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerDeleteCategory(
        requestBody: DeleteCategoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/categories/delete',
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
     * 获取远程下载器的Tags标签列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerTags(
        requestBody: IdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/tags/list',
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
     * 按索引删除本地Tags标签
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerDeleteTag(
        requestBody: DeleteCategoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/tags/delete',
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
     * 获取远程下载器的下载路径列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerPaths(
        requestBody: IdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            name?: string;
            path?: string;
            freeSpace?: number;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/paths/list',
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
     * 按索引删除本地下载路径
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadersControllerDeletePath(
        requestBody: DeleteCategoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            name?: string;
            path?: string;
            freeSpace?: number;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/downloaders/paths/delete',
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
