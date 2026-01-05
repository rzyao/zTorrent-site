/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReportDto } from '../models/CreateReportDto';
import type { ForumReport } from '../models/ForumReport';
import type { HandleReportDto } from '../models/HandleReportDto';
import type { Object } from '../models/Object';
import type { QueryReportDto } from '../models/QueryReportDto';
import type { ReportPaginatedResponseDto } from '../models/ReportPaginatedResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsReportsService {
    /**
     * 举报话题或回复
     * @param requestBody
     * @returns any 举报成功
     * @throws ApiError
     */
    public static reportsControllerCreate(
        requestBody: CreateReportDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumReport;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/reports/create',
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
     * 获取待处理举报列表 (管理员)
     * @param requestBody
     * @returns any 举报分页列表
     * @throws ApiError
     */
    public static reportsControllerFindPending(
        requestBody: QueryReportDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ReportPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/reports/admin/pending',
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
     * 处理举报 (管理员)
     * @param requestBody
     * @returns any 处理成功
     * @throws ApiError
     */
    public static reportsControllerHandle(
        requestBody: HandleReportDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumReport;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/reports/admin/handle',
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
     * 获取举报统计 (管理员)
     * @returns any 举报统计数据
     * @throws ApiError
     */
    public static reportsControllerGetStats(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/reports/admin/stats',
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
     * 获取所有举报列表 (管理员)
     * @param requestBody
     * @returns any 举报分页列表
     * @throws ApiError
     */
    public static reportsControllerFindAll(
        requestBody: QueryReportDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ReportPaginatedResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/reports/admin/list',
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
