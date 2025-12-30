/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumCategory } from './ForumCategory';
export type CategoryPaginatedResponseDto = {
    /**
     * 分类列表
     */
    items: Array<ForumCategory>;
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

