/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AggregatedCommentVo } from '../models/AggregatedCommentVo';
import type { MappingConfigVo } from '../models/MappingConfigVo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UnifiedCommentsService {
    /**
     * 获取某资源类型的默认版块配置
     * @param type
     * @returns any 成功
     * @throws ApiError
     */
    public static forumCommentsControllerGetConfig(
        type: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: MappingConfigVo;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/config',
            query: {
                'type': type,
            },
        });
    }
    /**
     * 聚合获取资源相关的热评
     * @param type 资源类型
     * @param id 资源ID
     * @param limit 限制条数
     * @returns any 成功
     * @throws ApiError
     */
    public static forumCommentsControllerGetTopPosts(
        type: string,
        id: string,
        limit: number = 5,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: AggregatedCommentVo;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/top-posts',
            query: {
                'type': type,
                'id': id,
                'limit': limit,
            },
        });
    }
}
