/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SettingItemDto = {
    /**
     * 自增主键
     */
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    key: string;
    value: string;
    comment: Record<string, any> | null;
    type: SettingItemDto.type;
    group: string;
    /**
     * 分组内排序值：越小越靠前
     */
    sort: number;
    description: Record<string, any> | null;
    mutable: number;
    jsonSchema: Record<string, any> | null;
    updatedBy: Record<string, any> | null;
    version: number;
};
export namespace SettingItemDto {
    export enum type {
        STRING = 'string',
        NUMBER = 'number',
        BOOLEAN = 'boolean',
        JSON = 'json',
        DATETIME = 'datetime',
        RATE = 'rate',
        PASSWORD = 'password',
    }
}

