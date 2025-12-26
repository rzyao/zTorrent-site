/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SeriesReviewHistoryDto = {
    /**
     * 筛选状态，all/approved/rejected
     */
    status?: string;
    /**
     * 创建者ID筛选
     */
    creatorId?: string;
    /**
     * 关键词搜索（标题）
     */
    keyword?: string;
    /**
     * 开始时间
     */
    startAt?: string;
    /**
     * 结束时间
     */
    endAt?: string;
    /**
     * 页码
     */
    page: number;
    /**
     * 每页数量
     */
    limit: number;
};

