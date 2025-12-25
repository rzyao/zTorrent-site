/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoUploadTorrentDto } from '../models/AutoUploadTorrentDto';
import type { CreateDownloadUrlDto } from '../models/CreateDownloadUrlDto';
import type { CreateTorrentDto } from '../models/CreateTorrentDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { PendingReviewsDto } from '../models/PendingReviewsDto';
import type { PendingReviewsResponseDto } from '../models/PendingReviewsResponseDto';
import type { ReviewHistoryDto } from '../models/ReviewHistoryDto';
import type { ReviewHistoryResponseDto } from '../models/ReviewHistoryResponseDto';
import type { UrlDto } from '../models/UrlDto';
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
     * 自动上传并创建种子（外部下载器插件）
     * @param formData
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerUploadAuto(
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
     * 待审核种子列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerPending(
        requestBody: PendingReviewsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PendingReviewsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review/pending',
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
     * 审核历史记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentsControllerReviewHistory(
        requestBody: ReviewHistoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ReviewHistoryResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/review/history',
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
     * 获取可选种子列表（id/name）
     * @returns any
     * @throws ApiError
     */
    public static torrentsOptionsControllerOptions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/torrents/options/list',
        });
    }
}
