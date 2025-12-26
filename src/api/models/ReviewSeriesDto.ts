/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewSeriesDto = {
    /**
     * 剧集ID
     */
    id: string;
    action: ReviewSeriesDto.action;
    /**
     * 备注（≤500）
     */
    note?: string;
    /**
     * 拒绝原因代码
     */
    reasonCode?: string;
};
export namespace ReviewSeriesDto {
    export enum action {
        APPROVE = 'approve',
        REJECT = 'reject',
    }
}

