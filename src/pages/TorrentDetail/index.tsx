import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useParams } from "react-router-dom";
import { TorrentsService } from "@/api/services/TorrentsService";
import { useTorrentDownload } from "@/utils/useTorrentDownload";
import { formatSize } from "@/utils/format";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
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
} from "@/components/ui/context-menu";
import { DownloadToDownloaderModal } from "@/components/DownloadToDownloaderModal";

import { useDownloaders } from "@/context/DownloadersContext";
import { DownloadersService } from "@/api/services/DownloadersService";
import { customToast } from "@/hooks/useToast";
import { useSourceTracker } from "@/hooks/useSourceTracker";

import {
  DescriptionData,
  TorrentDetailPageProps,
  TorrentData,
  FileItem,
  Comment,
  RelatedTorrent,
  EnglishMovieInfo,
} from "./types";
import { processDescription } from "./utils/processDescription";
import { FileListItem } from "./components/FileListItem";

export default function TorrentDetailPage({
  torrentId,
}: TorrentDetailPageProps) {
  const { downloadByTorrentId } = useTorrentDownload();
  const { downloaders } = useDownloaders();
  const { sourcePayload } = useSourceTracker();
  const { id } = useParams();
  const effectiveId = torrentId ?? id;
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
        const resp = await TorrentsService.torrentsControllerGet({
          id: String(effectiveId),
        });
        const body: any =
          (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
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
            data?.downloadUrl ??
              data?.downloadURL ??
              data?.download_link ??
              data?.download
          ),
        };
        if (!cancelled) setTorrentData(mapped);
        const files = Array.isArray(data?.fileList)
          ? data.fileList.map((f: any) => ({
              name: str(f?.name),
              size: str(f?.size),
              type: "file",
            }))
          : fileList;
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
        const stillsData = Array.isArray(data?.stills)
          ? data.stills.map((s: any) => str(s))
          : [];
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
  const handleSendToDownloader = async (
    downloaderId: string,
    path?: string
  ) => {
    if (!effectiveId) return;
    try {
      // 1. 获取一次性下载链接
      const source = sourcePayload ?? { filmId: "", playListId: "" };
      const resp = await TorrentsService.torrentsControllerCreateDownloadUrl({
        torrentId: String(effectiveId),
        source,
      });
      const body: any =
        (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
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
        <ContextMenuTrigger asChild>
          <div className="min-h-screen bg-[#0F171E] pt-8">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
              {/* 标题区域 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h1 className="text-white text-2xl md:text-3xl mb-2">
                      {torrentData.title}
                    </h1>
                    {torrentData.subTitle && (
                      <p className="text-white text-lg">
                        {torrentData.subTitle}
                      </p>
                    )}
                    {loading && (
                      <p className="text-gray-500 text-sm">加载中...</p>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                </div>

                {/* 标签和状态 */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-amber-600 text-white">
                    {torrentData.category}
                  </Badge>
                  <Badge className="bg-orange-600 text-white">
                    {torrentData.standard}
                  </Badge>
                  {torrentData.isFree && (
                    <Badge className="bg-green-500 text-white">FREE</Badge>
                  )}
                  {Number.isFinite(torrentData.rating) && (
                    <div className="flex items-center gap-1 text-yellow-400 ml-2">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <span>{torrentData.rating}</span>
                    </div>
                  )}
                  {torrentData.isFree && (
                    <div className="ml-2 flex items-center gap-1 text-green-400 text-sm">
                      <Info className="w-3 h-3" />
                      <span>限时免费至 {torrentData.promotionEnd}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="text-gray-200">分类</span>
                  <span className="text-gray-200">{torrentData.category}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">媒介</span>
                  <span className="text-gray-200">{torrentData.medium}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">编码</span>
                  <span className="text-gray-200">
                    {torrentData.videoCodec}
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">分辨率</span>
                  <span className="text-gray-200">{torrentData.standard}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">音频</span>
                  <span className="text-gray-200">
                    {torrentData.audioCodec}
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">制作组</span>
                  <span className="text-gray-200">
                    {torrentData.productionTeam}
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">大小</span>
                  <span className="text-gray-200">
                    {formatSize(torrentData.size)}
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">发布时间</span>
                  <span className="text-gray-200">
                    {torrentData.uploadDate}
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-200">发布者</span>
                  <span className="text-gray-200">{torrentData.uploader}</span>
                  {torrentData.uploaderLevel && (
                    <Badge className="ml-1 bg-orange-500 text-white text-xs">
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
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white h-9"
                    onClick={() => setDownloadModalOpen(true)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载种子
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0"
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    收藏
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    分享
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-0"
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    举报
                  </Button>

                  <Separator
                    orientation="vertical"
                    className="h-6 bg-gray-700 mx-1"
                  />

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Upload className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        {torrentData.seeders}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">
                        {torrentData.leechers}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserRoundCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-white">
                        {torrentData.completed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* 主要内容区 */}
                <div className="space-y-6">
                  {/* 简介 */}
                  <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                    <div
                      className="bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between cursor-pointer"
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                    >
                      <h2 className="text-white">简介</h2>
                      {isDescExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    {isDescExpanded && (
                      <div className="p-6">
                        {/* PT风格的内容渲染 */}
                        {torrentData.description ? (
                          <div
                            className="space-y-4 text-gray-300 leading-relaxed description-content"
                            dangerouslySetInnerHTML={{
                              __html: processDescription(
                                torrentData.description
                              ),
                            }}
                          />
                        ) : (
                          <div className="space-y-4 text-gray-300 leading-relaxed">
                            {/* 引用框 */}
                            <fieldset className="border-2 border-amber-500/30 rounded p-4 bg-amber-500/5">
                              <legend className="text-amber-400 px-2">
                                引用
                              </legend>
                              <div className="text-amber-400 text-center">
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
                    <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <h2 className="text-white">剧照</h2>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {stills.map((url, index) => {
                            const isActive =
                              lightboxOpen && lightboxIndex === index;
                            return (
                              <div
                                key={index}
                                className={
                                  isActive
                                    ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] w-full h-full"
                                    : "relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                                }
                                onClick={() => {
                                  const i = preloadRefs.current[index];
                                  if (
                                    i &&
                                    typeof (i as any).decode === "function"
                                  ) {
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
                                      ? "w-full h-full object-contain"
                                      : "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  }
                                />
                                {isActive && (
                                  <button
                                    className="absolute top-4 right-4 bg-gray-900/70 border border-gray-600 text-white hover:bg-gray-800 w-6 h-6 rounded-md flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLightboxOpen(false);
                                    }}
                                  >
                                    <X className="w-5 h-5" />
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
                      className="fixed inset-0 bg-black/95 z-[900]"
                      onClick={() => setLightboxOpen(false)}
                    />
                  )}

                  {/* MediaInfo */}
                  <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                    <div
                      className="bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setIsMediaInfoExpanded(!isMediaInfoExpanded)
                      }
                    >
                      <h2 className="text-white">MediaInfo</h2>
                      {isMediaInfoExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    {isMediaInfoExpanded && (
                      <div className="p-4">
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto bg-gray-950 p-4 rounded">
                          {mediaInfo}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* 文件列表 */}
                  <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                    <div
                      className="bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between cursor-pointer"
                      onClick={() => setIsFilesExpanded(!isFilesExpanded)}
                    >
                      <h2 className="text-white">文件列表</h2>
                      {isFilesExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
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
                  <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700">
                      <h2 className="text-white">评论 ({comments.length})</h2>
                    </div>
                    <div className="p-6">
                      {/* 发表评论 */}
                      <div className="mb-6">
                        <textarea
                          rows={4}
                          placeholder="发表你的看法..."
                          className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            发表评论
                          </Button>
                        </div>
                      </div>

                      {/* 评论列表 */}
                      <div className="space-y-6">
                        {comments.map((comment) => (
                          <div key={comment.id} className="flex gap-4">
                            <ImageWithFallback
                              src={comment.avatar}
                              alt={comment.user}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-white">
                                  {comment.user}
                                </span>
                                <Badge className="bg-purple-500 text-white text-xs">
                                  {comment.userLevel}
                                </Badge>
                                <span className="text-gray-500 text-sm">
                                  {comment.date}
                                </span>
                              </div>
                              <p className="text-gray-300 mb-3">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <Button className="flex items-center gap-1 text-gray-400 hover:text-amber-400">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>赞</span>
                                </Button>
                                <Button className="flex items-center gap-1 text-gray-400 hover:text-gray-300">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>回复</span>
                                </Button>
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Heart className="w-4 h-4 text-red-400" />
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

                {/* 侧边栏 */}
                <div className="space-y-6 hidden">
                  {/* 种子信息 */}
                  <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700">
                      <h3 className="text-white">种子信息</h3>
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">分类</td>
                            <td className="px-4 py-2.5 text-white">
                              {torrentData.category}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">媒介</td>
                            <td className="px-4 py-2.5 text-white">
                              {torrentData.medium}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">编码</td>
                            <td className="px-4 py-2.5 text-white">
                              {torrentData.videoCodec}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">
                              分辨率
                            </td>
                            <td className="px-4 py-2.5 text-white">
                              {torrentData.standard}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">音频</td>
                            <td className="px-4 py-2.5 text-white">
                              {torrentData.audioCodec}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">
                              制作组
                            </td>
                            <td className="px-4 py-2.5 text-white">
                              {torrentData.productionTeam}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">大小</td>
                            <td className="px-4 py-2.5 text-white">
                              {formatSize(torrentData.size)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">
                              发布时间
                            </td>
                            <td className="px-4 py-2.5 text-white text-xs">
                              {torrentData.uploadDate}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">
                              发布者
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="text-white">
                                {torrentData.uploader}
                              </span>
                              <Badge className="ml-2 bg-orange-500 text-white text-xs">
                                {torrentData.uploaderLevel}
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2.5 text-gray-400">IMDb</td>
                            <td className="px-4 py-2.5">
                              {/* 暖色调替换：侧边栏链接颜色由 violet 改为 amber，提升可读性与统一性 */}
                              <a
                                href={`https://www.imdb.com/title/${torrentData.imdb}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-400 hover:underline text-xs"
                              >
                                {torrentData.imdb}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 text-gray-400">豆瓣</td>
                            <td className="px-4 py-2.5">
                              <a
                                href={`https://movie.douban.com/subject/${torrentData.douban}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-400 hover:underline text-xs"
                              >
                                {torrentData.douban}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 相关种子 */}
                  <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700">
                      <h3 className="text-white">相关种子</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {relatedTorrents.map((torrent) => (
                        <div
                          key={torrent.id}
                          className="border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors cursor-pointer"
                        >
                          <h4 className="text-white text-sm mb-2 line-clamp-2">
                            {torrent.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">
                              {torrent.size}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">
                                {torrent.seeders}
                              </span>
                              <span className="text-gray-500">/</span>
                              <span className="text-red-400">
                                {torrent.leechers}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 text-white hover:bg-gray-800 justify-start"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        感谢发布者
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 text-white hover:bg-gray-800 justify-start"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        收藏种子
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 text-white hover:bg-gray-800 justify-start"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        举报问题
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        {/* 右键菜单内容：提供“下载种子”入口，复用统一下载逻辑 */}
        <ContextMenuContent className="w-48">
          {/* 当无有效种子ID时禁用 */}
          <ContextMenuItem
            disabled={!torrentData.id}
            // 使用 Radix ContextMenu 的 onSelect，确保键盘与鼠标选择行为一致
            onSelect={(e) => {
              e.preventDefault();
              if (torrentData.id) {
                // 与按钮一致：以标题作为文件名回退
                downloadByTorrentId(
                  String(torrentData.id),
                  String(torrentData.title || "download")
                );
              }
            }}
          >
            <Download className="w-4 h-4 mr-2" /> 下载种子
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* 发送到下载器逻辑 */}
          {downloaders.length === 0 ? (
            <ContextMenuItem disabled>
              <Upload className="w-4 h-4 mr-2" /> 无可用下载器
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
                      <Upload className="w-4 h-4 mr-2" /> 发送到下载器
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                      {paths.map((p, idx) => (
                        <ContextMenuItem
                          key={idx}
                          onSelect={() =>
                            handleSendToDownloader(
                              String(downloader.id),
                              p.path
                            )
                          }
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
                  <ContextMenuItem
                    onSelect={() =>
                      handleSendToDownloader(String(downloader.id))
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" /> 发送到 {downloader.name}
                  </ContextMenuItem>
                );
              }
            })()
          ) : (
            // 多个下载器：先选下载器，再选路径
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Upload className="w-4 h-4 mr-2" /> 发送到下载器
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
                              onSelect={() =>
                                handleSendToDownloader(String(d.id), p.path)
                              }
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
