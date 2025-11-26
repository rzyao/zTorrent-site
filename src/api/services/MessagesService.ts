/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteMessageDto } from '../models/DeleteMessageDto';
import type { DeleteThreadDto } from '../models/DeleteThreadDto';
import type { FavoriteMessageDto } from '../models/FavoriteMessageDto';
import type { ListFavoritesDto } from '../models/ListFavoritesDto';
import type { ListInboxDto } from '../models/ListInboxDto';
import type { ListMessagesDto } from '../models/ListMessagesDto';
import type { ListOutboxDto } from '../models/ListOutboxDto';
import type { ListThreadsDto } from '../models/ListThreadsDto';
import type { MarkReadDto } from '../models/MarkReadDto';
import type { PollDto } from '../models/PollDto';
import type { ReplyMessageDto } from '../models/ReplyMessageDto';
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
     * 回复消息
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerReply(
        requestBody: ReplyMessageDto,
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
            url: '/messages/reply',
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
     * 标记单条消息为已读
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerMarkReadSingle(): CancelablePromise<{
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
            url: '/messages/mark-read',
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
     * 收藏消息
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerFavorite(
        requestBody: FavoriteMessageDto,
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
            url: '/messages/favorite',
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
     * 取消收藏消息
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerUnfavorite(
        requestBody: FavoriteMessageDto,
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
            url: '/messages/unfavorite',
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
     * 收件箱列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerInbox(
        requestBody: ListInboxDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/inbox',
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
     * 发件箱列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerOutbox(
        requestBody: ListOutboxDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/outbox',
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
     * 我的收藏列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerFavorites(
        requestBody: ListFavoritesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/favorites',
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
     * 轮询新消息与会话更新
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static messagesControllerPoll(
        requestBody: PollDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            inboxNewCount?: number;
            notificationsNewCount?: number;
            threadsUpdated?: Array<Record<string, any>>;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/poll',
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
    /**
     * 系统通知列表
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static notificationsControllerList(
        requestBody: {
            page?: number;
            limit?: number;
        },
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            total?: number;
            page?: number;
            limit?: number;
        };
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/notifications/list',
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
     * 标记通知为已读
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static notificationsControllerMarkRead(
        requestBody: {
            ids: Array<string>;
        },
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
            url: '/messages/notifications/mark-read',
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
     * 删除通知（软删）
     * @param requestBody
     * @returns any 成功
     * @throws ApiError
     */
    public static notificationsControllerDelete(
        requestBody: {
            id: string;
        },
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
            url: '/messages/notifications/delete',
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
