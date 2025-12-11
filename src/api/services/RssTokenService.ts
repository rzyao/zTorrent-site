/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetRssTokenResultDto } from '../models/GetRssTokenResultDto';
import type { ResetRssTokenResultDto } from '../models/ResetRssTokenResultDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RssTokenService {
    /**
     * @returns any 成功
     * @throws ApiError
     */
    public static rssTokenControllerGetMine(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: GetRssTokenResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rss/token',
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
     * @returns any 成功
     * @throws ApiError
     */
    public static rssTokenControllerReset(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ResetRssTokenResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rss/token/reset',
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
