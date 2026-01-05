/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetLikeStatusDto } from '../models/GetLikeStatusDto';
import type { LikeResponseDto } from '../models/LikeResponseDto';
import type { ToggleLikeDto } from '../models/ToggleLikeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumsLikesService {
    /**
     * 切换点赞状态
     * @param requestBody
     * @returns any 点赞状态
     * @throws ApiError
     */
    public static likesControllerToggle(
        requestBody: ToggleLikeDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: LikeResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/likes/toggle',
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
     * 获取点赞状态
     * @param requestBody
     * @returns any 点赞状态
     * @throws ApiError
     */
    public static likesControllerGetStatus(
        requestBody: GetLikeStatusDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: LikeResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forums/likes/status',
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
