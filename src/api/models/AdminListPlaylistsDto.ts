/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListPlaylistsDto = {
    page?: number;
    limit?: number;
    keyword?: string;
    /**
     * 拥有者ID筛选
     */
    ownerId?: string;
    type?: AdminListPlaylistsDto.type;
    visibility?: AdminListPlaylistsDto.visibility;
    approvalStatus?: string;
    sortBy?: string;
    order?: string;
};
export namespace AdminListPlaylistsDto {
    export enum type {
        GENERAL = 'general',
        TOPIC = 'topic',
        SERIES = 'series',
        DIRECTOR = 'director',
        CURATION = 'curation',
        ACTOR = 'actor',
    }
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
    }
}

