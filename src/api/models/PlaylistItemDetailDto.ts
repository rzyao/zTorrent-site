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
    posterUrl: string;
    year: string;
    rating: number;
    episodeCount?: number;
};
export namespace PlaylistItemDetailDto {
    export enum itemType {
        MOVIE = 'movie',
        SERIES = 'series',
    }
}

