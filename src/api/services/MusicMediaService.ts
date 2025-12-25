/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StreamMediaDto } from '../models/StreamMediaDto';
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
            url: '/music/songs/audio/upload',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static mediaControllerUploadCover(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/cover/upload',
        });
    }
    /**
     * 音频流播放（POST，Range 仍可用）
     * @param requestBody
     * @returns any 返回音频流（无 Range 时）
     * @throws ApiError
     */
    public static mediaControllerStream(
        requestBody: StreamMediaDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/songs/media/stream',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
