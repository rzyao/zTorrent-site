/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminAdjustDto = {
    /**
     * 目标用户ID
     */
    userId: string;
    /**
     * 变动值（字符串大整数，支持负数）
     */
    delta?: string;
    /**
     * 变动数量（正数），需配合 type 使用
     */
    amount?: Record<string, any>;
    /**
     * 变动类型：add | reduce
     */
    type?: string;
    /**
     * 调账原因（必填）
     */
    reason: string;
    /**
     * 业务引用类型
     */
    refType?: string;
    /**
     * 业务引用ID
     */
    refId?: string;
    /**
     * 幂等键
     */
    externalRef?: string;
    /**
     * 关联ID（用于与其他流水配对）
     */
    correlationId?: string;
};

