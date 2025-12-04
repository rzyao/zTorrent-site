/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignRolesDto } from '../models/AssignRolesDto';
import type { AssignRolesResponseDto } from '../models/AssignRolesResponseDto';
import type { CreateRoleDto } from '../models/CreateRoleDto';
import type { DeleteRoleResponseDto } from '../models/DeleteRoleResponseDto';
import type { ListRolesDto } from '../models/ListRolesDto';
import type { ListRolesResponseDto } from '../models/ListRolesResponseDto';
import type { PermissionDto } from '../models/PermissionDto';
import type { RoleDto } from '../models/RoleDto';
import type { RoleIdDto } from '../models/RoleIdDto';
import type { SetRolePermissionsDto } from '../models/SetRolePermissionsDto';
import type { SetRolePermissionsResponseDto } from '../models/SetRolePermissionsResponseDto';
import type { UpdateRoleRequestDto } from '../models/UpdateRoleRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RolesService {
    /**
     * 创建角色
     * @param requestBody
     * @returns any 创建成功
     * @throws ApiError
     */
    public static rolesControllerCreate(
        requestBody: CreateRoleDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RoleDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/create',
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
     * 列出角色列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rolesControllerListRoles(
        requestBody: ListRolesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListRolesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/list-roles',
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
     * 角色详情
     * @param requestBody
     * @returns any 查询成功
     * @throws ApiError
     */
    public static rolesControllerDetail(
        requestBody: RoleIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RoleDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/detail',
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
     * 更新角色
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static rolesControllerUpdate(
        requestBody: UpdateRoleRequestDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RoleDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/update',
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
     * 删除角色
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rolesControllerRemove(
        requestBody: RoleIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: DeleteRoleResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/delete',
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
     * 设置角色权限（覆盖式）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rolesControllerSetRolePermissions(
        requestBody: SetRolePermissionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SetRolePermissionsResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/permissions',
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
     * 为用户分配角色（覆盖式）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rolesControllerAssignRoles(
        requestBody: AssignRolesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: AssignRolesResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/assign',
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
     * 查询指定角色的权限（按ID）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static rolesControllerRolePermissions(
        requestBody: RoleIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<PermissionDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/role-permissions',
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
