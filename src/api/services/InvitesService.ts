/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExportInvitesDto } from '../models/ExportInvitesDto';
import type { ExportInvitesResponseDto } from '../models/ExportInvitesResponseDto';
import type { GrantQuotaDto } from '../models/GrantQuotaDto';
import type { GrantQuotaResponseDto } from '../models/GrantQuotaResponseDto';
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
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitesService {
    /**
     * 分页查询邀请记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerListInvites(
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
            url: '/invites/list',
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
     * 分页查询邀请名额
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerListQuotas(
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
     * 我的邀请码列表（真实邀请记录）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerListCodes(
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
            url: '/invites/codes/list',
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
     * 邀请记录列表（对齐前端枚举与字段）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerListRecords(
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
     * 我的后宫（被邀请用户列表）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerMyUsers(
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
            url: '/invites/my-users',
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
     * 邀请概览统计（顶部卡片）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerOverview(
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
            url: '/invites/overview',
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
     * 邀请返利规则（展示用）
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerRewardRules(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RewardRulesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invites/rewards/rules',
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
     * 撤销未使用的邀请
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerRevoke(
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
            url: '/invites/revoke',
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
     * 重发邀请邮件
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerResend(
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
            url: '/invites/resend',
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
     * 邀请记录统计聚合
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerStatistics(
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
            url: '/invites/statistics',
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
     * 导出邀请记录为CSV
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerExport(
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
            url: '/invites/export',
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
     * 发送私人邀请（消耗一个邀请名额）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerSendPrivate(
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
            url: '/invites/send-private',
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
     * 发送官方邀请（不消耗用户名额）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerSendOfficial(
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
            url: '/invites/send-official',
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
     * 授予用户邀请名额（永久/临时）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static invitesControllerGrantQuota(
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
}
