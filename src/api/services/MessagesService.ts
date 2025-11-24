/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteMessageDto } from '../models/DeleteMessageDto';
import type { DeleteThreadDto } from '../models/DeleteThreadDto';
import type { ListMessagesDto } from '../models/ListMessagesDto';
import type { ListThreadsDto } from '../models/ListThreadsDto';
import type { MarkReadDto } from '../models/MarkReadDto';
import type { SendMessageDto } from '../models/SendMessageDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MessagesService {
    /**
     * 发送站内私信（1v1）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerSend(
        requestBody: SendMessageDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            id?: string;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/send',
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
     * 会话列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerThreads(
        requestBody: ListThreadsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<{
                threadId?: string;
                peerUserId?: string;
                lastPreview?: string | null;
                lastMessageAt?: string | null;
                unread?: number;
            }>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/threads',
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
     * 会话消息列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerListMessages(
        requestBody: ListMessagesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<{
                id?: string;
                senderId?: string;
                recipientId?: string;
                content?: string;
                createdAt?: string;
                readAt?: string | null;
            }>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/threads/messages',
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
     * 将会话消息全部标记已读（对当前用户）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerMarkRead(
        requestBody: MarkReadDto,
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
            url: '/messages/threads/mark-read',
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
     * 未读消息总数（所有会话）
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerUnreadCount(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            count?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/unread-count',
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
     * 软删单条消息（仅本人可见删除效果）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerDeleteMessage(
        requestBody: DeleteMessageDto,
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
            url: '/messages/delete',
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
     * 软删会话（对当前用户隐藏）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerDeleteThread(
        requestBody: DeleteThreadDto,
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
            url: '/messages/threads/delete',
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
