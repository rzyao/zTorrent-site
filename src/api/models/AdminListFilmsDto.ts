/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListFilmsDto = {
    page?: number;
    limit?: number;
    keyword?: string;
    approvalStatus?: string;
    /**
     * 分类筛选
     */
    categories?: Array<string>;
    year?: string;
    ratingMin?: number;
    ratingMax?: number;
    /**
     * 流派名称集合
     */
    genres?: Array<string>;
    enabled?: boolean;
    sortBy?: string;
    order?: string;
};

