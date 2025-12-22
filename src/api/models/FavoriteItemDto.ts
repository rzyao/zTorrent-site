/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FavoriteItemDto = {
    /**
     * 收藏ID
     */
    id: string;
    /**
     * 目标资源ID
     */
    targetId: string;
    /**
     * 目标类型
     */
    targetType: FavoriteItemDto.targetType;
    /**
     * 目标资源标题
     */
    targetTitle?: string;
    /**
     * 目标资源封面
     */
    targetCover?: Record<string, any>;
    /**
     * 备注
     */
    note?: Record<string, any>;
    /**
     * 收藏时间
     */
    createdAt: string;
};
export namespace FavoriteItemDto {
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

