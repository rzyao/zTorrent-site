/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateLevelDto } from '../models/CreateLevelDto';
import type { CreateLevelResponseDto } from '../models/CreateLevelResponseDto';
import type { EmptyObjectDto } from '../models/EmptyObjectDto';
import type { LevelIdDto } from '../models/LevelIdDto';
import type { LevelPermissionDto } from '../models/LevelPermissionDto';
import type { ListLevelPermissionsRequestDto } from '../models/ListLevelPermissionsRequestDto';
import type { ListLevelsRequestDto } from '../models/ListLevelsRequestDto';
import type { ListLevelsResponseDto } from '../models/ListLevelsResponseDto';
import type { SetLevelPermissionsRequestDto } from '../models/SetLevelPermissionsRequestDto';
import type { SuccessDto } from '../models/SuccessDto';
import type { UpdateLevelRequestDto } from '../models/UpdateLevelRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LevelsService {
    /**
     * 创建等级
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static levelsControllerCreate(
        requestBody: CreateLevelDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: CreateLevelResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/levels/create',
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
     * 分页查询等级列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static levelsControllerList(
        requestBody: ListLevelsRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListLevelsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/levels/list-levels',
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
     * 等级详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static levelsControllerDetail(
        requestBody: LevelIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/levels/detail',
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
     * 更新等级
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static levelsControllerUpdate(
        requestBody: UpdateLevelRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: EmptyObjectDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/levels/update',
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
     * 删除等级
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static levelsControllerRemove(
        requestBody: LevelIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SuccessDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/levels/delete',
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
     * 设置等级的权限（覆盖式）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static levelsControllerSetPermissions(
        requestBody: SetLevelPermissionsRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SuccessDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/levels/permissions',
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
     * 查询等级的权限列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static levelsControllerListPermissions(
        requestBody: ListLevelPermissionsRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<LevelPermissionDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/levels/list-permissions',
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
