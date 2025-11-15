/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendReportDto = {
    /**
     * 收件人邮箱地址
     */
    to: string;
    /**
     * 邮件主题
     */
    subject: string;
    /**
     * 纯文本正文
     */
    text?: string;
    /**
     * HTML 正文
     */
    html?: string;
};

