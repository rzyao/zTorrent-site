/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTorrentDto = {
    /**
     * 种子名称
     */
    name?: string;
    /**
     * 分类
     */
    category?: string;
    title?: string;
    subTitle?: string;
    year?: number;
    standard?: string;
    videoCodec?: string;
    audioCodec?: string;
    productionTeam?: string;
    region?: string;
    subtitleType?: string;
    /**
     * 语言类型
     */
    language?: string;
    imdbUrl?: string;
    doubanUrl?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 封面附件ID
     */
    coverAttachmentId?: string;
    mediaInfo?: string;
    /**
     * 剧照附件ID数组
     */
    stillAttachmentIds?: Array<string>;
    source?: string;
    price?: number;
    /**
     * 标签数组
     */
    tags?: Array<string>;
    /**
     * 徽章数组：热门、典藏、推荐
     */
    badges?: Array<string>;
    /**
     * IMDb评分 0-10
     */
    imdbRating?: number;
    /**
     * 豆瓣评分 0-10
     */
    doubanRating?: number;
    /**
     * 种子ID
     */
    id: string;
    /**
     * 是否匿名
     */
    isAnonymous?: boolean;
    /**
     * 是否启用
     */
    isEnabled?: boolean;
    /**
     * 是否可见
     */
    visible?: boolean;
    /**
     * 是否被封禁
     */
    isBanned?: boolean;
    /**
     * 是否 H&R
     */
    isHr?: boolean;
    approvalStatus?: string;
    /**
     * 审批时间
     */
    approvedAt?: string;
    /**
     * 多文件列表
     */
    multiFileList?: Array<string>;
    nfoPath?: string;
};

