/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListPostsByTopicDto = {
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
    /**
     * 话题唯一标识符
     */
    topicId: string;
    /**
     * 目标楼层号，返回包含该楼层的上下文页。若提供，将自动计算目标页码。
     */
    nearPost?: number;
};

