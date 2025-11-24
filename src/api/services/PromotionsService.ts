/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddTorrentPromotionDto } from '../models/AddTorrentPromotionDto';
import type { CreatePromotionDto } from '../models/CreatePromotionDto';
import type { ListPromotionsDto } from '../models/ListPromotionsDto';
import type { ListTorrentPromotionsDto } from '../models/ListTorrentPromotionsDto';
import type { PromotionIdDto } from '../models/PromotionIdDto';
import type { TorrentPromotionIdDto } from '../models/TorrentPromotionIdDto';
import type { UpdatePromotionDto } from '../models/UpdatePromotionDto';
import type { UpdateTorrentPromotionDto } from '../models/UpdateTorrentPromotionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PromotionsService {
    /**
     * 创建促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerCreate(
        requestBody: CreatePromotionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/create',
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
     * 更新促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerUpdate(
        requestBody: {
            id: string;
            data: UpdatePromotionDto;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/update',
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
     * 删除促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerDelete(
        requestBody: PromotionIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/delete',
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
     * 列表促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerList(
        requestBody: ListPromotionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/list',
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
     * 添加种子促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerAddTorrentPromotion(
        requestBody: AddTorrentPromotionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/torrents/add',
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
     * 更新种子促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerUpdateTorrentPromotion(
        requestBody: {
            id: string;
            data: UpdateTorrentPromotionDto;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/torrents/update',
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
     * 删除种子促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerDeleteTorrentPromotion(
        requestBody: TorrentPromotionIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/torrents/delete',
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
     * 列表种子促销
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static promotionsControllerListTorrentPromotions(
        requestBody: ListTorrentPromotionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promotions/torrents/list',
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
