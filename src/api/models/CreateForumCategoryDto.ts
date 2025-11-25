/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateForumCategoryDto = {
    /**
     * 板块唯一键
     */
    key: string;
    /**
     * 板块名称
     */
    name: string;
    /**
     * 板块描述
     */
    description?: string;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 排序（越小越靠前）
     */
    sort?: number;
};

