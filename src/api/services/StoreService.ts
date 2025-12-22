/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateStoreItemDto } from '../models/CreateStoreItemDto';
import type { ListStoreItemsDto } from '../models/ListStoreItemsDto';
import type { ListStoreOrdersDto } from '../models/ListStoreOrdersDto';
import type { PurchaseStoreItemDto } from '../models/PurchaseStoreItemDto';
import type { StoreItemIdDto } from '../models/StoreItemIdDto';
import type { StoreOrderIdDto } from '../models/StoreOrderIdDto';
import type { ToggleStoreItemDto } from '../models/ToggleStoreItemDto';
import type { UpdateStoreItemDto } from '../models/UpdateStoreItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoreService {
    /**
     * 商品列表（POST）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerListItemsPost(
        requestBody: ListStoreItemsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            pageSize?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/list',
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
     * 购买商品
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerPurchase(
        requestBody: PurchaseStoreItemDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            id?: string;
            status?: string;
            pointsCharged?: string;
            quantity?: number;
            deliveryResult?: Record<string, any>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/purchase',
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
     * 创建商品
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerCreateItem(
        requestBody: CreateStoreItemDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/create',
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
     * 更新商品
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerUpdateItem(
        requestBody: UpdateStoreItemDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/update',
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
     * 删除商品
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerDeleteItem(
        requestBody: StoreItemIdDto,
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
            url: '/store/items/delete',
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
     * 上下架商品
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerToggleItem(
        requestBody: ToggleStoreItemDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/toggle',
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
     * 订单列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerListOrders(
        requestBody: ListStoreOrdersDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            pageSize?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/orders/list',
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
     * 订单详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerOrderDetail(
        requestBody: StoreOrderIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/orders/detail',
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
