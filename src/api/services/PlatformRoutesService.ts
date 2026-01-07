/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportRoutesDto } from '../models/ImportRoutesDto';
import type { Object } from '../models/Object';
import type { UserRoutesResponseDto } from '../models/UserRoutesResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlatformRoutesService {
    /**
     * 获取用户路由配置
     * @returns any 过滤后的路由树
     * @throws ApiError
     */
    public static routesControllerGetUserRoutes(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserRoutesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/routes/user',
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
     * 批量导入路由 (临时公开)
     * @param requestBody
     * @returns any 导入成功
     * @throws ApiError
     */
    public static routesControllerImport(
        requestBody: ImportRoutesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/routes/import',
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
     * 清理路由缓存 (临时)
     * @returns any 缓存已清理
     * @throws ApiError
     */
    public static routesControllerClearCache(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/routes/clear-cache',
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
