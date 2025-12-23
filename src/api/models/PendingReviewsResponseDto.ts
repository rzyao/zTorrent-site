/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Torrent } from './Torrent';
export type PendingReviewsResponseDto = {
    /**
     * 待审核种子列表
     */
    items: Array<Torrent>;
    /**
     * 当前列表总数
     */
    total: number;
    /**
     * 全局待审核数量 (红点计数)
     */
    pendingCount: number;
};

