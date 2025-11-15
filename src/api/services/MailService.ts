/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SendReportDto } from '../models/SendReportDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MailService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static mailControllerSend(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mail/send',
        });
    }
    /**
     * 验证 SMTP 连接是否可用（简要）
     * @returns any 成功
     * @throws ApiError
     */
    public static mailControllerVerify(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mail/verify',
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
     * 查看当前 SMTP transporter 关键配置快照
     * @returns any 成功
     * @throws ApiError
     */
    public static mailControllerConfig(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mail/config',
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
     * 验证 SMTP 连接（详细），返回失败错误信息
     * @returns any 成功
     * @throws ApiError
     */
    public static mailControllerVerifyReport(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            ok?: boolean;
            error?: {
                name?: string;
                code?: string;
                message?: string;
            } | null;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mail/verify/report',
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
     * 诊断性发送邮件，返回原始 SMTP 结果
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static mailControllerSendReport(
        requestBody: SendReportDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mail/send/report',
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
