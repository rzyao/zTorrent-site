/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListBanRecordsDto } from '../models/ListBanRecordsDto';
import type { ListUsersDto } from '../models/ListUsersDto';
import type { UpdateUserBodyDto } from '../models/UpdateUserBodyDto';
import type { UserDto } from '../models/UserDto';
import type { UserIdDto } from '../models/UserIdDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * 用户列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static usersControllerList(
        requestBody: ListUsersDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<UserDto>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/list-users',
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
     * 用户详情
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static usersControllerDetail(
        requestBody: UserIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/detail',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数错误`,
                401: `未授权或令牌无效`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 更新用户信息
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static usersControllerUpdate(
        requestBody: UpdateUserBodyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/update',
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
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static usersControllerRemove(
        requestBody: UserIdDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询封禁/解封记录列表
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static usersControllerBanRecords(
        requestBody: ListBanRecordsDto,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/ban-records',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `未授权或令牌无效`,
                403: `无权限或被封禁`,
            },
        });
    }
}
