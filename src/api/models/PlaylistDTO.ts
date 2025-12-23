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
    category?: string;
    /**
     * 审核状态
     */
    approvalStatus: PlaylistDTO.approvalStatus;
    films: Array<PlaylistItemDTO>;
    stats: PlaylistStatsDTO;
    meta: PlaylistMetaDTO;
    /**
     * 是否已收藏
     */
    isFavorited?: boolean;
};
export namespace PlaylistDTO {
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

