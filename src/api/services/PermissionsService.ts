/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignPermissionsDto } from '../models/AssignPermissionsDto';
import type { CreatePermissionDto } from '../models/CreatePermissionDto';
import type { ListPermissionsDto } from '../models/ListPermissionsDto';
import type { PermissionDto } from '../models/PermissionDto';
import type { PermissionIdDto } from '../models/PermissionIdDto';
import type { UpdatePermissionDto } from '../models/UpdatePermissionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PermissionsService {
    /**
     * 创建权限
     * @param requestBody
     * @returns any 已创建
     * @throws ApiError
     */
    public static permissionsControllerCreate(
        requestBody: CreatePermissionDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PermissionDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/create',
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
     * 权限列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerList(
        requestBody: ListPermissionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<PermissionDto>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/list',
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
     * 权限详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerDetail(
        requestBody: PermissionIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PermissionDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/detail',
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
     * 更新权限
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerUpdate(
        requestBody: {
            id?: string;
            data?: UpdatePermissionDto;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: PermissionDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/update',
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
     * 删除权限
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerRemove(
        requestBody: PermissionIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            success?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/delete',
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
     * 为用户分配权限（覆盖式）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerAssign(
        requestBody: AssignPermissionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/assign',
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
