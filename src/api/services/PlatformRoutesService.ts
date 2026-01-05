/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRoutesResponseDto } from '../models/UserRoutesResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlatformRoutesService {
    /**
     * 获取用户路由配置
     * @returns any 鉴权后的路由树
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
}
