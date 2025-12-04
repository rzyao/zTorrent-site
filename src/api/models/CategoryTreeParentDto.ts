/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryTreeChildDto } from './CategoryTreeChildDto';
export type CategoryTreeParentDto = {
    id: string;
    key: string;
    label: string;
    description?: Record<string, any> | null;
    enabled: boolean;
    isDefault?: boolean;
    sort: number;
    type: string;
    children: Array<CategoryTreeChildDto>;
};

