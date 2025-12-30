/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForumPost = {
    /**
     * 回复内容 (Markdown)
     */
    content: string;
    /**
     * 楼层号
     */
    floor: number;
    /**
     * 是否为系统消息
     */
    isSystem: boolean;
    /**
     * 所属话题 ID
     */
    topicId: string;
    /**
     * 作者 ID
     */
    authorId: string;
    /**
     * 回复目标 ID
     */
    replyToId: string | null;
};

