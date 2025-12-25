/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddThreadPromotionDto } from '../models/AddThreadPromotionDto';
import type { ListThreadPromotionsDto } from '../models/ListThreadPromotionsDto';
import type { ThreadPromotionIdDto } from '../models/ThreadPromotionIdDto';
import type { UpdateThreadPromotionDto } from '../models/UpdateThreadPromotionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumPromotionsService {
    /**
     * 添加主题高亮
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumPromotionsControllerAdd(
        requestBody: AddThreadPromotionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forum/promotions/add',
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
     * 更新主题高亮
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumPromotionsControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateThreadPromotionDto;
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
            url: '/forum/promotions/update',
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
     * 删除主题高亮
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumPromotionsControllerDelete(
        requestBody: ThreadPromotionIdDto,
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
            url: '/forum/promotions/delete',
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
     * 主题高亮列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumPromotionsControllerListPromotions(
        requestBody: ListThreadPromotionsDto,
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
            url: '/forum/promotions/list',
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
