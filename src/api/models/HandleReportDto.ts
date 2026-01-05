/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HandleReportDto = {
    /**
     * 举报 ID
     */
    reportId: string;
    /**
     * 处理状态
     */
    status: HandleReportDto.status;
    /**
     * 处理备注
     */
    handlerNote?: string;
    /**
     * 是否删除被举报的内容 (话题/回复)
     */
    deleteContent?: boolean;
    /**
     * 是否锁定相关话题 (仅当删除回复时)
     */
    lockTopic?: boolean;
};
export namespace HandleReportDto {
    /**
     * 处理状态
     */
    export enum status {
        RESOLVED = 'resolved',
        REJECTED = 'rejected',
    }
}

