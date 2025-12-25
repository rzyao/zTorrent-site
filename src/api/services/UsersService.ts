/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BanRecordDto } from '../models/BanRecordDto';
import type { DeleteUserResponseDto } from '../models/DeleteUserResponseDto';
import type { ListBanRecordsDto } from '../models/ListBanRecordsDto';
import type { ListUsersDto } from '../models/ListUsersDto';
import type { ListUsersResponseDto } from '../models/ListUsersResponseDto';
import type { SetUserAvatarDto } from '../models/SetUserAvatarDto';
import type { UpdateUserBodyDto } from '../models/UpdateUserBodyDto';
import type { UpdateUserNotificationsDto } from '../models/UpdateUserNotificationsDto';
import type { UpdateUserPreferencesDto } from '../models/UpdateUserPreferencesDto';
import type { UpdateUserPrivacyDto } from '../models/UpdateUserPrivacyDto';
import type { UpdateUserProfileDto } from '../models/UpdateUserProfileDto';
import type { UserCategoriesGroupedDto } from '../models/UserCategoriesGroupedDto';
import type { UserDto } from '../models/UserDto';
import type { UserIdDto } from '../models/UserIdDto';
import type { UserNotificationsDto } from '../models/UserNotificationsDto';
import type { UserPreferencesDto } from '../models/UserPreferencesDto';
import type { UserPrivacyDto } from '../models/UserPrivacyDto';
import type { UserProfileDataDto } from '../models/UserProfileDataDto';
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
            url: '/users/list',
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
     * 更新个人资料
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static usersProfileControllerUpdate(
        requestBody: UpdateUserProfileDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserProfileDataDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/profile/update',
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
     * 设置头像
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static usersProfileControllerSetAvatar(
        requestBody: SetUserAvatarDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserProfileDataDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/profile/set-avatar',
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
            url: '/users/preferences/detail',
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
            url: '/users/preferences/update',
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
     * @returns any 获取用户分类显示状态（按类型分组）
     * @throws ApiError
     */
    public static usersPreferencesControllerListCategories(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserCategoriesGroupedDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/preferences/categories/list',
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
     * @returns any 获取当前用户通知设置
     * @throws ApiError
     */
    public static usersNotificationsControllerGet(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserNotificationsDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/notifications/detail',
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
     * @returns any 增量保存当前用户通知设置
     * @throws ApiError
     */
    public static usersNotificationsControllerSave(
        requestBody: UpdateUserNotificationsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserNotificationsDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/notifications/update',
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
     * 获取隐私设置
     * @returns any 成功
     * @throws ApiError
     */
    public static usersPrivacyControllerGet(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserPrivacyDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/privacy/detail',
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
     * 增量保存隐私设置
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static usersPrivacyControllerSave(
        requestBody: UpdateUserPrivacyDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: UserPrivacyDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/privacy/update',
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
