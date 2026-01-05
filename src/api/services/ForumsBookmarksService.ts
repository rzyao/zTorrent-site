/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkResponseDto } from '../models/BookmarkResponseDto';
import type { GetBookmarkStatusDto } from '../models/GetBookmarkStatusDto';
import type { ListBookmarksDto } from '../models/ListBookmarksDto';
import type { Object } from '../models/Object';
import type { ToggleBookmarkDto } from '../models/ToggleBookmarkDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsBookmarksService {
    /**
     * 切换收藏状态
     * @param requestBody
     * @returns any 收藏状态
     * @throws ApiError
     */
    public static bookmarksControllerToggle(
        requestBody: ToggleBookmarkDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: BookmarkResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/bookmarks/toggle',
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
     * 获取收藏状态
     * @param requestBody
     * @returns any 收藏状态
     * @throws ApiError
     */
    public static bookmarksControllerGetStatus(
        requestBody: GetBookmarkStatusDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: BookmarkResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/bookmarks/status',
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
     * 获取我的收藏列表
     * @param requestBody
     * @returns any 收藏分页列表
     * @throws ApiError
     */
    public static bookmarksControllerList(
        requestBody: ListBookmarksDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/bookmarks/list',
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
