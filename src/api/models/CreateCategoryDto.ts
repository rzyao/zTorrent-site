/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCategoryDto = {
    /**
     * 分类唯一键
     */
    key: string;
    /**
     * 显示名称
     */
    label: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 排序值
     */
    sort?: number;
    /**
     * 是否默认展示
     */
    isDefault?: boolean;
};

