/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type QueryMyLedgerDto = {
    /**
     * 页码（从 1 开始）
     */
    page?: number;
    /**
     * 每页数量
     */
    pageSize?: number;
    /**
     * 开始时间（ISO）
     */
    from?: string;
    /**
     * 结束时间（ISO）
     */
    to?: string;
    /**
     * 类型过滤
     */
    types?: Array<'earn' | 'spend'>;
    /**
     * 原因过滤
     */
    reasons?: Array<any[]>;
};

