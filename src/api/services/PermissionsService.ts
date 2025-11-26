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
     * 列出权限列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerListPermissions(
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
            url: '/permissions/list-permissions',
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
     * 列出全部权限（前端自行构建树）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerListPermissionsTree(
        requestBody: ListPermissionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<PermissionDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/list-permissions-tree',
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
    /**
     * 查询权限树
     * 按可选 scope/type 筛选并返回权限树结构
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerTree(
        requestBody: {
            scope?: 'web' | 'admin' | null;
            type?: 'api' | 'page' | 'button' | null;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<{
            key?: string;
            name?: string;
            type?: string;
            scope?: string;
            children?: any[];
        }>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/tree',
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
     * 查询当前用户拥有的权限树
     * 根据 JWT 用户的权限集过滤后返回权限树
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerTreeOfUser(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<Record<string, any>>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/tree-of-user',
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
     * 批量校验用户是否拥有指定权限键
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static permissionsControllerCheck(
        requestBody: {
            keys: Array<string>;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            owned?: Array<string>;
            missing?: Array<string>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/permissions/check',
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
