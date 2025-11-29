/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSimpleTorrentDto = {
    version: string;
    size: string;
    quality: string;
    source: string;
    codec: string;
    audio: string;
    isFree: boolean;
    isVip: boolean;
    uploadDate: string;
    /**
     * 必填：torrent 文件Base64
     */
    fileBase64: string;
};

