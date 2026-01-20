/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HotTopicsDto = {
    /**
     * 返回条数限制
     */
    limit?: number;
    /**
     * 统计时间窗口（小时），用于计算最近窗口内的新增回复数
     */
    windowHours?: number;
    /**
     * 是否包含归档话题（归档为只读模式，默认不纳入热议榜）
     */
    includeArchived?: boolean;
};

