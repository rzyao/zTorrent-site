/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListTorrentsDto = {
    page?: number;
    pageSize?: number;
    category?: string;
    status?: string;
    uploaderId?: string;
    /**
     * 关键词搜索（标题/副标题）
     */
    keyword?: string;
    /**
     * 目标媒体 ID，用于排除已绑定的种子（必填）
     */
    bindMediaId: string;
    /**
     * 目标媒体类型（必填）
     */
    bindMediaType: ListTorrentsDto.bindMediaType;
};
export namespace ListTorrentsDto {
    /**
     * 目标媒体类型（必填）
     */
    export enum bindMediaType {
        MOVIE = 'movie',
        SERIES = 'series',
        EPISODE = 'episode',
        PLAYLIST = 'playlist',
    }
}

