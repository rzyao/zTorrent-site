/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumTag } from './ForumTag';
export type CategoryTagGroupDto = {
    /**
     * 标签组 ID
     */
    id: string;
    /**
     * 标签组名称
     */
    name: string;
    /**
     * 标签组颜色 (Hex)
     */
    color: string | null;
    /**
     * 排序权重
     */
    sortOrder: number;
    /**
     * 组内标签列表
     */
    tags: Array<ForumTag>;
};

