/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListFilmsDto = {
    page?: number;
    limit?: number;
    /**
     * 关键词（与 search 兼容）
     */
    search?: string;
    keyword?: string;
    enabled?: boolean;
    /**
     * 分类筛选
     */
    categories?: Array<string>;
    /**
     * 支持 YYYY 或 YYYY-YYYY
     */
    year?: string;
    ratingMin?: number;
    ratingMax?: number;
    /**
     * 流派名称集合（长度≤20）
     */
    genres?: Array<string>;
    /**
     * 标签筛选：all(全部)、trending(热门)、latest(最新)、classic(经典)
     */
    tab?: ListFilmsDto.tab;
    /**
     * 类型筛选，多个用逗号分隔（名称）
     */
    genre?: string;
    /**
     * 排序方式：rating(评分)、latest(最新)、popular(受欢迎)
     */
    sortBy?: ListFilmsDto.sortBy;
};
export namespace ListFilmsDto {
    /**
     * 标签筛选：all(全部)、trending(热门)、latest(最新)、classic(经典)
     */
    export enum tab {
        ALL = 'all',
        TRENDING = 'trending',
        LATEST = 'latest',
        CLASSIC = 'classic',
    }
    /**
     * 排序方式：rating(评分)、latest(最新)、popular(受欢迎)
     */
    export enum sortBy {
        RATING = 'rating',
        LATEST = 'latest',
        POPULAR = 'popular',
    }
}

