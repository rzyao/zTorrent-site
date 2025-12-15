/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRecommendationConfigDto } from '../models/CreateRecommendationConfigDto';
import type { CreateRecommendationTabDto } from '../models/CreateRecommendationTabDto';
import type { Object } from '../models/Object';
import type { RecommendationConfigDto } from '../models/RecommendationConfigDto';
import type { RecommendationConfigIdDto } from '../models/RecommendationConfigIdDto';
import type { RecommendationTabDto } from '../models/RecommendationTabDto';
import type { UpdateRecommendationConfigRequestDto } from '../models/UpdateRecommendationConfigRequestDto';
import type { UpdateRecommendationTabRequestDto } from '../models/UpdateRecommendationTabRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecommendationsService {
    /**
     * 创建推荐配置
     * @param requestBody
     * @returns any 已创建
     * @throws ApiError
     */
    public static recommendationsControllerCreateConfig(
        requestBody: CreateRecommendationConfigDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RecommendationConfigDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/create-config',
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
     * 更新推荐配置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static recommendationsControllerUpdateConfig(
        requestBody: UpdateRecommendationConfigRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RecommendationConfigDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/update-config',
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
     * 删除推荐配置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static recommendationsControllerDeleteConfig(
        requestBody: RecommendationConfigIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/delete-config',
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
     * 管理后台列表
     * @returns any 成功
     * @throws ApiError
     */
    public static recommendationsControllerListConfigs(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<RecommendationConfigDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/list-ops-configs',
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
     * 用户端默认推荐 (默认 Movie)
     * @returns any
     * @throws ApiError
     */
    public static recommendationsControllerGetIndex(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/index',
        });
    }
    /**
     * 用户端获取单个板块内容
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static recommendationsControllerGetContent(
        requestBody: RecommendationConfigIdDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/content',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 创建推荐Tab
     * @param requestBody
     * @returns any 已创建
     * @throws ApiError
     */
    public static recommendationsControllerCreateTab(
        requestBody: CreateRecommendationTabDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RecommendationTabDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/create-tab',
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
     * 更新推荐Tab
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static recommendationsControllerUpdateTab(
        requestBody: UpdateRecommendationTabRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RecommendationTabDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/update-tab',
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
     * 删除推荐Tab
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static recommendationsControllerDeleteTab(
        requestBody: RecommendationConfigIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/delete-tab',
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
     * 管理后台Tab列表
     * @returns any 成功
     * @throws ApiError
     */
    public static recommendationsControllerListTabs(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<RecommendationTabDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/list-tabs',
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
     * 用户端获取启用的Tab
     * @returns any 成功
     * @throws ApiError
     */
    public static recommendationsControllerGetActiveTabs(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<RecommendationTabDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recommendations/active-tabs',
        });
    }
}
