/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RemoveItemFromPlaylistDto = {
    /**
     * 片单ID
     */
    playlistId: string;
    /**
     * 内容类型
     */
    itemType: RemoveItemFromPlaylistDto.itemType;
    /**
     * 内容ID（电影ID或剧集ID）
     */
    itemId: string;
};
export namespace RemoveItemFromPlaylistDto {
    /**
     * 内容类型
     */
    export enum itemType {
        MOVIE = 'movie',
        SERIES = 'series',
    }
}

