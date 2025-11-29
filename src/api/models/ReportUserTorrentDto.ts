/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportUserTorrentDto = {
    /**
     * 种子ID（camelCase），兼容 torrent_id
     */
    torrentId: string;
    /**
     * 是否正在做种（camelCase），兼容 is_seeding
     */
    isSeeding?: boolean;
    /**
     * 是否下载完成（camelCase），兼容 is_completed
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
     * 总做种时长（秒）（camelCase），兼容 seed_time_total
     */
    seedTimeTotal?: number;
};

