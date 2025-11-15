/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApplyPunishmentDto = {
    /**
     * 目标用户ID
     */
    userId: string;
    /**
     * 处罚类型（例如：ban_login、mute 等）
     */
    type: string;
    /**
     * 处罚原因（字典键或手动键）
     */
    reason: string;
    /**
     * 处罚说明（可选，手动输入）
     */
    detailReason?: string;
    /**
     * 处罚时长（单位：天）
     */
    durationDays: number;
};

