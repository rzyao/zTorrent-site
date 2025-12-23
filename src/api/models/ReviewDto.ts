/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewDto = {
    /**
     * 内容ID（雪花ID，数字字符串）
     */
    id: string;
    action: ReviewDto.action;
    /**
     * 备注（≤500）
     */
    note?: string;
    /**
     * 拒绝原因代码
     */
    reasonCode?: string;
};
export namespace ReviewDto {
    export enum action {
        APPROVE = 'approve',
        REJECT = 'reject',
    }
}

