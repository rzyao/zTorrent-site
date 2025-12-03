/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistItemDTO } from './PlaylistItemDTO';
export type PlaylistDTO = {
    id: string;
    name: string;
    description?: string;
    visibility: PlaylistDTO.visibility;
    coverUrl?: string;
    tags?: Array<string>;
    films: Array<PlaylistItemDTO>;
    stats: Record<string, any>;
    meta: Record<string, any>;
};
export namespace PlaylistDTO {
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
        FRIENDS = 'friends',
    }
}

