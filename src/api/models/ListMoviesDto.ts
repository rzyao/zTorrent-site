/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListMoviesDto = {
    page?: number;
    limit?: number;
    /**
     * 搜索关键词
     */
    keyword?: string;
    /**
     * 年份筛选
     */
    year?: string;
    /**
     * 类型筛选
     */
    genres?: Array<string>;
    /**
     * 分类筛选
     */
    categories?: Array<string>;
    /**
     * 排序字段
     */
    sortBy?: ListMoviesDto.sortBy;
    /**
     * 排序方向
     */
    order?: ListMoviesDto.order;
};
export namespace ListMoviesDto {
    /**
     * 排序字段
     */
    export enum sortBy {
        RATING = 'rating',
        YEAR = 'year',
        CREATED_AT = 'createdAt',
        VIEWS_COUNT = 'viewsCount',
    }
    /**
     * 排序方向
     */
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
}

