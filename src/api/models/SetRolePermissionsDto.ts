/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SetRolePermissionsDto = {
    /**
     * 角色key
     */
    roleKey: string;
    /**
     * 权限key列表（覆盖式设置）
     */
    permissionKeys: Array<string>;
};

