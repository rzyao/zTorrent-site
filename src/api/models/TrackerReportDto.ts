/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackerReportDto = {
    /**
     * 用户ID
     */
    userId: string;
    /**
     * 种子ID
     */
    torrentId?: string;
    /**
     * infoHash
     */
    infoHash?: string;
    /**
     * 本次上报的上传增量（字节）
     */
    deltaUploaded: string;
    /**
     * 本次上报的下载增量（字节）
     */
    deltaDownloaded: string;
    /**
     * 当前是否做种
     */
    isSeeding?: boolean;
    /**
     * 事件
     */
    event?: TrackerReportDto.event;
    /**
     * announce 间隔秒数
     */
    announceIntervalSec?: number;
};
export namespace TrackerReportDto {
    /**
     * 事件
     */
    export enum event {
        STARTED = 'started',
        COMPLETED = 'completed',
        STOPPED = 'stopped',
    }
}

