/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BatchFavoriteActionDto = {
    /**
     * 目标资源ID列表
     */
    targetIds: Array<string>;
    /**
     * 目标类型
     */
    targetType: BatchFavoriteActionDto.targetType;
    /**
     * 备注（所有项目使用相同备注）
     */
    note?: string;
};
export namespace BatchFavoriteActionDto {
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

