/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplyPunishmentDto } from '../models/ApplyPunishmentDto';
import type { ListPunishmentRecordsDto } from '../models/ListPunishmentRecordsDto';
import type { QueryUserPunishmentsDto } from '../models/QueryUserPunishmentsDto';
import type { RevokePunishmentDto } from '../models/RevokePunishmentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PunishmentsService {
    /**
     * 对用户施加处罚（统一入口）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentsControllerApplyPunishment(
        requestBody: ApplyPunishmentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ApplyPunishmentDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishments/apply-punishment',
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
     * 撤销登录封禁并归档到历史
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentsControllerRevoke(
        requestBody: RevokePunishmentDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        /**
         * 返回撤销后归档到历史表的记录
         */
        data?: any;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishments/revoke-punishment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `撤销原因未在字典中启用；或该记录已撤销`,
            },
        });
    }
    /**
     * 查询用户生效中的处罚记录
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentsControllerListUserActive(
        requestBody: QueryUserPunishmentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        /**
         * 返回生效中的处罚记录（未撤销且未过期）
         */
        data?: Array<{
            id?: string;
            userId?: string;
            type?: string;
            typeLabel?: string;
            reason?: string;
            reasonLabel?: string;
            detailReason?: string | null;
            durationDays?: number;
            startsAt?: string;
            expiresAt?: string;
            handlerId?: string;
            handlerUsername?: string | null;
            revoked?: boolean;
            revokeReason?: string | null;
            revokeReasonLabel?: string | null;
            revokeDetailReason?: string | null;
            createdAt?: string;
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishments/list-active-by-user',
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
     * 查询用户所有处罚记录（含历史）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentsControllerListUserAll(
        requestBody: QueryUserPunishmentsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        /**
         * 返回当前生效与历史归档的处罚记录
         */
        data?: any;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishments/list-all-by-user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 所有处罚记录高级查询（当前 + 历史）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static punishmentsControllerRecordsList(
        requestBody: ListPunishmentRecordsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        /**
         * 返回分页后的所有处罚记录
         */
        data?: {
            items?: Array<{
                id?: string;
                userId?: string;
                userUsername?: string | null;
                type?: string;
                typeLabel?: string;
                reason?: string;
                reasonLabel?: string;
                detailReason?: string | null;
                durationDays?: number;
                startsAt?: string;
                expiresAt?: string;
                handlerId?: string;
                handlerUsername?: string | null;
                revoked?: boolean;
                revokeReason?: string | null;
                revokeReasonLabel?: string | null;
                revokeDetailReason?: string | null;
                createdAt?: string;
                recordSource?: 'active' | 'history';
            }>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishments/list',
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
