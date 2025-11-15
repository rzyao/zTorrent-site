/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RevokePunishmentDto = {
    /**
     * 处罚记录ID
     */
    id: string;
    /**
     * 撤销原因（字典键或手动键）
     */
    revokeReason: string;
    /**
     * 撤销说明（可选）
     */
    revokeDetailReason?: string;
};

