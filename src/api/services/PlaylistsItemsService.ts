/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddItemToPlaylistDto } from '../models/AddItemToPlaylistDto';
import type { ListPlaylistItemsDto } from '../models/ListPlaylistItemsDto';
import type { ListPlaylistItemsResponseDto } from '../models/ListPlaylistItemsResponseDto';
import type { Object } from '../models/Object';
import type { RemoveItemFromPlaylistDto } from '../models/RemoveItemFromPlaylistDto';
import type { ReorderItemsInPlaylistDto } from '../models/ReorderItemsInPlaylistDto';
import type { SearchAddableItemsDto } from '../models/SearchAddableItemsDto';
import type { SearchAddableItemsResponseDto } from '../models/SearchAddableItemsResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlaylistsItemsService {
    /**
     * 添加内容到片单（支持电影和剧集）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistItemsControllerAddItem(
        requestBody: AddItemToPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/add-item',
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
     * 从片单移除内容（支持电影和剧集）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistItemsControllerRemoveItem(
        requestBody: RemoveItemFromPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/remove-item',
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
     * 片单内容排序（支持电影和剧集）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistItemsControllerReorderItems(
        requestBody: ReorderItemsInPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/reorder-items',
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
     * 获取片单内容项分页列表（支持电影和剧集）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistItemsControllerListItems(
        requestBody: ListPlaylistItemsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListPlaylistItemsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/items/list',
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
     * 搜索可添加到片单的内容项（严格按片单类型）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistItemsControllerSearchAddableItems(
        requestBody: SearchAddableItemsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SearchAddableItemsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/items/search-addable',
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
