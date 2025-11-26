/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReplyMessageDto = {
    /**
     * 会话对端用户ID
     */
    peerUserId: string;
    /**
     * 被回复的消息ID
     */
    replyToMessageId: string;
    /**
     * 回复内容
     */
    content: string;
    /**
     * 内容格式
     */
    format?: ReplyMessageDto.format;
    /**
     * 附件URL列表
     */
    attachments?: Array<string>;
};
export namespace ReplyMessageDto {
    /**
     * 内容格式
     */
    export enum format {
        PLAIN = 'plain',
        MARKDOWN = 'markdown',
        HTML = 'html',
    }
}

