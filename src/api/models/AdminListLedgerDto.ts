/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListLedgerDto = {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 流水类型
     */
    type?: string;
    /**
     * 原因（reason）
     */
    reason?: string;
    /**
     * 起始时间 ISO
     */
    from?: string;
    /**
     * 结束时间 ISO
     */
    to?: string;
    /**
     * 幂等键
     */
    externalRef?: string;
    /**
     * 关联ID
     */
    correlationId?: string;
    /**
     * 页码
     */
    page?: number;
    /**
     * 分页大小
     */
    pageSize?: number;
};

