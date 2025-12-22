/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FavoriteActionDto = {
    /**
     * 目标资源ID
     */
    targetId: string;
    /**
     * 目标类型
     */
    targetType: FavoriteActionDto.targetType;
    /**
     * 备注
     */
    note?: string;
};
export namespace FavoriteActionDto {
    /**
     * 目标类型
     */
    export enum targetType {
        TORRENT = 'torrent',
        MOVIE = 'movie',
        SERIES = 'series',
        PLAYLIST = 'playlist',
    }
}

