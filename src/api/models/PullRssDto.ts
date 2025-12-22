/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PullRssDto = {
    /**
     * RSS Token（由 /rss/token 获取）
     */
    token: string;
    /**
     * 分类过滤（逗号分隔）
     */
    category?: string;
    /**
     * 标签过滤（逗号分隔）
     */
    tags?: string;
    /**
     * 质量过滤（逗号分隔），例如 4k,1080p,remux,bluray
     */
    quality?: string;
    /**
     * 字段选择（逗号分隔），例如 title,description,size,seeders
     */
    fields?: string;
};

