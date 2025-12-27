/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchUpdateNavigationDto } from '../models/BatchUpdateNavigationDto';
import type { CreateNavigationItemDto } from '../models/CreateNavigationItemDto';
import type { ImportNavigationDto } from '../models/ImportNavigationDto';
import type { NavigationItem } from '../models/NavigationItem';
import type { UpdateNavigationItemDto } from '../models/UpdateNavigationItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminNavigationService {
    /**
     * 获取所有导航配置（管理端）
     * @returns any 成功
     * @throws ApiError
     */
    public static adminNavigationControllerGetAllNavigation(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<NavigationItem>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/navigation',
        });
    }
    /**
     * 创建导航项
     * @param requestBody
     * @returns any 已创建
     * @throws ApiError
     */
    public static adminNavigationControllerCreateItem(
        requestBody: CreateNavigationItemDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: NavigationItem;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/navigation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 批量更新导航配置
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static adminNavigationControllerBatchUpdate(
        requestBody: BatchUpdateNavigationDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/navigation/batch',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 更新导航项
     * @param id
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static adminNavigationControllerUpdateItem(
        id: string,
        requestBody: UpdateNavigationItemDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/navigation/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 删除导航项
     * @param id
     * @returns any 删除成功
     * @throws ApiError
     */
    public static adminNavigationControllerDeleteItem(
        id: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/navigation/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 导入导航配置（支持层级）
     * @param requestBody
     * @returns any 导入成功
     * @throws ApiError
     */
    public static adminNavigationControllerImportNavigation(
        requestBody: ImportNavigationDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/navigation/import',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
