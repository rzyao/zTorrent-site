/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumResourceCategoryMapping } from '../models/ForumResourceCategoryMapping';
import type { UpdateMappingDto } from '../models/UpdateMappingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumAdminService {
    /**
     * 获取所有资源映射配置
     * @returns any 成功
     * @throws ApiError
     */
    public static forumAdminMappingControllerFindAll(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumResourceCategoryMapping;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/forum/mappings',
        });
    }
    /**
     * 更新或创建资源映射配置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static forumAdminMappingControllerUpsert(
        requestBody: UpdateMappingDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumResourceCategoryMapping;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/forum/mappings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
