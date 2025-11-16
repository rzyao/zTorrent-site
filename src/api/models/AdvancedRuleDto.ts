/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdvancedRuleDto = {
    /**
     * 字段名
     */
    field: string;
    /**
     * 规则
     */
    op: AdvancedRuleDto.op;
    /**
     * 匹配值（除 Between / Is Null / Is Not Null 外）
     */
    value?: Record<string, any>;
    /**
     * 范围值（两个元素），用于 Between
     */
    range?: Array<string>;
};
export namespace AdvancedRuleDto {
    /**
     * 规则
     */
    export enum op {
        EQUAL = 'Equal',
        NOT_EQUAL = 'Not Equal',
        LIKE = 'Like',
        NOT_LIKE = 'Not Like',
        LIKE_LEFT = 'Like Left',
        LIKE_RIGHT = 'Like Right',
        NOT_IN = 'Not In',
        IN = 'In',
        BETWEEN = 'Between',
        GREATER_THAN = 'Greater Than',
        GREATER_THAN_OR_EQUAL = 'Greater Than or Equal',
        LESS_THAN = 'Less Than',
        LESS_THAN_OR_EQUAL = 'Less Than or Equal',
        IS_NULL = 'Is Null',
        IS_NOT_NULL = 'Is Not Null',
    }
}

