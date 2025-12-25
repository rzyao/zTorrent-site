/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MusicCommentsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static commentsControllerList(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/comments/list',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static commentsControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/comments/create',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static commentsControllerLike(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/comments/like',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static commentsControllerUnlike(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/comments/unlike',
        });
    }
}
