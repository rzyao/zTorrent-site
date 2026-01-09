import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/modules/app/components/ui/dialog";
import {
  Download,
  Upload,
  Star,
  MessageSquare,
  Flag,
  Bookmark,
  Share2,
  ThumbsUp,
  Info,
  Heart,
  X,
  UserRoundCheck,
  ChevronUp,
  ChevronDown,
  XIcon,
} from "lucide-react";
import ActionBtn from "@/modules/app/components/ActionBtn";
import { PageContainer } from "@/modules/app/components/PageContainer";
import { Button } from "@/modules/app/components/ui/button";
import { Badge } from "@/modules/app/components/ui/badge";
import { Separator } from "@/modules/app/components/ui/separator";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { useParams } from "react-router-dom";
import { TorrentsSearchService } from "@/api/services/TorrentsSearchService";
import { DownloadsService } from "@/api/services/DownloadsService";
import { FavoriteActionDto } from "@/api";
import { useFavorite } from "@/modules/app/hooks/useFavorite";
import { useTorrentDownload } from "@/modules/app/hooks/useTorrentDownload";
import { formatSize } from "@/utils/format";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/modules/app/components/ui/carousel";
// 引入项目已封装的 Context Menu 组件，用于在详情弹窗中右键显示菜单
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/modules/app/components/ui/context-menu";
import { DownloadToDownloaderModal } from "@/modules/app/components/DownloadToDownloaderModal";

import { useDownloaders } from "@/modules/app/context/DownloadersContext";
import { DownloadersService } from "@/api/services/DownloadersService";
import { customToast } from "@/hooks/useToast";
import { useSourceTracker } from "@/modules/app/hooks/useSourceTracker";

import {
  DescriptionData,
  TorrentDetailPageProps,
  TorrentData,
  FileItem,
  Comment,
  RelatedTorrent,
  EnglishMovieInfo,
} from "./types";
import { processDescription } from "@/utils/cn/processDescription";
import { FileListItem } from "./components/FileListItem";

