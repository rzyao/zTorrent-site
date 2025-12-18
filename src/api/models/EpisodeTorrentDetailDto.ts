/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EpisodeTorrentDetailDto = {
    /**
     * 种子ID
     */
    id: string;
    /**
     * 种子名称
     */
    name: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 副标题
     */
    subTitle?: string;
    /**
     * 分辨率
     */
    standard?: string;
    /**
     * 视频编码
     */
    videoCodec?: string;
    /**
     * 音频编码
     */
    audioCodec?: string;
    /**
     * 文件大小（字节）
     */
    size: string;
    /**
     * 做种人数
     */
    seeders: number;
    /**
     * 下载人数
     */
    downloads: number;
    /**
     * 封面URL
     */
    cover?: string;
    /**
     * 制作组
     */
    productionTeam?: string;
    /**
     * 片源
     */
    source?: string;
    /**
     * 上传时间
     */
    uploadedAt: string;
};

