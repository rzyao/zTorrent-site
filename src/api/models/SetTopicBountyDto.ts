/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SetTopicBountyDto = {
    /**
     * 话题 ID
     */
    topicId: string;
    /**
     * 悬赏金额（魔力值）
     */
    amount: string;
    /**
     * 到期时间（ISO 字符串），与 durationDays 二选一
     */
    expiresAt?: string;
    /**
     * 悬赏期限（天），与 expiresAt 二选一
     */
    durationDays?: number;
};

