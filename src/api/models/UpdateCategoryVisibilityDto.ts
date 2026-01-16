/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCategoryVisibilityDto = {
    /**
     * 分类 ID
     */
    id: string;
    /**
     * 允许其他公共标签
     */
    allowOtherTags: boolean;
    /**
     * 允许的标签 ID 列表（直接限制）
     */
    allowedTags?: Array<string>;
    /**
     * 允许的标签组 ID 列表（组限制）
     */
    allowedGroups?: Array<string>;
};

