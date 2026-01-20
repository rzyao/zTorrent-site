/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HotCarouselTorrentsDto = {
    /**
     * 返回条数限制
     */
    limit?: number;
    /**
     * 分类 Key（可选过滤）
     */
    categoryKey?: string;
    /**
     * 热度排序策略
     */
    orderBy?: HotCarouselTorrentsDto.orderBy;
    /**
     * 时间窗口（天），只返回最近 N 天上传的种子；0 表示不限制
     */
    days?: number;
};
export namespace HotCarouselTorrentsDto {
    /**
     * 热度排序策略
     */
    export enum orderBy {
        HOT_DOWNLOADS = 'hot_downloads',
        MOST_SEEDED = 'most_seeded',
        RECENT_ACTIVE = 'recent_active',
        LATEST = 'latest',
        HOT_VIEWS = 'hot_views',
    }
}

