/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminListPlaylistsDto } from '../models/AdminListPlaylistsDto';
import type { AdminListPlaylistsResponseDto } from '../models/AdminListPlaylistsResponseDto';
import type { CategoriesListResponseDto } from '../models/CategoriesListResponseDto';
import type { CreatePlaylistDto } from '../models/CreatePlaylistDto';
import type { DeletePlaylistDto } from '../models/DeletePlaylistDto';
import type { DeletePlaylistResponseDto } from '../models/DeletePlaylistResponseDto';
import type { FeaturedPlaylistsDto } from '../models/FeaturedPlaylistsDto';
import type { GetPlaylistDto } from '../models/GetPlaylistDto';
import type { ListPlaylistsDto } from '../models/ListPlaylistsDto';
import type { ListPlaylistsResponseDto } from '../models/ListPlaylistsResponseDto';
import type { PlaylistDTO } from '../models/PlaylistDTO';
import type { PlaylistSummaryDTO } from '../models/PlaylistSummaryDTO';
import type { UpdatePlaylistDto } from '../models/UpdatePlaylistDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlaylistsService {
    /**
     * 创建片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistCoreControllerCreate(
        requestBody: CreatePlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/create',
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
     * 更新片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistCoreControllerUpdate(
        requestBody: UpdatePlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/update',
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
     * 删除片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistCoreControllerDelete(
        requestBody: DeletePlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: DeletePlaylistResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/delete',
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
     * 列出片单列表（按类型: 公开/我的/关注）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistCoreControllerList(
        requestBody: ListPlaylistsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListPlaylistsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/list',
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
     * 获取片单详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistCoreControllerGet(
        requestBody: GetPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/detail',
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
     * 管理员通用片单列表（支持审批状态筛选）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistCoreControllerAdminList(
        requestBody: AdminListPlaylistsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: AdminListPlaylistsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/admin/list',
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
     * 获取片单分类列表
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistCoreControllerListCategories(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: CategoriesListResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/categories/list',
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
     * 精华片单推荐列表
     * @param requestBody
     * @returns any 片单列表
     * @throws ApiError
     */
    public static playlistFeaturedControllerList(
        requestBody: FeaturedPlaylistsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<PlaylistSummaryDTO>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/featured/list',
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
