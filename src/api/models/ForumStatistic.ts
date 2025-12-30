/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForumStatistic = {
    /**
     * 统计日期
     */
    date: string;
    /**
     * 统计周期类型
     */
    type: ForumStatistic.type;
    /**
     * 今日新增话题数
     */
    newTopics: number;
    /**
     * 今日新增回复数
     */
    newPosts: number;
    /**
     * 今日活跃用户数
     */
    activeUsers: number;
    /**
     * 今日新注册用户数
     */
    newUsers: number;
    /**
     * 全站总浏览量
     */
    totalViews: number;
    /**
     * 热门话题 ID 列表
     */
    hotTopicIds: Array<string> | null;
    /**
     * 活跃用户 ID 列表
     */
    activeUserIds: Array<string> | null;
};
export namespace ForumStatistic {
    /**
     * 统计周期类型
     */
    export enum type {
        DAILY = 'daily',
        WEEKLY = 'weekly',
        MONTHLY = 'monthly',
    }
}

