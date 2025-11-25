/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportUserTorrentDto = {
    /**
     * 种子ID（snake_case）
     */
    torrent_id: string;
    /**
     * 是否正在做种（snake_case）
     */
    is_seeding?: boolean;
    /**
     * 是否下载完成（snake_case）
     */
    is_completed?: boolean;
    /**
     * 已下载量（bigint字符串）
     */
    downloaded?: string;
    /**
     * 已上传量（bigint字符串）
     */
    uploaded?: string;
    /**
     * 总做种时长（秒）（snake_case）
     */
    seed_time_total?: number;
};

