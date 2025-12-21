/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistStatsDTO } from './PlaylistStatsDTO';
import type { PlaylistSummaryMetaDTO } from './PlaylistSummaryMetaDTO';
export type PlaylistSummaryDTO = {
    id: string;
    name: string;
    description?: string;
    /**
     * 片单类型
     */
    type: PlaylistSummaryDTO.type;
    visibility: PlaylistSummaryDTO.visibility;
    coverUrl?: string;
    tags?: Array<string>;
    category?: string;
    /**
     * 审核状态
     */
    approvalStatus: PlaylistSummaryDTO.approvalStatus;
    filmCount: number;
    stats: PlaylistStatsDTO;
    meta: PlaylistSummaryMetaDTO;
};
export namespace PlaylistSummaryDTO {
    /**
     * 片单类型
     */
    export enum type {
        MOVIE = 'movie',
        SERIES = 'series',
        ADULT = 'adult',
        MUSIC = 'music',
    }
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
    }
    /**
     * 审核状态
     */
    export enum approvalStatus {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