export default function TorrentDetailPage({ torrentId }: TorrentDetailPageProps) {
  const { downloadByTorrentId } = useTorrentDownload();
  const { downloaders } = useDownloaders();
  const { sourcePayload } = useSourceTracker();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const effectiveId = torrentId ?? id;

  // 收藏状态
  const {
    isFavorite,
    toggle: toggleFavorite,
    isLoading: isFavoriteLoading,
  } = useFavorite({
    targetType: FavoriteActionDto.targetType.TORRENT,
    targetId: String(effectiveId),
    enabled: !!effectiveId,
  });
  const [isDescExpanded, setIsDescExpanded] = useState(true);
  const [isMediaInfoExpanded, setIsMediaInfoExpanded] = useState(false);
  const [isFilesExpanded, setIsFilesExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [torrentData, setTorrentData] = useState<TorrentData>({
    id: 0,
    title: "",
    subTitle: "",
    category: "",
    videoCodec: "",
    standard: "",
    audioCodec: "",
    medium: "",
    productionTeam: "",
    size: "",
    uploadDate: "",
    seeders: 0,
    leechers: 0,
    completed: 0,
    comments: 0,
    thanks: 0,
    rating: 0,
    imdb: "",
    douban: "",
    uploader: "",
    uploaderLevel: "",
    isFree: false,
    promotionEnd: "",
    views: 0,
    description: "",
    downloadUrl: "",
  });
  const [descriptionData, setDescriptionData] = useState<DescriptionData>({
    SourceInfo: [],
    MovieInfo: {} as EnglishMovieInfo,
    Synopsis: "",
  });

  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);

  const [relatedTorrents, setRelatedTorrents] = useState<RelatedTorrent[]>([]);

  const [mediaInfo, setMediaInfo] = useState("");

  const [stills, setStills] = useState<string[]>([]);
  const preloadRefs = useRef<HTMLImageElement[]>([]);

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxApi, setLightboxApi] = useState<CarouselApi | null>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  /**
   * 自动切换轮播图
   */
  useEffect(() => {
    if (!carouselApi) return;
    if (!Array.isArray(stills) || stills.length <= 1) return;
    const id = setInterval(() => {
      carouselApi?.scrollNext();
    }, 3000);
    return () => clearInterval(id);
  }, [carouselApi, stills]);

  /**
   * 点击图片时切换到对应索引的轮播图
   */
  useEffect(() => {
    if (!lightboxApi) return;
    lightboxApi.scrollTo(lightboxIndex);
  }, [lightboxApi, lightboxIndex]);

  useEffect(() => {
    let cancelled = false;
    const num = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const str = (v: any) => String(v ?? "");
    const load = async () => {
      if (!effectiveId) return;
      try {
        setLoading(true);
        setError(null);
        const resp = await TorrentsSearchService.torrentSearchControllerDetail({
          id: String(effectiveId),
        });
        const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
        const data: any = body?.data ?? body;
        const mapped = {
          id: data?.id,
          title: str(data?.title),
          subTitle: str(data?.subTitle),
          category: str(data?.category),
          videoCodec: str(data?.videoCodec),
          standard: str(data?.standard),
          audioCodec: str(data?.audioCodec),
          medium: str(data?.source),
          productionTeam: str(data?.productionTeam),
          size: str(data?.size),
          uploadDate: str(data?.uploadDate),
          seeders: num(data?.seeders),
          leechers: num(data?.leechers),
          completed: num(data?.completed),
          comments: num(data?.comments),
          thanks: num(data?.thanks),
          rating: num(data?.rating),
          imdb: str(data?.imdb),
          douban: str(data?.douban),
          uploader: str(data?.uploader),
          uploaderLevel: str(data?.uploaderLevel),
          isFree: Boolean(data?.isFree),
          promotionEnd: str(data?.promotionEnd),
          views: num(data?.views),
          description: str(data?.description),
          // 字段重命名兼容：后端可能将 downloadUrl 重命名为 downloadURL / download_link / download
          // 这里进行多键回退以确保下载按钮可用
          downloadUrl: str(
            data?.downloadUrl ?? data?.downloadURL ?? data?.download_link ?? data?.download,
          ),
          isFavorited: !!data?.isFavorited,
        };
        if (!cancelled) {
          setTorrentData(mapped);
          // 注入缓存以优化 FavoriteButton 初始加载
          if (data?.isFavorited !== undefined) {
            queryClient.setQueryData(
              ["favorites", "check", FavoriteActionDto.targetType.TORRENT, String(effectiveId)],
              !!data.isFavorited,
            );
          }
        }
        let rawFiles: any[] = [];
        try {
          if (typeof data?.multiFileList === "string") {
            rawFiles = JSON.parse(data.multiFileList);
          } else if (Array.isArray(data?.multiFileList)) {
            rawFiles = data.multiFileList;
          }
        } catch (e) {
          console.error("Failed to parse multiFileList", e);
        }

        const files = Array.isArray(rawFiles)
          ? rawFiles.map((f: any) => {
              // 处理 multiFileList 可能为 ["filename1", "filename2"] 字符串数组的情况
              if (typeof f === "string") {
                return {
                  name: f,
                  size: "未知", // 纯文件名列表无大小信息
                  type: "file" as const,
                };
              }
              // 处理可能的对象结构 {name:..., size:...}
              return {
                name: str(f?.name),
                size: str(f?.size),
                type: "file" as const,
              };
            })
          : [];
        if (!cancelled) setFileList(files);
        const mi = str(data?.mediaInfo ?? mediaInfo);
        if (!cancelled) setMediaInfo(mi);
        const cmts = Array.isArray(data?.comments)
          ? data.comments.map((c: any, i: number) => ({
              id: c?.id ?? i,
              user: str(c?.user ?? c?.username ?? ""),
              userLevel: str(c?.userLevel ?? ""),
              avatar: str(c?.avatar ?? ""),
              date: str(c?.date ?? ""),
              content: str(c?.content ?? ""),
              thanks: num(c?.thanks ?? 0),
            }))
          : comments;
        if (!cancelled) setComments(cmts);
        const rel = Array.isArray(data?.relatedTorrents)
          ? data.relatedTorrents.map((t: any) => ({
              id: t?.id,
              title: str(t?.title ?? ""),
              size: str(t?.size ?? ""),
              seeders: num(t?.seeders ?? 0),
              leechers: num(t?.leechers ?? 0),
              isFree: Boolean(t?.isFree ?? false),
            }))
          : relatedTorrents;
        if (!cancelled) setRelatedTorrents(rel);
        const stillsData = Array.isArray(data?.stills) ? data.stills.map((s: any) => str(s)) : [];
        if (!cancelled) setStills(stillsData);
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message ?? ""));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [effectiveId]);

  useEffect(() => {
    if (!Array.isArray(stills) || stills.length === 0) return;
    const arr: HTMLImageElement[] = [];
    for (const url of stills) {
      const img = new Image();
      (img as any).referrerPolicy = "no-referrer";
      img.src = url;
      if (typeof (img as any).decode === "function") {
        (img as any).decode().catch(() => {});
      }
      arr.push(img);
    }
    preloadRefs.current = arr;
  }, [stills]);

  /**
   * 发送到下载器
   */
  const handleSendToDownloader = async (downloaderId: string, path?: string) => {
    if (!effectiveId) return;
    try {
      // 1. 获取一次性下载链接
      const source = sourcePayload ?? { filmId: "", playListId: "" };
      const resp = await DownloadsService.downloadsControllerCreateDownloadUrl({
        torrentId: String(effectiveId),
        source,
      });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data = body?.data ?? body;
      const downloadTokenUrl = String(data?.url ?? "");

      if (!downloadTokenUrl) {
        customToast.error("无法生成下载链接");
        return;
      }

      // 2. 发送到下载器
      await DownloadersService.downloadersControllerDownload({
        id: downloaderId,
        url: downloadTokenUrl,
        path: path, // Optional
      });

      customToast.success("已发送至下载器");
    } catch (e: any) {
      const msg = e?.message || "发送失败";
      customToast.error(msg);
    }
  };

  // 使用 ContextMenu 包裹整个详情页区域，使右键触发菜单
  return (
    <>
      <ContextMenu>
        {/* 将最外层容器作为触发器，右键弹出菜单；asChild 保留原有 DOM 结构与样式 */}
        <ContextMenuTrigger className="block min-h-screen w-full">
          <PageContainer>
            <div className="mx-auto max-w-[1400px]">
              {/* 标题区域 */}
              <div className="mb-6">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="mb-2 text-2xl text-white md:text-3xl">{torrentData.title}</h1>
                    {torrentData.subTitle && (
                      <p className="text-lg text-white">{torrentData.subTitle}</p>
                    )}
                    {loading && <p className="text-sm text-gray-500">加载中...</p>}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                </div>

                {/* 标签和状态 */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="border border-amber-500/30 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                    {torrentData.category}
                  </Badge>
                  <Badge className="border border-orange-500/30 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
                    {torrentData.standard}
                  </Badge>
                  {torrentData.isFree && (
                    <Badge className="border border-green-500/30 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      FREE
                    </Badge>
                  )}
                  {Number.isFinite(torrentData.rating) && (
                    <div className="ml-2 flex items-center gap-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <span>{torrentData.rating}</span>
                    </div>
                  )}
                  {torrentData.isFree && (
                    <div className="ml-2 flex items-center gap-1 text-sm text-green-400">
                      <Info className="h-3 w-3" />
                      <span>限时免费至 {torrentData.promotionEnd}</span>
                    </div>
                  )}
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="text-gray-200">分类</span>
                  <span className="text-gray-200">{torrentData.category}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">媒介</span>
                  <span className="text-gray-200">{torrentData.medium}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">编码</span>
                  <span className="text-gray-200">{torrentData.videoCodec}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">分辨率</span>
                  <span className="text-gray-200">{torrentData.standard}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">音频</span>
                  <span className="text-gray-200">{torrentData.audioCodec}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">制作组</span>
                  <span className="text-gray-200">{torrentData.productionTeam}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">大小</span>
                  <span className="text-gray-200">{formatSize(torrentData.size)}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">发布时间</span>
                  <span className="text-gray-200">{torrentData.uploadDate}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">发布者</span>
                  <span className="text-gray-200">{torrentData.uploader}</span>
                  {torrentData.uploaderLevel && (
                    <Badge className="ml-1 border border-orange-500/30 bg-orange-500/20 text-xs text-orange-400">
                      {torrentData.uploaderLevel}
                    </Badge>
                  )}
                  {torrentData.imdb && (
                    <>
                      <span className="text-gray-600">|</span>
                      <a
                        href={`https://www.imdb.com/title/${torrentData.imdb}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                      >
                        IMDb: {torrentData.imdb}
                      </a>
                    </>
                  )}
                  {torrentData.douban && (
                    <>
                      <span className="text-gray-600">|</span>
                      <a
                        href={`https://movie.douban.com/subject/${torrentData.douban}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                      >
                        豆瓣: {torrentData.douban}
                      </a>
                    </>
                  )}
                </div>

                {/* 操作按钮和统计信息 */}
                <div className="flex flex-wrap items-center gap-3">
                  <ActionBtn
                    variant="amber"
                    mode="solid"
                    className="border-none bg-amber-600/90 bg-none"
                    onClick={() => {
                      if (downloaders.length > 0) {
                        setDownloadModalOpen(true);
                      } else {
                        downloadByTorrentId(
                          String(torrentData.id),
                          String(torrentData.title || "download"),
                        );
                      }
                    }}
                    icon={<Download className="h-4 w-4" />}
                  >
                    下载种子
                  </ActionBtn>
                  <ActionBtn
                    variant="red"
                    mode={isFavorite ? "solid" : "ghost"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite();
                    }}
                    loading={isFavoriteLoading}
                    icon={<Bookmark className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />}
                  >
                    {isFavorite ? "已收藏" : "收藏"}
                  </ActionBtn>
                  <ActionBtn variant="blue" mode="ghost" icon={<Share2 className="h-4 w-4" />}>
                    分享
                  </ActionBtn>
                  <ActionBtn variant="red" mode="ghost" icon={<Flag className="h-4 w-4" />}>
                    举报
                  </ActionBtn>

                  <Separator orientation="vertical" className="mx-1 h-6 bg-gray-700" />

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Upload className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">{torrentData.seeders}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">{torrentData.leechers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserRoundCheck className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{torrentData.completed}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* 主要内容区 */}
                <div className="space-y-6">
                  {/* 简介 */}
                  <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
                    <div
                      className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                    >
                      <h2 className="text-white">简介</h2>
                      {isDescExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    {isDescExpanded && (
                      <div className="p-6">
                        {/* PT风格的内容渲染 */}
                        {torrentData.description ? (
                          <div
                            className="description-content space-y-4 leading-relaxed text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: processDescription(torrentData.description),
                            }}
                          />
                        ) : (
                          <div className="space-y-4 leading-relaxed text-gray-300">
                            {/* 引用框 */}
                            <fieldset className="rounded border-2 border-amber-500/30 bg-amber-500/5 p-4">
                              <legend className="px-2 text-amber-400">引用</legend>
                              <div className="text-center text-amber-400">
                                <span className="text-xl">暂无简介信息</span>
                              </div>
                            </fieldset>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 剧照 */}
                  {Array.isArray(stills) && stills.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
                      <div className="border-b border-neutral-700/50 px-5 py-4">
                        <h2 className="text-white">剧照</h2>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {stills.map((url, index) => {
                            const isActive = lightboxOpen && lightboxIndex === index;
                            return (
                              <div
                                key={index}
                                className={
                                  isActive
                                    ? "fixed top-1/2 left-1/2 z-1000 h-full w-full -translate-x-1/2 -translate-y-1/2"
                                    : "group relative aspect-video cursor-pointer overflow-hidden rounded-lg"
                                }
                                onClick={() => {
                                  const i = preloadRefs.current[index];
                                  if (i && typeof (i as any).decode === "function") {
                                    (i as any).decode().catch(() => {});
                                  }
                                  setLightboxIndex(index);
                                  setLightboxOpen(true);
                                }}
                              >
                                <ImageWithFallback
                                  src={url}
                                  alt={`剧照 ${index + 1}`}
                                  ref={(el) => {
                                    imgRefs.current[index] = el;
                                  }}
                                  className={
                                    isActive
                                      ? "h-full w-full object-contain"
                                      : "h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  }
                                />
                                {isActive && (
                                  <button
                                    className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-md border border-gray-600 bg-gray-900/70 text-white hover:bg-gray-800"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLightboxOpen(false);
                                    }}
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {lightboxOpen && (
                    <div
                      className="fixed inset-0 z-900 bg-black/95"
                      onClick={() => setLightboxOpen(false)}
                    />
                  )}

                  {/* MediaInfo */}
                  <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
                    <div
                      className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
                      onClick={() => setIsMediaInfoExpanded(!isMediaInfoExpanded)}
                    >
                      <h2 className="text-white">MediaInfo</h2>
                      {isMediaInfoExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    {isMediaInfoExpanded && (
                      <div className="p-4">
                        <pre className="overflow-x-auto rounded bg-gray-950 p-4 font-mono text-xs text-gray-300">
                          {mediaInfo}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* 文件列表 */}
                  <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
                    <div
                      className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
                      onClick={() => setIsFilesExpanded(!isFilesExpanded)}
                    >
                      <h2 className="text-white">文件列表</h2>
                      {isFilesExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    {isFilesExpanded && (
                      <div className="divide-y divide-gray-800">
                        {fileList.map((item, index) => (
                          <FileListItem key={index} item={item} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 评论区 */}
                  <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
                    <div className="border-b border-neutral-700/50 px-5 py-4">
                      <h2 className="text-white">评论 ({comments.length})</h2>
                    </div>
                    <div className="p-6">
                      {/* 发表评论 */}
                      <div className="mb-6">
                        <textarea
                          rows={4}
                          placeholder="发表你的看法..."
                          className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                        />
                        <div className="mt-2 flex justify-end">
                          <ActionBtn
                            variant="amber"
                            mode="solid"
                            icon={<MessageSquare className="h-4 w-4" />}
                          >
                            发表评论
                          </ActionBtn>
                        </div>
                      </div>

                      {/* 评论列表 */}
                      <div className="space-y-6">
                        {comments.map((comment) => (
                          <div key={comment.id} className="flex gap-4">
                            <ImageWithFallback
                              src={comment.avatar}
                              alt={comment.user}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-white">{comment.user}</span>
                                <Badge className="border border-purple-500/30 bg-purple-500/20 text-xs text-purple-400">
                                  {comment.userLevel}
                                </Badge>
                                <span className="text-sm text-gray-500">{comment.date}</span>
                              </div>
                              <p className="mb-3 text-gray-300">{comment.content}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <Button className="flex items-center gap-1 text-gray-400 hover:text-amber-400">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>赞</span>
                                </Button>
                                <Button className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>回复</span>
                                </Button>
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Heart className="h-4 w-4 text-red-400" />
                                  <span>{comment.thanks} 感谢</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PageContainer>
        </ContextMenuTrigger>
        {/* 右键菜单内容：提供“下载种子”入口，复用统一下载逻辑 */}
        <ContextMenuContent className="w-48">
          {/* 当无有效种子ID时禁用 */}
          <ContextMenuItem
            disabled={!torrentData.id}
            // 使用 Radix ContextMenu 的 onSelect，确保键盘与鼠标选择行为一致
            // 移除 e.preventDefault() 以允许菜单自动关闭
            onSelect={() => {
              if (torrentData.id) {
                // 与按钮一致：以标题作为文件名回退
                downloadByTorrentId(
                  String(torrentData.id),
                  String(torrentData.title || "download"),
                );
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" /> 下载种子
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* 发送到下载器逻辑 */}
          {downloaders.length === 0 ? (
            <ContextMenuItem disabled>
              <Upload className="mr-2 h-4 w-4" /> 无可用下载器
            </ContextMenuItem>
          ) : downloaders.length === 1 ? (
            // 只有一个下载器：直接展示路径列表（若有路径），否则直接点击发送
            (() => {
              const downloader = downloaders[0];
              const paths = downloader.downloadPaths || [];

              if (paths.length > 0) {
                return (
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      <Upload className="mr-2 h-4 w-4" /> 发送到下载器
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                      {paths.map((p, idx) => (
                        <ContextMenuItem
                          key={idx}
                          onSelect={() => handleSendToDownloader(String(downloader.id), p.path)}
                        >
                          {p.name || p.path}
                        </ContextMenuItem>
                      ))}
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                );
              } else {
                // 无路径配置，直接发送
                return (
                  <ContextMenuItem onSelect={() => handleSendToDownloader(String(downloader.id))}>
                    <Upload className="mr-2 h-4 w-4" /> 发送到 {downloader.name}
                  </ContextMenuItem>
                );
              }
            })()
          ) : (
            // 多个下载器：先选下载器，再选路径
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Upload className="mr-2 h-4 w-4" /> 发送到下载器
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                {downloaders.map((d) => {
                  const paths = d.downloadPaths || [];
                  if (paths.length > 0) {
                    return (
                      <ContextMenuSub key={d.id}>
                        <ContextMenuSubTrigger>{d.name}</ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                          {paths.map((p, idx) => (
                            <ContextMenuItem
                              key={idx}
                              onSelect={() => handleSendToDownloader(String(d.id), p.path)}
                            >
                              {p.name || p.path}
                            </ContextMenuItem>
                          ))}
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                    );
                  } else {
                    return (
                      <ContextMenuItem
                        key={d.id}
                        onSelect={() => handleSendToDownloader(String(d.id))}
                      >
                        {d.name}
                      </ContextMenuItem>
                    );
                  }
                })}
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <DownloadToDownloaderModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        torrentId={String(torrentData.id)}
        torrentTitle={String(torrentData.title || "download")}
        source={sourcePayload}
      />
    </>
  );
}
