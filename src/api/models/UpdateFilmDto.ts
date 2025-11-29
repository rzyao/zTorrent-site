/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateFilmDto = {
    title?: string;
    description?: string;
    coverUrl?: string;
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
     * 长度≤20
     */
    cast?: Array<string>;
};
export namespace UpdateFilmDto {
    export enum category {
        FILM = 'film',
        SERIES = 'series',
        DOCUMENTARY = 'documentary',
        ANIME = 'anime',
    }
}

