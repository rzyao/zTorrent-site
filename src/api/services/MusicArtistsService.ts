/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MusicArtistsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static artistsControllerList(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artists/list',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static artistsControllerDetail(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artists/detail',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static artistsControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artists/create',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static artistsControllerUpdate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artists/update',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static artistsControllerDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artists/delete',
        });
    }
}
