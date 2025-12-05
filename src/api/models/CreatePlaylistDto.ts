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
    /**
     * 分类唯一键（categories.key，kind=playlist）
     */
    category?: string;
};
export namespace CreatePlaylistDto {
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
        FRIENDS = 'friends',
    }
}

