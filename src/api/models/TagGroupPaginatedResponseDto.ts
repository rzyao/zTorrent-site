/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumTagGroup } from './ForumTagGroup';
export type TagGroupPaginatedResponseDto = {
    /**
     * 标签组列表
     */
    items: Array<ForumTagGroup>;
    /**
     * 总记录数
     */
    total: number;
    /**
     * 当前页码
     */
    page: number;
    /**
     * 每页条数
     */
    limit: number;
    /**
     * 总页数
     */
    totalPages: number;
};

