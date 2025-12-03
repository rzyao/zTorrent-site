/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlaylistSummaryDTO = {
    id: string;
    name: string;
    visibility: PlaylistSummaryDTO.visibility;
    coverUrl?: string;
    filmCount: number;
    stats: Record<string, any>;
    meta: Record<string, any>;
};
export namespace PlaylistSummaryDTO {
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
        FRIENDS = 'friends',
    }
}

