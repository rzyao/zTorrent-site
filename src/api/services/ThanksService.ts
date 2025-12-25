/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddThankDto } from '../models/AddThankDto';
import type { DeleteThankDto } from '../models/DeleteThankDto';
import type { ListTorrentThanksDto } from '../models/ListTorrentThanksDto';
import type { ListUserThanksDto } from '../models/ListUserThanksDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ThanksService {
    /**
     * 添加感谢（仅本人）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static thanksControllerAdd(
        requestBody: AddThankDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Record<string, any>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/thanks/add',
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
     * 删除感谢（仅本人）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static thanksControllerRemove(
        requestBody: DeleteThankDto,
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
            url: '/thanks/remove',
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
     * 按用户查询其已感谢的种子ID列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static thanksControllerListByUser(
        requestBody: ListUserThanksDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            torrentIds?: Array<string>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/thanks/user/list',
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
     * 按种子查询已感谢该种子的用户ID列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static thanksControllerListByTorrent(
        requestBody: ListTorrentThanksDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            userIds?: Array<string>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/thanks/torrent/list',
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
