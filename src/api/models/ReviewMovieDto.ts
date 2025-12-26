/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewMovieDto = {
    /**
     * 电影ID（雪花ID，数字字符串）
     */
    id: string;
    /**
     * 审核操作
     */
    action: ReviewMovieDto.action;
    /**
     * 备注（≤500）
     */
    note?: string;
    /**
     * 拒绝原因代码
     */
    reasonCode?: string;
};
export namespace ReviewMovieDto {
    /**
     * 审核操作
     */
    export enum action {
        APPROVE = 'approve',
        REJECT = 'reject',
    }
}

