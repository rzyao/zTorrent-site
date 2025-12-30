/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type QueryStatisticsDto = {
    /**
     * 开始日期 (YYYY-MM-DD)
     */
    startDate: string;
    /**
     * 结束日期 (YYYY-MM-DD)
     */
    endDate: string;
    /**
     * 统计类型
     */
    type?: QueryStatisticsDto.type;
};
export namespace QueryStatisticsDto {
    /**
     * 统计类型
     */
    export enum type {
        DAILY = 'daily',
        WEEKLY = 'weekly',
        MONTHLY = 'monthly',
    }
}

