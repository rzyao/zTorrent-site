/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewHistoryDto = {
    /**
     * 审核结果状态
     */
    status: ReviewHistoryDto.status;
    /**
     * 上传者ID筛选
     */
    uploaderId?: string;
    /**
     * 开始时间 (ISO)
     */
    startAt?: string;
    /**
     * 结束时间 (ISO)
     */
    endAt?: string;
    /**
     * 页码
     */
    page: number;
    /**
     * 每页数量
     */
    limit: number;
};
export namespace ReviewHistoryDto {
    /**
     * 审核结果状态
     */
    export enum status {
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

