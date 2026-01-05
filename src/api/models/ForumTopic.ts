/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForumTopic = {
    /**
     * 话题标题
     */
    title: string;
    /**
     * 话题内容 (Markdown)
     */
    content: string;
    /**
     * 浏览量
     */
    views: number;
    /**
     * 回复数量
     */
    replyCount: number;
    /**
     * 是否置顶
     */
    isPinned: boolean;
    /**
     * 是否热门
     */
    isTrending: boolean;
    /**
     * 是否锁定
     */
    isLocked: boolean;
    /**
     * 全局置顶
     */
    isGlobalPinned: boolean;
    /**
     * 全站横幅
     */
    isBanner: boolean;
    /**
     * 是否归档
     */
    isArchived: boolean;
    /**
     * 最后回复时间
     */
    lastReplyAt: string;
    /**
     * 分类 ID
     */
    categoryId: string;
    /**
     * 作者 ID
     */
    authorId: string;
};

