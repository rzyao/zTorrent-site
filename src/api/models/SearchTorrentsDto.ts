/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SearchTorrentsDto = {
    /**
     * 搜索关键词 (Title/SubTitle)
     */
    keyword?: string;
    /**
     * 分类 KEY
     */
    category?: string;
    /**
     * 排序字段
     */
    sortBy?: string;
    /**
     * 排序方向
     */
    order?: string;
    /**
     * 页码
     */
    page: number;
    /**
     * 每页数量
     */
    limit: number;
};

