/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DownloadSubtitleDto } from '../models/DownloadSubtitleDto';
import type { GetSubtitleDto } from '../models/GetSubtitleDto';
import type { ListSubtitlesDto } from '../models/ListSubtitlesDto';
import type { UploadSubtitleDto } from '../models/UploadSubtitleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubtitlesService {
    /**
     * 查询字幕列表（搜索/筛选/排序/分页）
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static subtitlesControllerList(
        requestBody: ListSubtitlesDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subtitles/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 获取字幕详情
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static subtitlesControllerDetail(
        requestBody: GetSubtitleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subtitles/detail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 下载字幕文件（二进制）
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static subtitlesControllerDownload(
        requestBody: DownloadSubtitleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subtitles/download',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 发布上传字幕（multipart）
     * @param formData
     * @returns any
     * @throws ApiError
     */
    public static subtitlesControllerUpload(
        formData: UploadSubtitleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subtitles/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * 点赞字幕（不返回计数）
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static subtitlesControllerLike(
        requestBody: GetSubtitleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subtitles/like',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 举报字幕（不返回计数）
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static subtitlesControllerReport(
        requestBody: GetSubtitleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subtitles/report',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 统计卡片数据
     * @returns any
     * @throws ApiError
     */
    public static subtitlesControllerStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subtitles/stats',
        });
    }
}
