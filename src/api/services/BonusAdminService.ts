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
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BonusAdminService {
    /**
     * 管理员分页查询余额
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerAdminListBalances(
        requestBody: AdminListBalancesDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/list-balances',
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
    public static bonusControllerAdminListLedger(
        requestBody: AdminListLedgerDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/list-ledger',
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
    public static bonusControllerAdminAdjust(
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
    public static bonusControllerAdminReverse(
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
    public static bonusControllerAdminBatchAdjust(
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
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerAdminGetRules(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bonus/admin/get-rules',
        });
    }
    /**
     * 更新积分规则/开关
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerAdminConfigRules(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/config-rules',
        });
    }
    /**
     * 导出流水为 CSV
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerExportLedger(
        requestBody: AdminListLedgerDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/export-ledger',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 管理员调整记录列表
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerListAdjustments(
        requestBody: AdminListLedgerDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/adjustments/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 冻结账户（禁止负向变动）
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static bonusControllerFreezeAccount(
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
    public static bonusControllerUnfreezeAccount(
        requestBody: AdminUnfreezeDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bonus/admin/unfreeze-account',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
