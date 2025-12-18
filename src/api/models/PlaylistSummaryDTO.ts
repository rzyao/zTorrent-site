/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistStatsDTO } from './PlaylistStatsDTO';
import type { PlaylistSummaryMetaDTO } from './PlaylistSummaryMetaDTO';
export type PlaylistSummaryDTO = {
    id: string;
    name: string;
    /**
     * 片单类型
     */
    type: PlaylistSummaryDTO.type;
    visibility: PlaylistSummaryDTO.visibility;
    coverUrl?: string;
    filmCount: number;
    stats: PlaylistStatsDTO;
    meta: PlaylistSummaryMetaDTO;
};
export namespace PlaylistSummaryDTO {
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

