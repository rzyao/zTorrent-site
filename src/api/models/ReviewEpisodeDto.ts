/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewEpisodeDto = {
    /**
     * 分集ID
     */
    id: string;
    action: ReviewEpisodeDto.action;
    /**
     * 备注（≤500）
     */
    note?: string;
    /**
     * 拒绝原因代码
     */
    reasonCode?: string;
};
export namespace ReviewEpisodeDto {
    export enum action {
        APPROVE = 'approve',
        REJECT = 'reject',
    }
}

