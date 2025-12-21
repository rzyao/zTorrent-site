/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AddItemToPlaylistDto = {
    /**
     * 片单ID
     */
    playlistId: string;
    /**
     * 内容类型
     */
    itemType: AddItemToPlaylistDto.itemType;
    /**
     * 内容ID（电影ID或剧集ID）
     */
    itemId: string;
};
export namespace AddItemToPlaylistDto {
    /**
     * 内容类型
     */
    export enum itemType {
        MOVIE = 'movie',
        SERIES = 'series',
    }
}

