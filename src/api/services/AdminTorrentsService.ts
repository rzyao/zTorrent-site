/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminListTorrentsDto } from '../models/AdminListTorrentsDto';
import type { AdminListTorrentsResponseDto } from '../models/AdminListTorrentsResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminTorrentsService {
    /**
     * 管理员种子列表（支持高级查询）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentAdminControllerList(
        requestBody: AdminListTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: AdminListTorrentsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/torrents/list',
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
