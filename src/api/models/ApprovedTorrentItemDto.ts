/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TorrentCreatorDto } from './TorrentCreatorDto';
export type ApprovedTorrentItemDto = {
    /**
     * 种子ID
     */
    id: string;
    /**
     * 种子名称
     */
    name: string;
    /**
     * 标题
     */
    title: Record<string, any> | null;
    /**
     * 副标题
     */
    subTitle: Record<string, any> | null;
    /**
     * 封面图
     */
    cover: Record<string, any> | null;
    /**
     * 上传者ID
     */
    uploaderId: string;
    /**
     * 审批时间
     */
    approvedAt: string;
    /**
     * 创建时间
     */
    createdAt: string;
    /**
     * 上传者信息
     */
    creator: TorrentCreatorDto | null;
};

