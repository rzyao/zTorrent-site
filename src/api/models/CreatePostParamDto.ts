/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePostParamDto = {
    /**
     * 回复内容 (Markdown)
     */
    content: string;
    /**
     * 回复目标的 ID (用于引用回复)
     */
    replyToId?: string;
    /**
     * 所属话题唯一标识符
     */
    topicId: string;
};

