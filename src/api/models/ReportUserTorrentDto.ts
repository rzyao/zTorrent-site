/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportUserTorrentDto = {
    /**
     * 种子ID
     */
    torrentId: string;
    /**
     * 是否正在做种
     */
    isSeeding?: boolean;
    /**
     * 是否下载完成
     */
    isCompleted?: boolean;
    /**
     * 已下载量（bigint字符串）
     */
    downloaded?: string;
    /**
     * 已上传量（bigint字符串）
     */
    uploaded?: string;
    /**
     * 总做种时长（秒）
     */
    seedTimeTotal?: number;
};

