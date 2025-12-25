/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DictionaryService {
    /**
     * 获取所有key-label字典
     * @returns any 成功
     * @throws ApiError
     */
    public static dictionaryControllerDictionaries(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            categories?: Array<{
                key?: string;
                label?: string;
            }>;
            userOrderBy?: Array<{
                key?: string;
                label?: string;
            }>;
            adminSortBy?: Array<{
                key?: string;
                label?: string;
            }>;
            queryOps?: Array<{
                key?: string;
                label?: string;
            }>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dictionary/list',
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
