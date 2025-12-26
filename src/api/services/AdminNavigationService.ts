/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchUpdateNavigationDto } from '../models/BatchUpdateNavigationDto';
import type { NavigationItem } from '../models/NavigationItem';
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
}
