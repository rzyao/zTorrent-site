/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoreService {
    /**
     * 商品列表
     * @returns any
     * @throws ApiError
     */
    public static storeControllerListItems(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/store/items',
        });
    }
    /**
     * 商品列表（POST）
     * @returns any
     * @throws ApiError
     */
    public static storeControllerListItemsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/list',
        });
    }
    /**
     * 购买商品
     * @returns any 成功
     * @throws ApiError
     */
    public static storeControllerPurchase(): CancelablePromise<{
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
     * @returns any
     * @throws ApiError
     */
    public static storeControllerCreateItem(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/create',
        });
    }
    /**
     * 更新商品
     * @returns any
     * @throws ApiError
     */
    public static storeControllerUpdateItem(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/update',
        });
    }
    /**
     * 删除商品
     * @returns any
     * @throws ApiError
     */
    public static storeControllerDeleteItem(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/delete',
        });
    }
    /**
     * 上下架商品
     * @returns any
     * @throws ApiError
     */
    public static storeControllerToggleItem(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/items/toggle',
        });
    }
    /**
     * 订单列表
     * @returns any
     * @throws ApiError
     */
    public static storeControllerListOrders(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/orders/list',
        });
    }
    /**
     * 订单详情
     * @returns any
     * @throws ApiError
     */
    public static storeControllerOrderDetail(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/orders/detail',
        });
    }
}
