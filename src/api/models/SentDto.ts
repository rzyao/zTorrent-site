/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SentDto = {
    sent: boolean;
    /**
     * 验证码过期时间（分钟）
     */
    expiresMinutes: number;
    /**
     * 验证码过期时间（秒）
     */
    expiresSeconds: number;
    /**
     * 验证码过期的绝对时间（ISO）
     */
    expireAt: string;
};

