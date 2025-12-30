/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReportDto = {
    /**
     * 举报原因
     */
    reason: CreateReportDto.reason;
    /**
     * 详细描述
     */
    description?: string;
    /**
     * 被举报的话题 ID (与 postId 二选一)
     */
    topicId?: string;
    /**
     * 被举报的回复 ID (与 topicId 二选一)
     */
    postId?: string;
};
export namespace CreateReportDto {
    /**
     * 举报原因
     */
    export enum reason {
        SPAM = 'spam',
        ABUSE = 'abuse',
        INAPPROPRIATE = 'inappropriate',
        COPYRIGHT = 'copyright',
        OTHER = 'other',
    }
}

