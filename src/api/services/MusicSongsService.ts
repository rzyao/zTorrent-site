/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MusicSongsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerList(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/list',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerDetail(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/detail',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/create',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerUpdate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/update',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/delete',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerLike(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/like',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerUnlike(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/unlike',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerReportPlay(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/plays/report',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static songsControllerReportProgress(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/progress/report',
        });
    }
}
