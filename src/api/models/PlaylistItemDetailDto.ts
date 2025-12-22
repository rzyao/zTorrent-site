/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlaylistItemDetailDto = {
    id: string;
    itemType: PlaylistItemDetailDto.itemType;
    itemId: string;
    sort: number;
    title: string;
    originalTitle?: string;
    description?: string;
    posterUrl: string;
    year: string;
    rating: number;
    director?: string;
    cast?: Array<string>;
    genres?: Array<string>;
    language?: string;
    viewsCount?: number;
    collectionsCount?: number;
    episodeCount?: number;
};
export namespace PlaylistItemDetailDto {
    export enum itemType {
        MOVIE = 'movie',
        SERIES = 'series',
    }
}

