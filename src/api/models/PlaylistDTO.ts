/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistItemDTO } from './PlaylistItemDTO';
import type { PlaylistMetaDTO } from './PlaylistMetaDTO';
import type { PlaylistStatsDTO } from './PlaylistStatsDTO';
export type PlaylistDTO = {
    id: string;
    name: string;
    description?: string;
    /**
     * 片单类型
     */
    type: PlaylistDTO.type;
    visibility: PlaylistDTO.visibility;
    coverUrl?: string;
    tags?: Array<string>;
    films: Array<PlaylistItemDTO>;
    stats: PlaylistStatsDTO;
    meta: PlaylistMetaDTO;
};
export namespace PlaylistDTO {
    /**
     * 片单类型
     */
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

