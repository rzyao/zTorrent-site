/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminCreateTargetedNotificationDto = {
    /**
     * 目标用户ID
     */
    userId: string;
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
    contentFormat: AdminCreateTargetedNotificationDto.contentFormat;
    /**
     * 附件URL列表
     */
    attachments?: Array<string>;
};
export namespace AdminCreateTargetedNotificationDto {
    /**
     * 内容格式
     */
    export enum contentFormat {
        PLAIN = 'plain',
        MARKDOWN = 'markdown',
        HTML = 'html',
    }
}

