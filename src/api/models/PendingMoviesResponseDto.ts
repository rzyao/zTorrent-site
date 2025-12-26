/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PendingMoviesResponseDto = {
    /**
     * 待审核电影列表
     */
    items: Array<string>;
    /**
     * 当前列表总数
     */
    total: number;
    /**
     * 全局待审核数量 (红点计数)
     */
    pendingCount: number;
};

