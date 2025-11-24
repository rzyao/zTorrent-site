/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PtGenService {
    /**
     * 转发链接到 PT-Gen 并返回结果
     * 请求地址: https://pt-gen-refactor.861207555.workers.dev/，入参形如 {"url":"https://movie.douban.com/subject/1292052/"}
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static ptGenControllerFetch(
        requestBody: {
            url: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: (Record<string, any> | {
            raw?: string;
        });
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pt-gen/fetch',
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
