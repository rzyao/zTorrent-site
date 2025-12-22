/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DownloadByTokenDto } from '../models/DownloadByTokenDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DownloadsService {
    /**
     * 一次性下载种子（Token 原子消费）
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
}
