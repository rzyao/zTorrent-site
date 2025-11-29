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
    category?: ListFilmsDto.category;
    /**
     * 支持 YYYY 或 YYYY-YYYY
     */
    year?: string;
    ratingMin?: number;
    ratingMax?: number;
    /**
     * 流派ID集合（长度≤20）
     */
    genreIds?: Array<string>;
};
export namespace ListFilmsDto {
    export enum category {
        FILM = 'film',
        SERIES = 'series',
        DOCUMENTARY = 'documentary',
        ANIME = 'anime',
    }
}

