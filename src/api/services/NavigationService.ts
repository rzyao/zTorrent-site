/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NavigationResponseDto } from '../models/NavigationResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NavigationService {
    /**
     * 获取用户导航菜单
     * @returns any 成功
     * @throws ApiError
     */
    public static navigationControllerGetUserNavigation(): CancelablePromise<{
        code?: number;
        message?: string;
        data?: NavigationResponseDto;
        path?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/navigation',
        });
    }
}
