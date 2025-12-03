/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminListPlaylistsDto } from '../models/AdminListPlaylistsDto';
import type { PlaylistDTO } from '../models/PlaylistDTO';
import type { PlaylistItemDTO } from '../models/PlaylistItemDTO';
import type { PlaylistSummaryDTO } from '../models/PlaylistSummaryDTO';
import type { ReviewDto } from '../models/ReviewDto';
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
    public static playlistsControllerCreate(
        requestBody: {
            name: string;
            description?: string | null;
            visibility: 'public' | 'private' | 'friends';
            coverUrl?: string | null;
            tags?: Array<string> | null;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/create-playlist',
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
    public static playlistsControllerUpdate(
        requestBody: {
            id: string;
            name?: string | null;
            description?: string | null;
            visibility?: 'public' | 'private' | 'friends' | null;
            coverUrl?: string | null;
            tags?: Array<string> | null;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/update-playlist',
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
    public static playlistsControllerDelete(
        requestBody: {
            id: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            deleted?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/delete-playlist',
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
     * 列出片单列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerList(
        requestBody: {
            page?: number;
            limit?: number;
            keyword?: string | null;
            type?: 'general' | 'topic' | 'series' | 'director' | 'curation';
            visibility?: 'public' | 'private' | 'friends';
            ownerUserId?: string | null;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<PlaylistSummaryDTO>;
            total?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/list-playlists',
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
    public static playlistsControllerGet(
        requestBody: {
            id: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/get-playlist',
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
     * 添加影片到片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerAddFilm(
        requestBody: {
            playlistId: string;
            filmId: string;
            sort?: number;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/add-film',
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
     * 从片单移除影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerRemoveFilm(
        requestBody: {
            playlistId: string;
            filmId: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/remove-film',
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
     * 片单内影片排序
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerReorder(
        requestBody: {
            playlistId: string;
            order: Array<string>;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            films?: Array<PlaylistItemDTO>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/reorder-film',
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
     * 统计：浏览增加
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerIncViews(
        requestBody: {
            id: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            views?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/inc-views',
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
     * 统计：点赞
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerLike(
        requestBody: {
            id: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            likes?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/like',
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
     * 审核片单（通过/驳回）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerReview(
        requestBody: ReviewDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/review',
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
    public static playlistsControllerAdminList(
        requestBody: AdminListPlaylistsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/admin/list-playlists',
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
