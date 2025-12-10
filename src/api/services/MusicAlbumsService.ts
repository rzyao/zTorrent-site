/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MusicAlbumsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static albumsControllerList(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/albums/list',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static albumsControllerDetail(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/albums/detail',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static albumsControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/albums/create',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static albumsControllerUpdate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/albums/update',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static albumsControllerDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/albums/delete',
        });
    }
}
