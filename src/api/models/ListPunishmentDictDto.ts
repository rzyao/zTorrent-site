/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListPunishmentDictDto = {
    /**
     * 字典类别
     */
    category: ListPunishmentDictDto.category;
    /**
     * 搜索关键词 (匹配 key/label/description)
     */
    search?: string;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 页码
     */
    page?: number;
    /**
     * 每页数量
     */
    limit?: number;
};
export namespace ListPunishmentDictDto {
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

