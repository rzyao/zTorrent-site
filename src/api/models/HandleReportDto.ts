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

