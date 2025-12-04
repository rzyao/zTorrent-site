/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActionResultDto } from '../models/ActionResultDto';
import type { AddFilmTorrentDto } from '../models/AddFilmTorrentDto';
import type { AdminListFilmsDto } from '../models/AdminListFilmsDto';
import type { AdminListFilmsResponseDto } from '../models/AdminListFilmsResponseDto';
import type { AdminListPendingFilmsDto } from '../models/AdminListPendingFilmsDto';
import type { CollectFilmDto } from '../models/CollectFilmDto';
import type { CreateFilmDto } from '../models/CreateFilmDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { FilmIdDto } from '../models/FilmIdDto';
import type { FilmTorrentIdDto } from '../models/FilmTorrentIdDto';
import type { GenresDto } from '../models/GenresDto';
import type { ListFilmsDto } from '../models/ListFilmsDto';
import type { ListFilmsResponseDto } from '../models/ListFilmsResponseDto';
import type { ListFilmTorrentsDto } from '../models/ListFilmTorrentsDto';
import type { ListFilmTorrentsResponseDto } from '../models/ListFilmTorrentsResponseDto';
import type { PublicFilmDetailDto } from '../models/PublicFilmDetailDto';
import type { RemoveFilmTorrentDto } from '../models/RemoveFilmTorrentDto';
import type { ReviewDto } from '../models/ReviewDto';
import type { SearchFilmsForPlaylistDto } from '../models/SearchFilmsForPlaylistDto';
import type { SearchFilmsPlaylistResponseDto } from '../models/SearchFilmsPlaylistResponseDto';
import type { SuccessDto } from '../models/SuccessDto';
import type { UpdateFilmTorrentWrapperDto } from '../models/UpdateFilmTorrentWrapperDto';
import type { UpdateFilmWrapperDto } from '../models/UpdateFilmWrapperDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FilmsService {
    /**
     * 创建影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerCreate(
        requestBody: CreateFilmDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/create-film',
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
     * 更新影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerUpdate(
        requestBody: UpdateFilmWrapperDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/update-film',
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
     * 删除影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerDelete(
        requestBody: FilmIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SuccessDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/delete-film',
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
     * 获取影片详情（浏览）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerGetMovieDetail(
        requestBody: FilmIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PublicFilmDetailDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/get-film',
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
     * 添加影片种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerAddTorrent(
        requestBody: AddFilmTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/film-add-torrent',
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
     * 更新影片种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerUpdateTorrent(
        requestBody: UpdateFilmTorrentWrapperDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/update-film-torrent',
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
     * 删除影片种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerDeleteTorrent(
        requestBody: FilmTorrentIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SuccessDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/delete-film-torrent',
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
     * 移除影片与种子的关联
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerRemoveTorrent(
        requestBody: RemoveFilmTorrentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SuccessDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/film-remove-torrent',
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
     * 审核影片（通过/驳回）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerReview(
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
            url: '/films/review',
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
     * 管理员列出待审核影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerAdminListPending(
        requestBody: AdminListPendingFilmsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: AdminListFilmsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/admin/list-pending',
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
     * 管理员通用影片列表（支持审批状态筛选）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerAdminList(
        requestBody: AdminListFilmsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: AdminListFilmsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/admin/list',
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
     * 列表影片种子
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerListTorrents(
        requestBody: ListFilmTorrentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListFilmTorrentsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/list-film-torrents',
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
     * 列出影片列表（聚合接口）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerListFilms(
        requestBody: ListFilmsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListFilmsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/list-films',
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
     * 片单添加用的影片搜索（排除已关联）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerSearchFilmsForPlaylist(
        requestBody: SearchFilmsForPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SearchFilmsPlaylistResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/search-for-playlist',
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
     * 收藏/取消收藏影片
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerCollectMovie(
        requestBody: CollectFilmDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ActionResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/collect-film',
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
     * 获取所有类型列表
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerListGenres(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: GenresDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/list-genres',
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
     * 增加影片浏览次数
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static filmsControllerViewMovie(
        requestBody: FilmIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SuccessDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/films/view-film',
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
