/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DownloadPathDto } from './DownloadPathDto';
export type UpdateDownloaderDto = {
    /**
     * 下载器ID
     */
    id: string;
    /**
     * 显示名称
     */
    name: string;
    /**
     * 下载器类型
     */
    type: UpdateDownloaderDto.type;
    /**
     * 主机地址
     */
    host: string;
    /**
     * 端口（正整数）
     */
    port: number;
    /**
     * 用户名（可选）
     */
    username?: string;
    /**
     * 密码（可选）
     */
    password?: string;
    /**
     * 是否启用 SSL/TLS
     */
    ssl: boolean;
    /**
     * 分类列表
     */
    categories?: Array<string>;
    /**
     * 下载路径列表
     */
    downloadPaths?: Array<DownloadPathDto>;
};
export namespace UpdateDownloaderDto {
    /**
     * 下载器类型
     */
    export enum type {
        Q_BITTORRENT = 'qBittorrent',
        TRANSMISSION = 'Transmission',
        DELUGE = 'Deluge',
        R_TORRENT = 'rTorrent',
    }
}

