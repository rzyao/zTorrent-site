/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePlaylistDto = {
    name: string;
    description?: string;
    coverUrl?: string;
    visibility: CreatePlaylistDto.visibility;
    tags?: Array<string>;
};
export namespace CreatePlaylistDto {
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
        FRIENDS = 'friends',
    }
}

