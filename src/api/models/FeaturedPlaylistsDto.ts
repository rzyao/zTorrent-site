/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeaturedPlaylistsDto = {
    /**
     * 返回条数限制
     */
    limit?: number;
    /**
     * 精华分组 category key（默认 featured）
     */
    categoryKey?: string;
    /**
     * 片单类型筛选
     */
    type?: FeaturedPlaylistsDto.type;
    /**
     * 排序策略
     */
    orderBy?: FeaturedPlaylistsDto.orderBy;
    /**
     * 缓存 TTL（秒）；仅用于调试/灰度，生产可不传
     */
    cacheTtlSeconds?: number;
};
export namespace FeaturedPlaylistsDto {
    /**
     * 片单类型筛选
     */
    export enum type {
        MOVIE = 'movie',
        SERIES = 'series',
        ADULT = 'adult',
        MUSIC = 'music',
    }
    /**
     * 排序策略
     */
    export enum orderBy {
        SORT = 'sort',
        VIEWS = 'views',
        FOLLOWS = 'follows',
        LIKES = 'likes',
        SUBSCRIBERS = 'subscribers',
    }
}

