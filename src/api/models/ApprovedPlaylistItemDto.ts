/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistCreatorDto } from './PlaylistCreatorDto';
export type ApprovedPlaylistItemDto = {
    /**
     * 片单ID
     */
    id: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 封面URL
     */
    coverUrl: Record<string, any> | null;
    /**
     * 创建者ID
     */
    creatorId: string;
    /**
     * 审批时间
     */
    approvedAt: string;
    /**
     * 创建时间
     */
    createdAt: string;
    /**
     * 创建者信息
     */
    creator: PlaylistCreatorDto | null;
};

