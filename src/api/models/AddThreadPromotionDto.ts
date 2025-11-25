/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AddThreadPromotionDto = {
    /**
     * 主题ID
     */
    threadId: string;
    /**
     * 高亮状态数组
     */
    status?: Array<string>;
    /**
     * 时效类型
     */
    timeType?: number;
    /**
     * 到期时间
     */
    endTime?: string;
    /**
     * 排序
     */
    sort?: number;
};

