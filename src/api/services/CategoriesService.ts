/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminListCategoriesResultDto } from '../models/AdminListCategoriesResultDto';
import type { CategoryDto } from '../models/CategoryDto';
import type { CategoryTreeParentDto } from '../models/CategoryTreeParentDto';
import type { CreateCategoryDto } from '../models/CreateCategoryDto';
import type { ListCategoriesDto } from '../models/ListCategoriesDto';
import type { SuccessDto } from '../models/SuccessDto';
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
        data?: CategoryDto;
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
        data?: CategoryDto;
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
        data?: SuccessDto;
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
     * 分页列出分类列表（管理员）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerListCategoriesForAdmin(
        requestBody: ListCategoriesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: AdminListCategoriesResultDto;
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
     * 分类树结构（父分类及其子分类）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static categoriesControllerTree(
        requestBody: {
            kind?: 'torrent' | 'film' | 'playlist';
            genre?: 'General' | 'Adult';
            enabled?: boolean;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<CategoryTreeParentDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/tree',
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
