/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StatisticsDto = {
    dateFrom: string;
    dateTo: string;
    granularity: StatisticsDto.granularity;
    issuerId?: string;
};
export namespace StatisticsDto {
    export enum granularity {
        DAY = 'day',
        WEEK = 'week',
        MONTH = 'month',
    }
}

