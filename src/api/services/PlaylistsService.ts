/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddItemToPlaylistDto } from '../models/AddItemToPlaylistDto';
import type { AdminListPlaylistsDto } from '../models/AdminListPlaylistsDto';
import type { AdminListPlaylistsResponseDto } from '../models/AdminListPlaylistsResponseDto';
import type { CategoriesListResponseDto } from '../models/CategoriesListResponseDto';
import type { CreatePlaylistDto } from '../models/CreatePlaylistDto';
import type { DeletePlaylistDto } from '../models/DeletePlaylistDto';
import type { DeletePlaylistResponseDto } from '../models/DeletePlaylistResponseDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { FollowDto } from '../models/FollowDto';
import type { FollowResponseDto } from '../models/FollowResponseDto';
import type { GetPlaylistDto } from '../models/GetPlaylistDto';
import type { IncrementViewsDto } from '../models/IncrementViewsDto';
import type { IncrementViewsResponseDto } from '../models/IncrementViewsResponseDto';
import type { IsFollowingDto } from '../models/IsFollowingDto';
import type { IsFollowingResponseDto } from '../models/IsFollowingResponseDto';
import type { IsSubscribedDto } from '../models/IsSubscribedDto';
import type { IsSubscribedResponseDto } from '../models/IsSubscribedResponseDto';
import type { LikePlaylistDto } from '../models/LikePlaylistDto';
import type { LikePlaylistResponseDto } from '../models/LikePlaylistResponseDto';
import type { ListPlaylistItemsDto } from '../models/ListPlaylistItemsDto';
import type { ListPlaylistItemsResponseDto } from '../models/ListPlaylistItemsResponseDto';
import type { ListPlaylistsDto } from '../models/ListPlaylistsDto';
import type { ListPlaylistsResponseDto } from '../models/ListPlaylistsResponseDto';
import type { Object } from '../models/Object';
import type { PlaylistDTO } from '../models/PlaylistDTO';
import type { RemoveItemFromPlaylistDto } from '../models/RemoveItemFromPlaylistDto';
import type { ReorderItemsInPlaylistDto } from '../models/ReorderItemsInPlaylistDto';
import type { ReviewDto } from '../models/ReviewDto';
import type { SearchAddableItemsDto } from '../models/SearchAddableItemsDto';
import type { SearchAddableItemsResponseDto } from '../models/SearchAddableItemsResponseDto';
import type { SubscribeDto } from '../models/SubscribeDto';
import type { SubscribeResponseDto } from '../models/SubscribeResponseDto';
import type { UpdatePlaylistDto } from '../models/UpdatePlaylistDto';
import type { UpdateSubscriptionNotifyDto } from '../models/UpdateSubscriptionNotifyDto';
import type { UpdateSubscriptionNotifyResponseDto } from '../models/UpdateSubscriptionNotifyResponseDto';
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
     * 添加内容到片单（支持电影和剧集）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerAddItem(
        requestBody: AddItemToPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
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
    public static playlistsControllerRemoveItem(
        requestBody: RemoveItemFromPlaylistDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PlaylistDTO;
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
    public static playlistsControllerReorderItems(
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
    public static playlistsControllerListItems(
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
    public static playlistsControllerSearchAddableItems(
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
    public static playlistsControllerListCategories(): CancelablePromise<{
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
     * 关注/取消关注片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerFollow(
        requestBody: FollowDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: FollowResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/follow',
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
     * 检查是否已关注片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerIsFollowing(
        requestBody: IsFollowingDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: IsFollowingResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/is-following',
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
     * 订阅/取消订阅片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerSubscribe(
        requestBody: SubscribeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SubscribeResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/subscribe',
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
     * 检查是否已订阅片单
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerIsSubscribed(
        requestBody: IsSubscribedDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: IsSubscribedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/is-subscribed',
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
     * 更新订阅通知设置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static playlistsControllerUpdateSubscriptionNotify(
        requestBody: UpdateSubscriptionNotifyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UpdateSubscriptionNotifyResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists/update-subscription-notify',
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
