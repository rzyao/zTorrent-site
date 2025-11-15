/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TrackerReportDto } from '../models/TrackerReportDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentsTrackerService {
    /**
     * Tracker推送用户种子流量信息（内部）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static trackerControllerReport(
        requestBody: TrackerReportDto,
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
            url: '/torrents/tracker/report',
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
