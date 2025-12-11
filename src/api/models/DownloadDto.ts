/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DownloadDto = {
    /**
     * 下载器ID
     */
    id: string;
    /**
     * 种子链接（Magnet或URL）
     */
    url: string;
    /**
     * 保存路径
     */
    path?: string;
    /**
     * 保存路径后缀（将追加到path后）
     */
    pathSuffix?: string;
    /**
     * 标签/分类
     */
    tag?: string;
    /**
     * 标签后缀（目前通常不追加到标签名，视具体实现而定，当前实现暂忽略或简单拼接）
     */
    tagSuffix?: string;
    /**
     * 是否添加后立即开始
     */
    start?: boolean;
};

