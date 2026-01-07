/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BindRoutePermissionsDto } from '../models/BindRoutePermissionsDto';
import type { CreateRouteDto } from '../models/CreateRouteDto';
import type { CreateRouteResponseDto } from '../models/CreateRouteResponseDto';
import type { DeleteRouteDto } from '../models/DeleteRouteDto';
import type { Object } from '../models/Object';
import type { RouteTreeNodeDto } from '../models/RouteTreeNodeDto';
import type { SortRoutesDto } from '../models/SortRoutesDto';
import type { UpdateRouteDto } from '../models/UpdateRouteDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlatformAdminRoutesService {
    /**
     * 获取完整路由树
     * @returns any 完整路由树列表
     * @throws ApiError
     */
    public static adminRoutesControllerGetFullTree(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: RouteTreeNodeDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/routes/tree',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 创建路由节点
     * @param requestBody
     * @returns any 创建成功
     * @throws ApiError
     */
    public static adminRoutesControllerCreate(
        requestBody: CreateRouteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: CreateRouteResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/routes/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 更新路由节点
     * @param requestBody
     * @returns any 更新成功
     * @throws ApiError
     */
    public static adminRoutesControllerUpdate(
        requestBody: UpdateRouteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/routes/update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 删除路由节点
     * @param requestBody
     * @returns any 删除成功
     * @throws ApiError
     */
    public static adminRoutesControllerDelete(
        requestBody: DeleteRouteDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/routes/delete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 批量更新路线排序
     * @param requestBody
     * @returns any 排序更新成功
     * @throws ApiError
     */
    public static adminRoutesControllerSort(
        requestBody: SortRoutesDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/routes/sort',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
    /**
     * 绑定路由权限
     * @param requestBody
     * @returns any 权限绑定成功
     * @throws ApiError
     */
    public static adminRoutesControllerBindPermissions(
        requestBody: BindRoutePermissionsDto,
    ): CancelablePromise<{
        code?: number;
        message?: string;
        data?: Object;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/routes/bind-permissions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数错误`,
                401: `未认证`,
                403: `禁止访问或账号禁用`,
                404: `资源不存在`,
                500: `服务器错误`,
            },
        });
    }
}
