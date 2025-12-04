/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BanRecordDto } from '../models/BanRecordDto';
import type { CategoryDto } from '../models/CategoryDto';
import type { DeleteUserResponseDto } from '../models/DeleteUserResponseDto';
import type { GetDefaultFilmCategoryIdsDto } from '../models/GetDefaultFilmCategoryIdsDto';
import type { GetDefaultTorrentCategoryKeysDto } from '../models/GetDefaultTorrentCategoryKeysDto';
import type { ListBanRecordsDto } from '../models/ListBanRecordsDto';
import type { ListUsersDto } from '../models/ListUsersDto';
import type { ListUsersResponseDto } from '../models/ListUsersResponseDto';
import type { UpdateUserBodyDto } from '../models/UpdateUserBodyDto';
import type { UpdateUserPreferencesDto } from '../models/UpdateUserPreferencesDto';
import type { UserDto } from '../models/UserDto';
import type { UserIdDto } from '../models/UserIdDto';
import type { UserPreferencesDto } from '../models/UserPreferencesDto';
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
    public static usersControllerListUsers(
        requestBody: ListUsersDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ListUsersResponseDto;
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
     * @returns any 成功
     * @throws ApiError
     */
    public static usersControllerRemove(
        requestBody: UserIdDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: DeleteUserResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/delete',
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
     * 查询封禁/解封记录列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static usersControllerBanRecords(
        requestBody: ListBanRecordsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<BanRecordDto>;
        path?: string;
        timestamp?: string;
    }> {
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
    /**
     * @returns any 获取当前用户偏好
     * @throws ApiError
     */
    public static usersPreferencesControllerGet(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserPreferencesDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/preferences/get',
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
     * @returns any 增量保存当前用户偏好
     * @throws ApiError
     */
    public static usersPreferencesControllerSave(
        requestBody: UpdateUserPreferencesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserPreferencesDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/preferences/save',
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
     * @returns any 获取根级 General/torrent 分类集合
     * @throws ApiError
     */
    public static usersPreferencesControllerListGeneralTorrentRootCategories(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<CategoryDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/preferences/list-general-torrent-root-categories',
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
     * @returns any 获取根级 General/film 分类集合
     * @throws ApiError
     */
    public static usersPreferencesControllerListGeneralFilmRootCategories(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<CategoryDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/preferences/list-general-film-root-categories',
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
     * @returns any 获取用户默认分类键集合
     * @throws ApiError
     */
    public static usersPreferencesControllerGetDefaultTorrentCategoryKeys(
        requestBody: GetDefaultTorrentCategoryKeysDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/preferences/get-default-torrent-category-keys',
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
     * @returns any 获取用户默认影片类型ID集合
     * @throws ApiError
     */
    public static usersPreferencesControllerGetDefaultFilmCategoryIds(
        requestBody: GetDefaultFilmCategoryIdsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<string>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/preferences/get-default-film-category-ids',
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
