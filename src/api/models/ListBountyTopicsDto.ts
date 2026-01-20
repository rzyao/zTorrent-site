/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListBountyTopicsDto = {
    /**
     * 排序方式
     */
    sort?: ListBountyTopicsDto.sort;
    /**
     * 分类 ID (过滤)
     */
    categoryId?: string;
    /**
     * 搜索关键词 (标题及内容)
     */
    search?: string;
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
};
export namespace ListBountyTopicsDto {
    /**
     * 排序方式
     */
    export enum sort {
        LATEST = 'latest',
        ACTIVITY = 'activity',
        VIEWS = 'views',
        POSTS = 'posts',
    }
}

