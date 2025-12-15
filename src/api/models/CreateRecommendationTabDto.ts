/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateRecommendationTabDto = {
    /**
     * 关联分类Key，null表示全站
     */
    categoryKey?: Record<string, any>;
    /**
     * Tab显示名称
     */
    label: string;
    /**
     * 排序权重
     */
    sort?: number;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 图标标识
     */
    icon?: string;
};

