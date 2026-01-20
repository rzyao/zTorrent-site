/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { SiteStatsOverviewVo } from '../models/SiteStatsOverviewVo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SiteStatsService {
    /**
     * 获取站点统计概览
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static siteStatsControllerOverview(
        requestBody: EmptyObjectDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SiteStatsOverviewVo;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/site/stats/overview',
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
