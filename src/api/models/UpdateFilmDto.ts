/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateFilmDto = {
    title?: string;
    description?: string;
    enabled?: boolean;
    sort?: number;
    originalTitle?: string;
    /**
     * 支持 YYYY 或 YYYY-YYYY
     */
    year?: string;
    category?: UpdateFilmDto.category;
    /**
     * 0–10，保留一位小数
     */
    rating?: number;
    duration?: string;
    director?: string;
    posterUrl?: string;
    backdropUrl?: string;
    /**
     * 长度≤20
     */
    genres?: Array<string>;
    /**
     * 长度≤50
     */
    cast?: Array<string>;
    /**
     * 获奖列表
     */
    awards?: Array<string>;
    /**
     * 地区标签
     */
    region?: Array<string>;
    /**
     * 语言列表
     */
    language?: Array<string>;
    /**
     * 豆瓣链接（http/https）
     */
    doubanLink?: string;
    /**
     * IMDb 链接（http/https）
     */
    imdbLink?: string;
    /**
     * 豆瓣平均分（0–10，建议一位小数）
     */
    doubanRatingAverage?: number;
    /**
     * IMDb 平均分（0–10，建议一位小数）
     */
    imdbRatingAverage?: number;
};
export namespace UpdateFilmDto {
    export enum category {
        FILM = 'film',
        SERIES = 'series',
        DOCUMENTARY = 'documentary',
        ANIME = 'anime',
    }
}

