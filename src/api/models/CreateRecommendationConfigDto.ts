/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateRecommendationConfigDto = {
    /**
     * 显示标题
     */
    title: string;
    /**
     * 关联的Tab ID列表
     */
    tabIds: Array<string>;
    /**
     * 推荐策略
     */
    type: CreateRecommendationConfigDto.type;
    /**
     * 时间范围（天），0表示不限
     */
    timeRange?: number;
    /**
     * 显示数量
     */
    limit?: number;
    /**
     * 排序权重
     */
    sort?: number;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 前端展示样式标识
     */
    style?: string;
};
export namespace CreateRecommendationConfigDto {
    /**
     * 推荐策略
     */
    export enum type {
        LATEST = 'latest',
        HOT_DOWNLOADS = 'hot_downloads',
        HOT_VIEWS = 'hot_views',
        MOST_SEEDED = 'most_seeded',
        RECENT_ACTIVE = 'recent_active',
    }
}

