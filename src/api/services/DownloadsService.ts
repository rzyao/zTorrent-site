/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDownloadUrlDto } from '../models/CreateDownloadUrlDto';
import type { DownloadByTokenDto } from '../models/DownloadByTokenDto';
import type { OkDto } from '../models/OkDto';
import type { RecordDownloadDto } from '../models/RecordDownloadDto';
import type { UrlDto } from '../models/UrlDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DownloadsService {
    /**
     * 通过 Token 下载种子（GET，适用于浏览器/下载器）
     * @param token 一次性下载 Token
     * @returns binary 返回 .torrent 文件
     * @throws ApiError
     */
    public static downloadsControllerDownloadGet(
        token: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/download/{token}',
            path: {
                'token': token,
            },
            errors: {
                404: `Token 无效或已过期`,
            },
        });
    }
    /**
     * 一次性下载种子（POST，Token 原子消费）
     * @param requestBody
     * @returns binary 返回 .torrent 文件
     * @throws ApiError
     */
    public static downloadsControllerDownload(
        requestBody: DownloadByTokenDto,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/download',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Token 无效或已过期`,
            },
        });
    }
    /**
     * 生成一次性下载链接
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static downloadsControllerCreateDownloadUrl(
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
            url: '/download/url',
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
    public static downloadsControllerRecordDownload(
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
            url: '/download/record',
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
