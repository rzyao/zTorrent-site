/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTorrentCommentDto = {
    /**
     * 种子ID
     */
    torrentId: string;
    /**
     * 评论内容
     */
    content: string;
    /**
     * 父评论ID
     */
    parentId?: string;
};

