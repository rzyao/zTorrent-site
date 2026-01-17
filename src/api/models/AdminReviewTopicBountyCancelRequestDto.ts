/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminReviewTopicBountyCancelRequestDto = {
    /**
     * 话题 ID
     */
    topicId: string;
    /**
     * 审核动作
     */
    action: AdminReviewTopicBountyCancelRequestDto.action;
    /**
     * 审核备注
     */
    note?: string;
};
export namespace AdminReviewTopicBountyCancelRequestDto {
    /**
     * 审核动作
     */
    export enum action {
        APPROVE = 'approve',
        REJECT = 'reject',
    }
}

