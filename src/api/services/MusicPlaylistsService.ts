/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MusicPlaylistsService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerListPublic(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/public/list',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerMy(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/my',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/create',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerUpdate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/update',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/delete',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerAddSong(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/songs/add',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerRemoveSong(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/songs/remove',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerFavorite(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/favorite',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static playlistsControllerUnfavorite(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/music/playlists/unfavorite',
        });
    }
}
