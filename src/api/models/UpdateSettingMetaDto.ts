/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateSettingMetaDto = {
    /**
     * 设置键
     */
    key: string;
    /**
     * 重命名后的键（可选）
     */
    newKey?: string;
    /**
     * 显示描述
     */
    description?: string;
    /**
     * 类型
     */
    type?: UpdateSettingMetaDto.type;
    /**
     * 分组
     */
    group?: string;
    /**
     * 是否允许运行时修改（仅影响提示与校验）
     */
    mutable?: boolean;
    /**
     * 分组内排序（越小越靠前）
     */
    sort?: number;
    /**
     * JSON Schema 字符串
     */
    jsonSchema?: string;
};
export namespace UpdateSettingMetaDto {
    /**
     * 类型
     */
    export enum type {
        STRING = 'string',
        NUMBER = 'number',
        BOOLEAN = 'boolean',
        JSON = 'json',
        TIMESTAMP = 'timestamp',
        RATE = 'rate',
        PASSWORD = 'password',
    }
}

