/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MovieCreatorDto } from './MovieCreatorDto';
export type RejectedMovieItemDto = {
    /**
     * 电影ID
     */
    id: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 原标题
     */
    originalTitle: Record<string, any> | null;
    /**
     * 海报URL
     */
    posterUrl: Record<string, any> | null;
    /**
     * 创建者ID
     */
    creatorId: string;
    /**
     * 审批时间（驳回时间）
     */
    approvedAt: Record<string, any> | null;
    /**
     * 创建时间
     */
    createdAt: string;
    /**
     * 创建者信息
     */
    creator: MovieCreatorDto | null;
};

