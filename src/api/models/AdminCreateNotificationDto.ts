/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminCreateNotificationDto = {
    /**
     * 通知类型
     */
    type: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 内容
     */
    content: string;
    /**
     * 内容格式
     */
    contentFormat: AdminCreateNotificationDto.contentFormat;
    /**
     * 附件URL列表
     */
    attachments?: Array<string>;
};
export namespace AdminCreateNotificationDto {
    /**
     * 内容格式
     */
    export enum contentFormat {
        PLAIN = 'plain',
        MARKDOWN = 'markdown',
        HTML = 'html',
    }
}

