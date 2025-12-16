/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddFilmToPlaylistDto } from '../models/AddFilmToPlaylistDto';
import type { AdminListPlaylistsDto } from '../models/AdminListPlaylistsDto';
import type { AdminListPlaylistsResponseDto } from '../models/AdminListPlaylistsResponseDto';
import type { CategoriesListResponseDto } from '../models/CategoriesListResponseDto';
import type { CreatePlaylistDto } from '../models/CreatePlaylistDto';
import type { DeletePlaylistDto } from '../models/DeletePlaylistDto';
import type { DeletePlaylistResponseDto } from '../models/DeletePlaylistResponseDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { GetPlaylistDto } from '../models/GetPlaylistDto';
import type { IncrementViewsDto } from '../models/IncrementViewsDto';
import type { IncrementViewsResponseDto } from '../models/IncrementViewsResponseDto';
import type { LikePlaylistDto } from '../models/LikePlaylistDto';
import type { LikePlaylistResponseDto } from '../models/LikePlaylistResponseDto';
import type { ListPlaylistsDto } from '../models/ListPlaylistsDto';
import type { ListPlaylistsResponseDto } from '../models/ListPlaylistsResponseDto';
import type { PlaylistDTO } from '../models/PlaylistDTO';
import type { RemoveFilmFromPlaylistDto } from '../models/RemoveFilmFromPlaylistDto';
import type { ReorderFilmsInPlaylistDto } from '../models/ReorderFilmsInPlaylistDto';
import type { ReorderFilmsInPlaylistResponseDto } from '../models/ReorderFilmsInPlaylistResponseDto';
import type { ReviewDto } from '../models/ReviewDto';
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
    public static playlistsControllerCreate(
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
        requestBody: AddFilmToPlaylistDto,
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
        requestBody: RemoveFilmFromPlaylistDto,
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
        requestBody: ReorderFilmsInPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ReorderFilmsInPlaylistResponseDto;
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
        requestBody: IncrementViewsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: IncrementViewsResponseDto;
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
        requestBody: LikePlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: LikePlaylistResponseDto;
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
        data?: EmptyObjectDto;
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
        data?: AdminListPlaylistsResponseDto;
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
    /**
     * 获取片单分类列表
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerListCategories(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: CategoriesListResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/list-categories',
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
