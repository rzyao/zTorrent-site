/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentDto } from '../models/AttachmentDto';
import type { BindAttachmentDto } from '../models/BindAttachmentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AttachmentsService {
    /**
     * 按目标查询附件
     * @param attachableType
     * @param attachableId
     * @param field
     * @returns any 成功
     * @throws ApiError
     */
    public static attachmentsControllerList(
        attachableType: string,
        attachableId: string,
        field?: string,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Array<AttachmentDto>;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attachments',
            query: {
                'attachableType': attachableType,
                'attachableId': attachableId,
                'field': field,
            },
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
     * 绑定附件到业务对象
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static attachmentsControllerBind(
        requestBody: BindAttachmentDto,
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
            url: '/attachments/bind',
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
