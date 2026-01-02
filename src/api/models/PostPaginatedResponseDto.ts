/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumPost } from './ForumPost';
export type PostPaginatedResponseDto = {
    /**
     * 回复列表（每个帖子包含 postNumber 字段）
     */
    items: Array<ForumPost>;
    /**
     * 话题内帖子总数
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
     * 是否有下一页
     */
    hasNext: boolean;
    /**
     * 是否有上一页（用于双向无限滚动）
     */
    hasPrevious: boolean;
};

