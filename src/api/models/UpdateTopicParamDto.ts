/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTopicParamDto = {
    /**
     * 话题标题
     */
    title?: string;
    /**
     * 话题内容 (Markdown)
     */
    content?: string;
    /**
     * 所属分类 ID
     */
    categoryId?: string;
    /**
     * 标签名称列表
     */
    tagNames?: Array<string>;
    /**
     * 话题唯一标识符
     */
    id: string;
};

