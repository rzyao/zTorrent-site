/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplyPunishmentDto } from '../models/ApplyPunishmentDto';
import type { ListPunishmentRecordsDto } from '../models/ListPunishmentRecordsDto';
import type { ListPunishmentRecordsResponseDto } from '../models/ListPunishmentRecordsResponseDto';
import type { QueryUserActivePunishmentsResponseDto } from '../models/QueryUserActivePunishmentsResponseDto';
import type { QueryUserAllPunishmentsResponseDto } from '../models/QueryUserAllPunishmentsResponseDto';
import type { QueryUserPunishmentsDto } from '../models/QueryUserPunishmentsDto';
import type { RevokePunishmentDto } from '../models/RevokePunishmentDto';
import type { RevokePunishmentResponseDto } from '../models/RevokePunishmentResponseDto';
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
        data?: RevokePunishmentResponseDto;
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
        data?: QueryUserActivePunishmentsResponseDto;
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
        data?: QueryUserAllPunishmentsResponseDto;
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
    public static punishmentsControllerListPunishmentRecords(
        requestBody: ListPunishmentRecordsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListPunishmentRecordsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/punishments/list-records',
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
