/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListBalancesDto = {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 用户名（模糊）
     */
    username?: string;
    /**
     * 是否冻结（0/1）
     */
    isFrozen?: number;
    /**
     * 最小余额
     */
    min?: string;
    /**
     * 最大余额
     */
    max?: string;
    /**
     * 页码
     */
    page?: number;
    /**
     * 分页大小
     */
    pageSize?: number;
    /**
     * 排序字段
     */
    sortBy?: string;
    /**
     * 排序方向
     */
    order?: string;
};

