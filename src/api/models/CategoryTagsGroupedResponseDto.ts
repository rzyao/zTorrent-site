/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryTagGroupDto } from './CategoryTagGroupDto';
import type { ForumTag } from './ForumTag';
export type CategoryTagsGroupedResponseDto = {
    /**
     * 分组标签
     */
    groups: Array<CategoryTagGroupDto>;
    /**
     * 未分组标签
     */
    ungroupedTags: Array<ForumTag>;
    /**
     * 分页信息
     */
    pagination: Record<string, any>;
};

