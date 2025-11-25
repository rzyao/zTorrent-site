/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateForumPostDto = {
    /**
     * 主题ID
     */
    threadId: string;
    /**
     * 回复内容
     */
    content: string;
    /**
     * 父回复ID（楼中楼可选）
     */
    parentId?: string;
};

