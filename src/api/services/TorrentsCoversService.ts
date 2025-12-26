/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListPendingCoversDto } from '../models/ListPendingCoversDto';
import type { ListPendingCoversResponseDto } from '../models/ListPendingCoversResponseDto';
import type { OkDto } from '../models/OkDto';
import type { UploadCoverThumbDto } from '../models/UploadCoverThumbDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentsCoversService {
    /**
     * 获取尚未压缩处理的封面链接列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentCoverControllerListPendingCovers(
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
    public static torrentCoverControllerUploadCoverThumb(
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
}
