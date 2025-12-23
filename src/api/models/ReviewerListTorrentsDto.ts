/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewerListTorrentsDto = {
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
    /**
     * 审核状态过滤
     */
    approvalStatus?: ReviewerListTorrentsDto.approvalStatus;
    /**
     * 按上传者ID过滤
     */
    uploaderId?: string;
    /**
     * 按分类过滤
     */
    category?: string;
    /**
     * 搜索关键词（模糊匹配标题和副标题）
     */
    keyword?: string;
    /**
     * 上传时间起始（ISO 8601 格式）
     */
    uploadDateStart?: string;
    /**
     * 上传时间截止（ISO 8601 格式）
     */
    uploadDateEnd?: string;
    /**
     * 按审核人ID过滤（查看指定审核员审核过的种子）
     */
    reviewerId?: string;
    /**
     * 排序字段
     */
    sortBy?: ReviewerListTorrentsDto.sortBy;
    /**
     * 排序方向
     */
    order?: ReviewerListTorrentsDto.order;
};
export namespace ReviewerListTorrentsDto {
    /**
     * 审核状态过滤
     */
    export enum approvalStatus {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
        ALL = 'all',
    }
    /**
     * 排序字段
     */
    export enum sortBy {
        UPLOADED_AT = 'uploadedAt',
        APPROVED_AT = 'approvedAt',
        SIZE = 'size',
    }
    /**
     * 排序方向
     */
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
}

