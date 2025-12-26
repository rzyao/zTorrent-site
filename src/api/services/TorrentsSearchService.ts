/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetTorrentDto } from '../models/GetTorrentDto';
import type { ListTorrentsDto } from '../models/ListTorrentsDto';
import type { Object } from '../models/Object';
import type { SearchTorrentsDto } from '../models/SearchTorrentsDto';
import type { SearchTorrentsResponseDto } from '../models/SearchTorrentsResponseDto';
import type { UserListTorrentsDto } from '../models/UserListTorrentsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TorrentsSearchService {
    /**
     * 用户种列表（普通用户查询已审核种子）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentSearchControllerList(
        requestBody: UserListTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/search/list',
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
     * 种子全文检索与搜索
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentSearchControllerSearch(
        requestBody: SearchTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SearchTorrentsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/search/global',
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
     * 获取种子详细详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentSearchControllerDetail(
        requestBody: GetTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/search/detail',
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
     * 种子选择器接口（用于媒体绑定）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static torrentSearchControllerPicker(
        requestBody: ListTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/torrents/search/picker',
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
