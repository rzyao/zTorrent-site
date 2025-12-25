/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminAdjustDto } from '../models/AdminAdjustDto';
import type { AdminBatchAdjustDto } from '../models/AdminBatchAdjustDto';
import type { AdminFreezeDto } from '../models/AdminFreezeDto';
import type { AdminListBalancesDto } from '../models/AdminListBalancesDto';
import type { AdminListLedgerDto } from '../models/AdminListLedgerDto';
import type { AdminReverseDto } from '../models/AdminReverseDto';
import type { AdminUnfreezeDto } from '../models/AdminUnfreezeDto';
import type { ApplyBonusRuleDto } from '../models/ApplyBonusRuleDto';
import type { BonusConfigDto } from '../models/BonusConfigDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { QueryMyLedgerDto } from '../models/QueryMyLedgerDto';
import type { SimulationRequestDto } from '../models/SimulationRequestDto';
import type { SimulationResultDto } from '../models/SimulationResultDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BonusService {
    /**
     * 按规则计算并发放积分（管理员/系统）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusAccountControllerApply(
        requestBody: ApplyBonusRuleDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/apply',
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
     * 积分概览
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusAccountControllerOverview(
        requestBody: EmptyObjectDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/overview',
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
     * 查询积分余额（POST）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusAccountControllerBalancePost(
        requestBody: EmptyObjectDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/balance',
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
     * 查询积分流水（POST）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusAccountControllerLedgerPost(
        requestBody: QueryMyLedgerDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/ledger',
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
     * 管理员分页查询余额
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerAdminListBalances(
        requestBody: AdminListBalancesDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/balances/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 管理员分页查询流水
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerAdminListLedger(
        requestBody: AdminListLedgerDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/ledger/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 管理员手工调账
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerAdminAdjust(
        requestBody: AdminAdjustDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/adjust',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 管理员冲正指定流水
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerAdminReverse(
        requestBody: AdminReverseDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/reverse',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 管理员批量调账
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerAdminBatchAdjust(
        requestBody: AdminBatchAdjustDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/batch-adjust',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 读取积分规则/开关
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusAccountControllerAdminGetRules(
        requestBody: EmptyObjectDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/rules/get',
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
     * 更新积分规则/开关
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerAdminConfigRules(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/rules/update',
        });
    }
    /**
     * 冻结账户（禁止负向变动）
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerFreezeAccount(
        requestBody: AdminFreezeDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/freeze-account',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 解冻账户
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusAccountControllerUnfreezeAccount(
        requestBody: AdminUnfreezeDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/unfreeze-account',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 读取平台 Bonus 配置（POST）
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusConfigControllerRead(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: BonusConfigDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bonus/config/read',
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
     * 更新并激活平台 Bonus 配置（POST）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusConfigControllerUpdate(
        requestBody: BonusConfigDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: BonusConfigDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bonus/config/update',
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
     * 场景模拟计算（POST）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static bonusSimulatorControllerSimulate(
        requestBody: SimulationRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SimulationResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bonus/simulate',
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
