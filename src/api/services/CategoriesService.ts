/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCategoryDto } from '../models/CreateCategoryDto';
import type { ListCategoriesDto } from '../models/ListCategoriesDto';
import type { SetUserCategoriesDto } from '../models/SetUserCategoriesDto';
import type { UpdateCategoryDto } from '../models/UpdateCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * 创建分类
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerCreate(
        requestBody: CreateCategoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            id?: string;
            key?: string;
            label?: string;
            description?: string | null;
            enabled?: boolean;
            isDefault?: boolean;
            sort?: number;
            createdAt?: string;
            updatedAt?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/create',
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
     * 更新分类
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerUpdate(
        requestBody: {
            id: string;
            data: UpdateCategoryDto;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            id?: string;
            key?: string;
            label?: string;
            description?: string | null;
            enabled?: boolean;
            isDefault?: boolean;
            sort?: number;
            createdAt?: string;
            updatedAt?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/update',
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
     * 删除分类
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerDelete(
        requestBody: {
            id: string;
        },
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
            url: '/categories/delete',
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
     * 分页获取分类列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerList(
        requestBody: ListCategoriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<{
                id?: string;
                key?: string;
                label?: string;
                description?: string | null;
                enabled?: boolean;
                isDefault?: boolean;
                sort?: number;
                createdAt?: string;
                updatedAt?: string;
            }>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/admin/list',
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
     * 获取可用分类（启用）
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerAvailable(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            id?: string;
            key?: string;
            label?: string;
            description?: string | null;
            enabled?: boolean;
            isDefault?: boolean;
            sort?: number;
            createdAt?: string;
            updatedAt?: string;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/available',
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
     * 用户获取可展示分类
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerListUserCategories(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            id?: string;
            key?: string;
            label?: string;
            description?: string | null;
            enabled?: boolean;
            sort?: number;
            createdAt?: string;
            updatedAt?: string;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/user/list',
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
     * 用户设置可展示分类
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerSetUserCategories(
        requestBody: SetUserCategoriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
            count?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/user/set',
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
