/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumStatistic } from '../models/ForumStatistic';
import type { ForumTopic } from '../models/ForumTopic';
import type { HotTopicsDto } from '../models/HotTopicsDto';
import type { QueryStatisticsDto } from '../models/QueryStatisticsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsStatisticsService {
    /**
     * 获取今日论坛统计概览
     * @returns any 今日统计数据
     * @throws ApiError
     */
    public static statisticsControllerGetTodayOverview(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: ForumStatistic;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/statistics/today',
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
     * 获取热议话题榜
     * @param requestBody
     * @returns any 话题列表
     * @throws ApiError
     */
    public static statisticsControllerGetHotTopics(
        requestBody: HotTopicsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<ForumTopic>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/statistics/hot-topics',
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
     * 获取日期范围内的统计数据
     * @param requestBody
     * @returns any 统计数据列表
     * @throws ApiError
     */
    public static statisticsControllerGetByDateRange(
        requestBody: QueryStatisticsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<ForumStatistic>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/statistics/range',
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
