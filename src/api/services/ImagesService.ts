/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ImagesService {
    /**
     * 上传图片（JSON base64）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static imagesControllerUpload(
        requestBody: {
            /**
             * base64 编码图片内容
             */
            content: string;
            filename: string;
            mimeType: string;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            url?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/images/upload',
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
