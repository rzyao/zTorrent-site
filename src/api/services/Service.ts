/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchFavoriteActionDto } from '../models/BatchFavoriteActionDto';
import type { ExportInvitesDto } from '../models/ExportInvitesDto';
import type { ExportInvitesResponseDto } from '../models/ExportInvitesResponseDto';
import type { FavoriteActionDto } from '../models/FavoriteActionDto';
import type { FavoriteListDto } from '../models/FavoriteListDto';
import type { GrantQuotaDto } from '../models/GrantQuotaDto';
import type { GrantQuotaResponseDto } from '../models/GrantQuotaResponseDto';
import type { ListFavoritesResponseDto } from '../models/ListFavoritesResponseDto';
import type { ListInviteCodesDto } from '../models/ListInviteCodesDto';
import type { ListInviteCodesResponseDto } from '../models/ListInviteCodesResponseDto';
import type { ListInviteQuotaDto } from '../models/ListInviteQuotaDto';
import type { ListInviteQuotaResponseDto } from '../models/ListInviteQuotaResponseDto';
import type { ListInviteRecordsDto } from '../models/ListInviteRecordsDto';
import type { ListInviteRecordsResponseDto } from '../models/ListInviteRecordsResponseDto';
import type { ListInvitesDto } from '../models/ListInvitesDto';
import type { ListInvitesResponseDto } from '../models/ListInvitesResponseDto';
import type { ListMyInvitedUsersDto } from '../models/ListMyInvitedUsersDto';
import type { ListMyInvitedUsersResponseDto } from '../models/ListMyInvitedUsersResponseDto';
import type { ListSubscriptionsDto } from '../models/ListSubscriptionsDto';
import type { Object } from '../models/Object';
import type { OverviewInvitesDto } from '../models/OverviewInvitesDto';
import type { OverviewInvitesResponseDto } from '../models/OverviewInvitesResponseDto';
import type { ResendInviteDto } from '../models/ResendInviteDto';
import type { ResendInviteResponseDto } from '../models/ResendInviteResponseDto';
import type { RevokeInviteDto } from '../models/RevokeInviteDto';
import type { RevokeInviteResponseDto } from '../models/RevokeInviteResponseDto';
import type { RewardRulesResponseDto } from '../models/RewardRulesResponseDto';
import type { SendInviteDto } from '../models/SendInviteDto';
import type { SendOfficialInviteResponseDto } from '../models/SendOfficialInviteResponseDto';
import type { SendPrivateInviteResponseDto } from '../models/SendPrivateInviteResponseDto';
import type { StatisticsDto } from '../models/StatisticsDto';
import type { StatisticsResponseDto } from '../models/StatisticsResponseDto';
import type { SubscriptionActionDto } from '../models/SubscriptionActionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 发送私人邀请
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteCoreControllerSendPrivate(
        requestBody: SendInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SendPrivateInviteResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/core/send-private',
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
     * 发送官方邀请 (Admin)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteCoreControllerSendOfficial(
        requestBody: SendInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SendOfficialInviteResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/core/send-official',
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
     * 重新发送邀请邮件
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteCoreControllerResend(
        requestBody: ResendInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ResendInviteResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/core/resend',
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
     * 撤销邀请记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteCoreControllerRevoke(
        requestBody: RevokeInviteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RevokeInviteResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/core/revoke',
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
     * 获取邀请奖励规则说明
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteCoreControllerRewardRules(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RewardRulesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/core/reward-rules',
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
     * 分页查询所有邀请名额 (Admin)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteQuotaControllerListQuotas(
        requestBody: ListInviteQuotaDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListInviteQuotaResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/quota/list',
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
     * 查询我的邀请码列表 (包含名额与已发送记录)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteQuotaControllerListCodes(
        requestBody: ListInviteCodesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListInviteCodesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/quota/my-codes',
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
     * 发放邀请名额 (Admin)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteQuotaControllerGrantQuota(
        requestBody: GrantQuotaDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: GrantQuotaResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/quota/grant',
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
     * 分页查询所有邀请记录 (Admin)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteRecordControllerListInvites(
        requestBody: ListInvitesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListInvitesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/records/admin-list',
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
     * 查询邀请历史记录 (对齐前端展示)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteRecordControllerListRecords(
        requestBody: ListInviteRecordsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListInviteRecordsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/records/list',
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
     * 查询我邀请的用户列表 (我的后宫)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteRelationControllerMyUsers(
        requestBody: ListMyInvitedUsersDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListMyInvitedUsersResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/relations/my-invited-users',
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
     * 获取邀请概览数据 (统计卡片)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteStatsControllerOverview(
        requestBody: OverviewInvitesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: OverviewInvitesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/stats/overview',
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
     * 邀请趋势统计 (Admin)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteStatsControllerStatistics(
        requestBody: StatisticsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: StatisticsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/stats/statistics',
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
     * 导出邀请记录 (CSV)
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static inviteStatsControllerExport(
        requestBody: ExportInvitesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ExportInvitesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/stats/export',
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
     * 添加收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerAdd(
        requestBody: FavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/add',
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
     * 批量添加收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerBatchAdd(
        requestBody: BatchFavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/batch-add',
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
     * 取消收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerRemove(
        requestBody: FavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/remove',
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
     * 批量取消收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerBatchRemove(
        requestBody: BatchFavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/batch-remove',
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
     * 检查是否已收藏
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerCheck(
        requestBody: FavoriteActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/check',
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
     * @returns any 成功
     * @throws ApiError
     */
    public static favoritesControllerList(
        requestBody: FavoriteListDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListFavoritesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/favorites/list',
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
     * 添加订阅
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerAdd(
        requestBody: SubscriptionActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/add',
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
     * 取消订阅
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerRemove(
        requestBody: SubscriptionActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/remove',
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
     * 检查是否已订阅
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerCheck(
        requestBody: SubscriptionActionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/check',
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
     * 获取我的订阅列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static subscriptionsControllerList(
        requestBody: ListSubscriptionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions/list',
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
