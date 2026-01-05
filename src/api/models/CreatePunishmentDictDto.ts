/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePunishmentDictDto = {
    /**
     * 字典类别
     */
    category: CreatePunishmentDictDto.category;
    /**
     * 选项键值
     */
    key: string;
    /**
     * 显示标签
     */
    label: string;
    /**
     * 描述说明
     */
    description?: string;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 排序权重
     */
    sort?: number;
};
export namespace CreatePunishmentDictDto {
    /**
     * 字典类别
     */
    export enum category {
        BAN_DAYS = 'BAN_DAYS',
        BAN_REASON = 'BAN_REASON',
        PUNISHMENT_TYPE = 'PUNISHMENT_TYPE',
        UNBAN_REASON = 'UNBAN_REASON',
    }
}

