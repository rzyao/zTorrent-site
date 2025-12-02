import { useState, useEffect } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import { TorrentsService } from '@/api';
import {
  Download,
  Upload,
  Star,
  MessageSquare,
  HardDrive,
  Calendar,
  User,
  Share2,
  Bookmark,
  Flag,
  Clock,
  Film,
  Globe,
  Award,
  ChevronRight,
  Play,
  Heart,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Avatar } from '../components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { formatSize } from '@/utils/format';

interface TorrentDetailPageProps {
  torrentId?: number;
}




export default function TorrentDetailPage({ torrentId }: TorrentDetailPageProps) {
  useDynamicTitle('影片详情');
  const [activeTab, setActiveTab] = useState('comments');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasThanked, setHasThanked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const num = (v: any) => Number(v ?? 0);
  const str = (v: any) => String(v ?? '');
  const arr = (v: any) => (Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : []);

  const defaultBackdrop = 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?w=1920';

  const mapDetail = (raw: any) => {
    return {
      id: raw?.id ?? 0,
      title: str(raw?.title),
      subtitle: str(raw?.subTitle ?? raw?.Subtitle),
      poster: raw?.cover,
      backdrop: raw?.backdrop ?? defaultBackdrop,
      category: str(raw?.category),
      subCategory: str(raw?.subCategory ?? raw?.SubCategory),
      year: num(raw?.year),
      duration: str(raw?.duration),
      director: str(raw?.director),
      cast: arr(raw?.cast),
      imdb: str(raw?.imdb),
      douban: str(raw?.douban),
      rating: num(raw?.rating),
      ratingCount: num(raw?.ratingCount),
      description: str(raw?.description),
      stills: arr(raw?.stills),
      awards: Array.isArray(raw?.awards) ? raw.awards : [],
      size: str(raw?.size),
      files: num(raw?.files),
      seeders: num(raw?.seeders),
      leechers: num(raw?.leechers),
      completed: num(raw?.completed),
      uploadDate: str(raw?.uploadDate),
      uploader: {
        name: str(raw?.uploader?.name),
        avatar: str(raw?.uploader?.avatar),
        level: str(raw?.uploader?.level),
        uploads: num(raw?.uploader?.uploads),
        ratio: str(raw?.uploader?.ratio),
      },
      isFree: Boolean(raw?.isFree),
      isHot: Boolean(raw?.isHot),
      isVip: Boolean(raw?.isVip),
      videoCodec: str(raw?.videoCodec),
      videoResolution: str(raw?.videoResolution),
      videoFrameRate: str(raw?.videoFrameRate),
      videoBitRate: str(raw?.videoBitRate),
      audioCodec: str(raw?.audioCodec),
      audioBitRate: str(raw?.audioBitRate),
      audioLanguages: arr(raw?.audioLanguages),
      subtitles: arr(raw?.subtitles),
      fileList: Array.isArray(raw?.fileList)
        ? raw.fileList.map((f: any) => ({ name: str(f?.name), size: str(f?.size) }))
        : [],
      views: num(raw?.views),
      bookmarks: num(raw?.bookmarks),
      thanks: num(raw?.thanks),
      comments: Array.isArray(raw?.comments) ? raw.comments : [],
      relatedTorrents: Array.isArray(raw?.relatedTorrents) ? raw.relatedTorrents : [],
      otherVersions: Array.isArray(raw?.otherVersions) ? raw.otherVersions : [],
    };
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!torrentId) return;
      try {
        setLoading(true);
        const resp = await TorrentsService.torrentsControllerGet({ id: String(torrentId) });
        const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
        const data = body?.data ?? body;
        if (!cancelled) setDetail(mapDetail(data));
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message ?? ''));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [torrentId]);

  if (loading) {
    return <div className="min-h-screen bg-[#0F171E]" />;
  }

  if (error) {
    return <div className="min-h-screen bg-[#0F171E] text-red-400 px-4 py-8">{error}</div>;
  }

  if (!detail) {
    return <div className="min-h-screen bg-[#0F171E]" />;
  }

  const torrentDetail = detail as any;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0F171E]">
      {/* 背景图 */}
      <div className="relative h-auto pt-12">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={torrentDetail.backdrop}
            alt={torrentDetail.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-[#0F171E]/50 to-transparent" />
        </div>

        {/* 主要信息 */}
        <div className="relative h-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-end pt-4">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* 海报 */}
            <div className="flex-shrink-0">
              <div className="w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
                <ImageWithFallback
                  src={torrentDetail.poster}
                  alt={torrentDetail.title}
                  className="w-full h-auto"
                  width={256}
                  height={384}
                />
              </div>
            </div>

            {/* 信息 */}
            <div className="flex-1 space-y-4">
              {/* 标题 */}
              <div>
                <h1 className="text-white text-4xl md:text-5xl mb-2">
                  {torrentDetail.title}
                </h1>
                <p className="text-gray-300 text-lg md:text-xl">
                  {torrentDetail.subtitle}
                </p>
              </div>

              {/* 标签和评分 */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-gray-800 text-white">
                  {torrentDetail.category}
                </Badge>
                {torrentDetail.isFree && (
                  <Badge className="bg-green-500 text-white">FREE</Badge>
                )}
                {torrentDetail.isHot && (
                  <Badge className="bg-red-500 text-white">HOT</Badge>
                )}
                {torrentDetail.isVip && (
                  <Badge className="bg-yellow-500 text-white">VIP</Badge>
                )}
                <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400">{torrentDetail.rating}</span>
                  <span className="text-gray-400 text-sm">
                    ({torrentDetail.ratingCount}人评分)
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full">
                  <span className="text-gray-400 text-sm">IMDb:</span>
                  <span className="text-[#00A8E1]">{torrentDetail.imdb}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full">
                  <span className="text-gray-400 text-sm">豆瓣:</span>
                  <span className="text-[#00A8E1]">{torrentDetail.douban}</span>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{torrentDetail.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{torrentDetail.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-gray-400" />
                  <span>{torrentDetail.subCategory}</span>
                </div>
              </div>

              {/* 简介 */}
              <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
                {/* {torrentDetail.description} */}
              </p>

              {/* 导演演员 */}
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-400 min-w-16">导演:</span>
                  <span className="text-[#00A8E1]">{torrentDetail.director}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 min-w-16">主演:</span>
                  <span className="text-gray-300">{Array.isArray(torrentDetail.cast) ? torrentDetail.cast.join(' / ') : String(torrentDetail.cast ?? '')}</span>
                </div>
              </div>

              {/* 操作按钮和统计信息 */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white px-8 py-6 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  立即下载
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`border-gray-700 px-6 py-6 ${isBookmarked
                    ? 'bg-[#00A8E1] border-[#00A8E1] text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                >
                  <Bookmark className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  收藏
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setHasThanked(!hasThanked)}
                  className={`border-gray-700 px-6 py-6 ${hasThanked
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${hasThanked ? 'fill-current' : ''}`} />
                  感谢
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 px-6 py-6"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  分享
                </Button>


                {/* 统计信息 - 移至按钮右侧 */}
                <div className="flex items-center gap-4 mr-auto  px-6 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-green-400 text-sm">{torrentDetail.seeders}</p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-10 bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-red-400" />
                    <div>
                      <p className="text-red-400 text-sm">{torrentDetail.leechers}</p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-10 bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-blue-400 text-sm">{torrentDetail.completed}</p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-10 bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-purple-400 text-sm">{formatSize(torrentDetail.size)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 详细内容 */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
          {/* 主要内容区 */}
          <div className="space-y-6">
            {/* 剧照展示*/}
            {torrentDetail.stills && torrentDetail.stills.length > 0 && (
              <div className="lg:col-span-3">
                <h2 className="text-white text-2xl mb-4">剧照</h2>
                <div className="bg-gray-900/50 rounded-lg border border-gray-800">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {torrentDetail.stills.map((screenshot, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div
                            className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => openLightbox(index)}
                          >
                            <ImageWithFallback
                              src={screenshot}
                              alt={`剧照 ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800" />
                    <CarouselNext className="right-2 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800" />
                  </Carousel>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-2">
              <div className="space-y-6">
                {/* 其他版本 */}
                <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                  <h3 className="text-white mb-4">其他版本</h3>
                  <div className="space-y-4">
                    {Array.isArray(torrentDetail.otherVersions) && torrentDetail.otherVersions.length > 0 ? torrentDetail.otherVersions.map((version: any) => (
                      <div key={version.id} className="group cursor-pointer">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-28 rounded overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={torrentDetail.poster}
                              alt={version.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {version.isFree && (
                              <Badge className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0">
                                FREE
                              </Badge>
                            )}
                            {version.isVip && (
                              <Badge className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 py-0">
                                VIP
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm mb-2 line-clamp-2 group-hover:text-[#00A8E1] transition-colors">
                              {version.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-yellow-400 text-xs">{torrentDetail.rating}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Upload className="w-3 h-3 text-green-400" />
                                <span>{version.seeders}</span>
                              </div>
                              <span>{version.size}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : <div className="text-gray-400 text-sm">暂无其他版本</div>}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {/* 标签页 */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-gray-900 border border-gray-800 w-full justify-start">
                    <TabsTrigger value="comments" className="data-[state=active]:bg-[#00A8E1]">
                      评论 ({Array.isArray(torrentDetail.comments) ? torrentDetail.comments.length : 0})
                    </TabsTrigger>
                    <TabsTrigger value="info" className="data-[state=active]:bg-[#00A8E1]">
                      种子信息
                    </TabsTrigger>
                    <TabsTrigger value="files" className="data-[state=active]:bg-[#00A8E1]">
                      文件列表
                    </TabsTrigger>

                  </TabsList>

                  {/* 种子信息 */}
                  <TabsContent value="info" className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                    <div className="space-y-6">
                      {/* 基本统计 */}
                      <div>
                        <h3 className="text-white text-lg mb-4">基本信息</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-900 rounded-lg p-4 text-center">
                            <Upload className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl text-white mb-1">{torrentDetail.seeders}</p>
                            <p className="text-xs text-gray-400">做种</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-4 text-center">
                            <Download className="w-8 h-8 text-red-400 mx-auto mb-2" />
                            <p className="text-2xl text-white mb-1">{torrentDetail.leechers}</p>
                            <p className="text-xs text-gray-400">下载</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-4 text-center">
                            <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-2xl text-white mb-1">{torrentDetail.completed}</p>
                            <p className="text-xs text-gray-400">完成</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-4 text-center">
                            <HardDrive className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-2xl text-white mb-1">{formatSize(torrentDetail.size)}</p>
                            <p className="text-xs text-gray-400">大小</p>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* 技术规格 */}
                      <div>
                        <h3 className="text-white text-lg mb-4">技术规格</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">视频编码:</span>
                            <span className="text-white">{torrentDetail.videoCodec}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">视频分辨率:</span>
                            <span className="text-white">{torrentDetail.videoResolution}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">帧率:</span>
                            <span className="text-white">{torrentDetail.videoFrameRate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">视频码率:</span>
                            <span className="text-white">{torrentDetail.videoBitRate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">音频编码:</span>
                            <span className="text-white">{torrentDetail.audioCodec}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">音频码率:</span>
                            <span className="text-white">{torrentDetail.audioBitRate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">音频语言:</span>
                            <span className="text-white">{Array.isArray(torrentDetail.audioLanguages) ? torrentDetail.audioLanguages.join(' / ') : String(torrentDetail.audioLanguages ?? '')}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-400">字幕:</span>
                            <span className="text-white">{Array.isArray(torrentDetail.subtitles) ? torrentDetail.subtitles.join(' / ') : String(torrentDetail.subtitles ?? '')}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* 其他信息 */}
                      <div>
                        <h3 className="text-white text-lg mb-4">其他信息</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">文件数量:</span>
                            <span className="text-white">{torrentDetail.files} 个文件</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">上传时间:</span>
                            <span className="text-white">{torrentDetail.uploadDate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">浏览次数:</span>
                            <span className="text-white">{torrentDetail.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">收藏次数:</span>
                            <span className="text-white">{torrentDetail.bookmarks.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-400">感谢次数:</span>
                            <span className="text-white">{Number(torrentDetail.thanks ?? 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 文件列表 */}
                  <TabsContent value="files" className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                    <div className="space-y-2">
                      {Array.isArray(torrentDetail.fileList) ? torrentDetail.fileList.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3 px-4 bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <HardDrive className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-white text-sm truncate">{file.name}</span>
                          </div>
                          <span className="text-gray-400 text-sm ml-4 flex-shrink-0">{file.size}</span>
                        </div>
                      )) : null}
                    </div>
                  </TabsContent>

                  {/* 评论 */}
                  <TabsContent value="comments" className="space-y-4">
                    {/* 评论输入 */}
                    <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                      <h3 className="text-white mb-4">发表评论</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-gray-400 text-sm">评分:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-5 h-5 text-gray-600 hover:text-yellow-400 cursor-pointer transition-colors"
                            />
                          ))}
                        </div>
                        <textarea
                          placeholder="分享您的观看感受..."
                          rows={4}
                          className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1] outline-none resize-none"
                        />
                        <Button className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          发布评论
                        </Button>
                      </div>
                    </div>

                    {/* 评论列表 */}
                    {Array.isArray(torrentDetail.comments) ? torrentDetail.comments.map((comment: any) => (
                      <div
                        key={comment.id}
                        className="bg-gray-900/50 rounded-lg border border-gray-800 p-6"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white">
                            <User className="w-6 h-6" />
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-white">{comment.user.name}</span>
                              <Badge className="bg-yellow-500 text-white text-xs">
                                {comment.user.level}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: comment.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 mb-3">{comment.content}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{comment.date}</span>
                              <Button className="flex items-center gap-1 hover:text-[#00A8E1] transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{comment.likes}</span>
                              </Button>
                              <Button className="flex items-center gap-1 hover:text-[#00A8E1] transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span>回复 ({comment.replies})</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : null}
                  </TabsContent>
                </Tabs>
              </div>

            </div>

          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 获奖情况 - 右侧 */}
            {torrentDetail.awards && torrentDetail.awards.length > 0 && (
              <div className="lg:col-span-1">
                <h2 className="text-white text-2xl mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  获奖情况
                </h2>
                <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-2">
                  <div className="space-y-4">
                    {torrentDetail.awards.map((award, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 py-1 border-b border-gray-800 last:border-0"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${award.won ? 'bg-yellow-500/20' : 'bg-gray-800'
                          }`}>
                          {award.won ? (
                            <Award className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Star className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-white text-sm">{award.name}</h3>
                            <Badge className={award.won ? 'bg-yellow-500 text-white text-xs' : 'bg-gray-700 text-gray-300 text-xs'}>
                              {award.won ? '获奖' : '提名'}
                            </Badge>
                            <span className="text-gray-500 text-xs">{award.year}</span>
                          </div>
                          <p className="text-gray-400 text-xs mb-1">{award.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* 上传者信息 */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
              <h3 className="text-white mb-4">上传者</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{torrentDetail.uploader.name}</span>
                    <Badge className="bg-yellow-500 text-white text-xs">
                      {torrentDetail.uploader.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">分享率: {torrentDetail.uploader.ratio}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">上传数:</span>
                  <span className="text-white">{torrentDetail.uploader.uploads}</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                查看主页
              </Button>
            </div>

            {/* 相关推荐 */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
              <h3 className="text-white mb-4">相关推荐</h3>
              <div className="space-y-4">
                {Array.isArray(torrentDetail.relatedTorrents) && torrentDetail.relatedTorrents.length > 0 ? torrentDetail.relatedTorrents.map((torrent: any) => (
                  <div key={torrent.id} className="group cursor-pointer">
                    <div className="flex gap-3">
                      <div className="relative w-20 h-28 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={torrent.thumbnail}
                          alt={torrent.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {torrent.isFree && (
                          <Badge className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0">
                            FREE
                          </Badge>
                        )}
                        {torrent.isHot && (
                          <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0">
                            HOT
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm mb-2 line-clamp-2 group-hover:text-[#00A8E1] transition-colors">
                          {torrent.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-yellow-400 text-xs">{torrent.rating}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Upload className="w-3 h-3 text-green-400" />
                            <span>{torrent.seeders}</span>
                          </div>
                          <span>{torrent.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : <div className="text-gray-400 text-sm">暂无相关推荐</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 全屏图片查看器 */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] bg-black/95 border-none p-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {torrentDetail.stills.map((still, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center h-[90vh] p-8">
                      <ImageWithFallback
                        src={still}
                        alt={`剧照 ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 w-12 h-12" />
              <CarouselNext className="right-4 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 w-12 h-12" />
            </Carousel>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-gray-900/80 text-white hover:bg-gray-800 w-10 h-10 rounded-full z-50"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
