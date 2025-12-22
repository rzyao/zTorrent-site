/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendMailDto = {
    /**
     * 收件人邮箱
     */
    to: string;
    /**
     * 邮件主题
     */
    subject: string;
    /**
     * 纯文本内容
     */
    text?: string;
    /**
     * HTML内容
     */
    html?: string;
};

