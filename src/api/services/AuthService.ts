/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordDto } from '../models/ChangePasswordDto';
import type { InviteStatusDto } from '../models/InviteStatusDto';
import type { LoginDto } from '../models/LoginDto';
import type { LoginResultDto } from '../models/LoginResultDto';
import type { RegisterDto } from '../models/RegisterDto';
import type { RegisterResultDto } from '../models/RegisterResultDto';
import type { RegistrationStatusDto } from '../models/RegistrationStatusDto';
import type { RequestEmailCodeDto } from '../models/RequestEmailCodeDto';
import type { RequestPasswordResetDto } from '../models/RequestPasswordResetDto';
import type { ResetOkDto } from '../models/ResetOkDto';
import type { ResetPasswordDto } from '../models/ResetPasswordDto';
import type { SentDto } from '../models/SentDto';
import type { VerifyEmailCodeDto } from '../models/VerifyEmailCodeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * 用户登录
     * 使用用户名和密码登录，返回访问令牌
     * @param requestBody
     * @returns any 登录成功
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: LoginResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
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
     * 用户注册并登录
     * 注册新用户（校验重复），成功后返回访问令牌
     * @param requestBody
     * @returns any 注册成功并返回令牌
     * @throws ApiError
     */
    public static authControllerRegister(
        requestBody: RegisterDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RegisterResultDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `用户名或邮箱已存在`,
            },
        });
    }
    /**
     * 请求注册邮箱验证码
     * 向指定邮箱发送一次性6位验证码（有效期由系统设置决定）。统一返回不暴露邮箱是否存在。
     * @param requestBody
     * @returns any 验证码已发送（或已受限）
     * @throws ApiError
     */
    public static authControllerRequestEmailCode(
        requestBody: RequestEmailCodeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SentDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/request-email-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 验证注册邮箱验证码
     * 校验邮箱与验证码是否匹配且在系统设置的有效期内，通过后允许后续注册提交
     * @param requestBody
     * @returns any 验证通过
     * @throws ApiError
     */
    public static authControllerVerifyRegisterEmailCode(
        requestBody: VerifyEmailCodeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SentDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-register-email-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询是否开放注册
     * @returns any 返回是否开放注册
     * @throws ApiError
     */
    public static authControllerRegistrationEnabled(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RegistrationStatusDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/registration-enabled',
        });
    }
    /**
     * 查询邀请码是否有效
     * @param requestBody
     * @returns any 返回邀请码是否有效
     * @throws ApiError
     */
    public static authControllerVerifyInviteCode(
        requestBody: {
            email: string;
            inviteCode: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            valid?: boolean;
            type?: string | null;
            expiresAt?: string | null;
            status?: string;
            reason?: string | null;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-invite-code',
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
     * 查询是否允许邀请注册
     * @returns any 返回是否允许邀请注册
     * @throws ApiError
     */
    public static authControllerInviteEnabled(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: InviteStatusDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/invite-enabled',
        });
    }
    /**
     * 请求找回密码邮件
     * 向邮箱发送重置密码链接，令牌30分钟有效。统一返回不暴露邮箱是否存在。
     * @param requestBody
     * @returns any 重置邮件已发送（或已受限）
     * @throws ApiError
     */
    public static authControllerRequestPasswordReset(
        requestBody: RequestPasswordResetDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: SentDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/request-password-reset',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 执行密码重置
     * 使用邮箱链接中的 token 设置新密码
     * @param requestBody
     * @returns any 重置成功
     * @throws ApiError
     */
    public static authControllerResetPassword(
        requestBody: ResetPasswordDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ResetOkDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 修改密码
     * 已登录用户提供当前密码与新密码，成功后立即生效
     * @param requestBody
     * @returns any 修改成功
     * @throws ApiError
     */
    public static authControllerChangePassword(
        requestBody: ChangePasswordDto,
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
            url: '/auth/change-password',
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
     * 当前用户信息
     * 返回 JWT 用户的基本信息、角色与权限集合
     * @returns any 查询成功
     * @throws ApiError
     */
    public static authControllerProfile(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            user?: Record<string, any>;
            roles?: Array<string>;
            permissions?: Array<string>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/profile',
        });
    }
    /**
     * 当前用户信息（POST）
     * 返回 JWT 用户的基本信息、角色与权限集合
     * @returns any 查询成功
     * @throws ApiError
     */
    public static authControllerProfilePost(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            user?: Record<string, any>;
            roles?: Array<string>;
            permissions?: Array<string>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/profile',
        });
    }
}
