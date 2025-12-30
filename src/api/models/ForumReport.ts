/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForumReport = {
    /**
     * 举报原因
     */
    reason: ForumReport.reason;
    /**
     * 详细描述
     */
    description: string | null;
    /**
     * 举报状态
     */
    status: ForumReport.status;
    /**
     * 管理员处理备注
     */
    handlerNote: string | null;
    /**
     * 处理时间
     */
    handledAt: string | null;
    /**
     * 举报人 ID
     */
    reporterId: string;
    /**
     * 处理人 ID
     */
    handlerId: string | null;
    /**
     * 被举报的话题 ID
     */
    topicId: string | null;
    /**
     * 被举报的回复 ID
     */
    postId: string | null;
};
export namespace ForumReport {
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
    /**
     * 举报状态
     */
    export enum status {
        PENDING = 'pending',
        RESOLVED = 'resolved',
        REJECTED = 'rejected',
    }
}

