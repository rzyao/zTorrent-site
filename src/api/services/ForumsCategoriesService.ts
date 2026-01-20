/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryByKeyDto } from '../models/CategoryByKeyDto';
import type { CategoryPaginatedResponseDto } from '../models/CategoryPaginatedResponseDto';
import type { CategoryTagsDto } from '../models/CategoryTagsDto';
import type { CreateCategoryDto } from '../models/CreateCategoryDto';
import type { ForumCategory } from '../models/ForumCategory';
import type { IdParamDto } from '../models/IdParamDto';
import type { Object } from '../models/Object';
import type { PaginationParamDto } from '../models/PaginationParamDto';
import type { UpdateCategoryParamDto } from '../models/UpdateCategoryParamDto';
import type { UpdateCategorySortDto } from '../models/UpdateCategorySortDto';
import type { UpdateCategoryVisibilityDto } from '../models/UpdateCategoryVisibilityDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsCategoriesService {
    /**
     * 获取所有分类
     * @returns any 分类列表
     * @throws ApiError
     */
    public static categoriesControllerFindAll(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<ForumCategory>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/list',
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
     * 获取分类详情
     * @param requestBody
     * @returns any 分类详情
     * @throws ApiError
     */
    public static categoriesControllerFindOne(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumCategory;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/detail',
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
     * 根据 key 获取分类
     * @param requestBody
     * @returns any 分类详情
     * @throws ApiError
     */
    public static categoriesControllerFindByKey(
        requestBody: CategoryByKeyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumCategory;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/by-key',
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
     * 获取分类可用标签
     * @param requestBody
     * @returns any 分类可用标签
     * @throws ApiError
     */
    public static categoriesControllerFindCategoryTags(
        requestBody: CategoryTagsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/tags',
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
     * 获取所有分类 (管理员)
     * @param requestBody
     * @returns any 分类分页列表
     * @throws ApiError
     */
    public static categoriesControllerFindAllAdmin(
        requestBody: PaginationParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: CategoryPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/admin/list',
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
     * 创建分类 (管理员)
     * @param requestBody
     * @returns any 创建成功
     * @throws ApiError
     */
    public static categoriesControllerCreate(
        requestBody: CreateCategoryDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumCategory;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/create',
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
     * 更新分类 (管理员)
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static categoriesControllerUpdate(
        requestBody: UpdateCategoryParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumCategory;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/update',
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
     * 删除分类 (管理员)
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static categoriesControllerRemove(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/delete',
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
     * 恢复已删除的分类 (管理员)
     * @param requestBody
     * @returns any 恢复成功
     * @throws ApiError
     */
    public static categoriesControllerRestore(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumCategory;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/restore',
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
     * 切换分类激活状态 (管理员)
     * @param requestBody
     * @returns any 状态已切换
     * @throws ApiError
     */
    public static categoriesControllerToggleActive(
        requestBody: IdParamDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumCategory;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/toggle-active',
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
     * 批量更新分类排序 (管理员)
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static categoriesControllerUpdateSortOrder(
        requestBody: UpdateCategorySortDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/update-sort',
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
     * 更新分类标签可见性配置 (管理员)
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static categoriesControllerUpdateVisibility(
        requestBody: UpdateCategoryVisibilityDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/categories/update-visibility',
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
