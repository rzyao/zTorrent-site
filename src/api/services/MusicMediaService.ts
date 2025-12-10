/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MusicMediaService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static mediaControllerUploadAudio(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/songs/upload-audio',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static mediaControllerUploadCover(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/songs/upload-cover',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static mediaControllerStream(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/songs/media/{id}/stream',
        });
    }
}
