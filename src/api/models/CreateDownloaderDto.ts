/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateDownloaderDto = {
    /**
     * 显示名称
     */
    name: string;
    /**
     * 下载器类型
     */
    type: CreateDownloaderDto.type;
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
};
export namespace CreateDownloaderDto {
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

