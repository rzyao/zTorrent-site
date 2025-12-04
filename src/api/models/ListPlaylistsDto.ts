/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListPlaylistsDto = {
    page?: number;
    limit?: number;
    keyword?: string;
    visibility?: ListPlaylistsDto.visibility;
    type?: ListPlaylistsDto.type;
};
export namespace ListPlaylistsDto {
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
        FRIENDS = 'friends',
    }
    export enum type {
        GENERAL = 'general',
        TOPIC = 'topic',
        SERIES = 'series',
        DIRECTOR = 'director',
        CURATION = 'curation',
    }
}

