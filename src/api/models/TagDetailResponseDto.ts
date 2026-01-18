/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumTagGroup } from './ForumTagGroup';
export type TagDetailResponseDto = {
    /**
     * 标签 ID
     */
    id: string;
    /**
     * 创建时间
     */
    createdAt: string;
    /**
     * 更新时间
     */
    updatedAt: string;
    /**
     * 删除时间 (软删除)
     */
    deletedAt: Record<string, any> | null;
    /**
     * 标签名称
     */
    name: string;
    /**
     * 使用次数统计
     */
    usageCount: number;
    /**
     * 标签归属的标签组列表
     */
    groups: Array<ForumTagGroup>;
};

