/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type QueryReportDto = {
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
    /**
     * 状态筛选 (可选)
     */
    status?: QueryReportDto.status;
};
export namespace QueryReportDto {
    /**
     * 状态筛选 (可选)
     */
    export enum status {
        PENDING = 'pending',
        RESOLVED = 'resolved',
        REJECTED = 'rejected',
    }
}

