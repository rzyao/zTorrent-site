/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListFilmsDto = {
    page?: number;
    limit?: number;
    keyword?: string;
    approvalStatus?: string;
    category?: AdminListFilmsDto.category;
    year?: string;
    ratingMin?: number;
    ratingMax?: number;
    genreIds?: Array<string>;
    enabled?: boolean;
    sortBy?: string;
    order?: string;
};
export namespace AdminListFilmsDto {
    export enum category {
        FILM = 'film',
        SERIES = 'series',
        DOCUMENTARY = 'documentary',
        ANIME = 'anime',
    }
}

