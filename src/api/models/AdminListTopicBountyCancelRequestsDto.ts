/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminListTopicBountyCancelRequestsDto = {
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
    /**
     * 筛选取消申请状态
     */
    cancelRequestStatus?: AdminListTopicBountyCancelRequestsDto.cancelRequestStatus;
};
export namespace AdminListTopicBountyCancelRequestsDto {
    /**
     * 筛选取消申请状态
     */
    export enum cancelRequestStatus {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
        NONE = 'none',
    }
}

