/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoUploadTorrentDto } from '../models/AutoUploadTorrentDto';
import type { CheckInfoHashDto } from '../models/CheckInfoHashDto';
import type { CreateSimpleTorrentDto } from '../models/CreateSimpleTorrentDto';
import type { CreateTorrentDto } from '../models/CreateTorrentDto';
import type { DeleteTorrentDto } from '../models/DeleteTorrentDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { ExistsDto } from '../models/ExistsDto';
import type { OkDto } from '../models/OkDto';
import type { UpdateTorrentDto } from '../models/UpdateTorrentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentsUploadService {
    /**
     * 上传并创建种子
     * @param formData
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentUploadControllerUpload(
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
     * 自动上传并创建种子（外部下载器插件）
     * @param formData
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentUploadControllerUploadAuto(
        formData: AutoUploadTorrentDto,
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
     * 验证 infohash 是否存在
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentUploadControllerExistsByInfoHash(
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
            url: '/torrents/upload/exists/infohash',
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
    public static torrentUploadControllerCreate(
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
            url: '/torrents/upload/create',
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
    public static torrentUploadControllerUpdate(
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
            url: '/torrents/upload/update',
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
    public static torrentUploadControllerDelete(
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
            url: '/torrents/upload/delete',
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
