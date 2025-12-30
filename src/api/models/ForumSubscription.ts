/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForumSubscription = {
    /**
     * 是否接收邮件通知
     */
    emailNotify: boolean;
    /**
     * 是否接收站内通知
     */
    siteNotify: boolean;
    /**
     * 最后阅读时间
     */
    lastReadAt: string | null;
    /**
     * 用户 ID
     */
    userId: string;
    /**
     * 话题 ID
     */
    topicId: string;
};

