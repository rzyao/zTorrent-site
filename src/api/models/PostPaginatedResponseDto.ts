/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumPost } from './ForumPost';
export type PostPaginatedResponseDto = {
    /**
     * 回复列表
     */
    items: Array<ForumPost>;
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

