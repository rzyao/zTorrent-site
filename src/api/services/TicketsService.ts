/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminListTicketsDto } from '../models/AdminListTicketsDto';
import type { AssignTicketDto } from '../models/AssignTicketDto';
import type { CloseTicketDto } from '../models/CloseTicketDto';
import type { ConfirmResolvedDto } from '../models/ConfirmResolvedDto';
import type { CreateTicketDto } from '../models/CreateTicketDto';
import type { ListTicketsDto } from '../models/ListTicketsDto';
import type { MarkResolvedDto } from '../models/MarkResolvedDto';
import type { MyTodosDto } from '../models/MyTodosDto';
import type { ReplyDto } from '../models/ReplyDto';
import type { TicketDetailDto } from '../models/TicketDetailDto';
import type { UploadAttachmentDto } from '../models/UploadAttachmentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketsService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerList(
        requestBody: ListTicketsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/stats',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerDetail(
        requestBody: TicketDetailDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/detail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerCreate(
        requestBody: CreateTicketDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param formData
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerUpload(
        formData: UploadAttachmentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/attachments/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerReply(
        requestBody: ReplyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/reply',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerClose(
        requestBody: CloseTicketDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/close',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerConfirmResolved(
        requestBody: ConfirmResolvedDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/confirm-resolved',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerAssign(
        requestBody: AssignTicketDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/assign',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerMarkResolved(
        requestBody: MarkResolvedDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/mark-resolved',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerAdminList(
        requestBody: AdminListTicketsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/admin/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static ticketsControllerTodos(
        requestBody: MyTodosDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/todos',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
