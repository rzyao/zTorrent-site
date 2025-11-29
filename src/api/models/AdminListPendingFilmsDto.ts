/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListPendingFilmsDto = {
    page?: number;
    limit?: number;
    keyword?: string;
    category?: AdminListPendingFilmsDto.category;
    year?: string;
    ratingMin?: number;
    ratingMax?: number;
    genreIds?: Array<string>;
    enabled?: boolean;
};
export namespace AdminListPendingFilmsDto {
    export enum category {
        FILM = 'film',
        SERIES = 'series',
        DOCUMENTARY = 'documentary',
        ANIME = 'anime',
    }
}

