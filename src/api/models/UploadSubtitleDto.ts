/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UploadSubtitleDto = {
    /**
     * 字幕文件（二进制）
     */
    file: Blob;
    /**
     * 字幕名称
     */
    name: string;
    /**
     * 字幕类型
     */
    type: UploadSubtitleDto.type;
    /**
     * 语言代码：zh|zh-TW|en|jp|kr
     */
    language: string;
    /**
     * 关联种子ID
     */
    torrentId: string;
    /**
     * 字幕说明
     */
    description?: string;
};
export namespace UploadSubtitleDto {
    /**
     * 字幕类型
     */
    export enum type {
        SRT = 'SRT',
        ASS = 'ASS',
        SSA = 'SSA',
        SUB = 'SUB',
    }
}

