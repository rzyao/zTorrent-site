/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementDetailDto } from '../models/AnnouncementDetailDto';
import type { AnnouncementsStatsDto } from '../models/AnnouncementsStatsDto';
import type { ListAnnouncementsDto } from '../models/ListAnnouncementsDto';
import type { MarkReadDto } from '../models/MarkReadDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnnouncementsService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static announcementsControllerList(
        requestBody: ListAnnouncementsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/announcements/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static announcementsControllerDetail(
        requestBody: AnnouncementDetailDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/announcements/detail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static announcementsControllerStats(
        requestBody: AnnouncementsStatsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/announcements/stats',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static announcementsControllerMarkRead(
        requestBody: MarkReadDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/announcements/read/mark',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
