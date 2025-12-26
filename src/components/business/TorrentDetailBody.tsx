import {
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  UserRoundCheck,
  Star,
  Info,
  X,
  MessageSquare,
  ThumbsUp,
  Heart,
  File,
  Folder,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// 注意：ImageWithFallback 路径需要根据实际引用调整，假设是通用的
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { processDescription } from "@/pages/TorrentDetail/utils/processDescription";

// 复用 TorrentDetail 的类型定义，
// 如果 types.ts 路径不同请自行调整引用
import { TorrentData, FileItem, Comment } from "@/pages/TorrentDetail/types";

// ============================================
// Types
// ============================================

export interface TorrentDetailBodyProps {
  /** 核心元数据 */
  data: TorrentData;
  /** 文件列表 */
  fileList: FileItem[];
  /** 技术参数 (MediaInfo) */
  mediaInfo?: string;
  /** 剧照 URL 列表 */
  stills?: string[];
  /** 评论列表 */
  comments?: Comment[];
}

// 内部使用的简单 FileListItem 组件 (避免循环依赖，或者后续也可以直接 import FileListItem)
// 这里为了“独立性”，我们简单内联一个，或者直接把原有的 FileListItem 移到 components/business/utils 目录更好
// 为了本次 Task，我们暂时内联一份简化版，或者如果原文件导出复用，则引用它。
// 考虑到原 FileListItem 比较简单，这里为了方便直接嵌入同款逻辑，
// 或者最佳实践是引用原组件。假设我们引用原组件：
// import { FileListItem } from "@/pages/TorrentDetail/components/FileListItem";
// 但原组件import路径是相对的。我们还是在这里重新定义一个局部组件或把原组件移动到通用目录。
// 为了稳健，先把 FileListItem 逻辑在这里实现一遍，或者建议下一步移动原组件。
// 这里采用内联实现以保证 Task 1 独立完成。

const LocalFileListItem = ({ item, depth = 0 }: { item: FileItem; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.type === "folder") {
    return (
      <>
        <div
          className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-800"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          )}
          <Folder className="h-4 w-4 text-amber-400" />
          <span className="text-white">{item.name}</span>
        </div>
        {isOpen &&
          item.children?.map((child, index) => (
            <LocalFileListItem key={index} item={child} depth={depth + 1} />
          ))}
      </>
    );
  }

  return (
    <div
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-800"
      style={{ paddingLeft: `${depth * 20 + 12}px` }}
    >
      <div className="flex items-center gap-2">
        <File className="h-4 w-4 text-gray-400" />
        <span className="text-white">{item.name}</span>
      </div>
      <span className="text-sm text-gray-400">{item.size}</span>
    </div>
  );
};

// ============================================
// Main Component
// ============================================

export function TorrentDetailBody(props: TorrentDetailBodyProps) {
  const { data: torrentData, fileList, mediaInfo, stills = [], comments = [] } = props;

  const [isDescExpanded, setIsDescExpanded] = useState(true);
  const [isMediaInfoExpanded, setIsMediaInfoExpanded] = useState(false);
  const [isFilesExpanded, setIsFilesExpanded] = useState(false);

  // Lightbox logic
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // 格式化辅助
  const formatSize = (size: string) => size || "未知";
  // 此处简单透传，如果原组件有复杂逻辑需同步

  return (
    <div className="mx-auto max-w-[1400px] text-left">
      {/* 标题区域 */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl text-white md:text-3xl">{torrentData.title}</h1>
        {torrentData.subTitle && <p className="text-lg text-white">{torrentData.subTitle}</p>}

        {/* 标签和状态 */}
        <div className="mt-2 mb-3 flex flex-wrap items-center gap-2">
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

        {/* 元数据行 */}
        {/* 这里为了复用性，稍微简化样式或者直接copy原代码 */}
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
        </div>

        {/* 统计数据 */}
        <div className="mt-3 flex items-center gap-4 text-sm">
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

      <Separator className="my-6 bg-neutral-700/50" />

      {/* 核心内容区 */}
      <div className="space-y-6">
        {/* 1. 简介 */}
        <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
          <div
            className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
            onClick={() => setIsDescExpanded(!isDescExpanded)}
          >
            <h2 className="font-medium text-white">简介</h2>
            {isDescExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
          {isDescExpanded && (
            <div className="p-6">
              {torrentData.description ? (
                <div
                  className="description-content space-y-4 leading-relaxed text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: processDescription(torrentData.description),
                  }}
                />
              ) : (
                <div className="py-4 text-center text-gray-500">暂无简介</div>
              )}
            </div>
          )}
        </div>

        {/* 2. 剧照 */}
        {stills && stills.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
            <div className="border-b border-neutral-700/50 px-5 py-4">
              <h2 className="font-medium text-white">剧照预览</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {stills.map((url, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-black"
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <ImageWithFallback
                      src={url}
                      alt={`剧照 ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lightbox 简易实现 (若有通用 Lightbox 组件更好) */}
        {lightboxOpen && stills.length > 0 && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 rounded-full bg-gray-800 p-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <ImageWithFallback
                src={stills[lightboxIndex]}
                className="mx-auto max-h-[85vh] max-w-full object-contain"
                alt="Full view"
              />
              <div className="mt-2 text-center text-white">
                {lightboxIndex + 1} / {stills.length}
              </div>
            </div>
          </div>
        )}

        {/* 3. MediaInfo */}
        <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
          <div
            className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
            onClick={() => setIsMediaInfoExpanded(!isMediaInfoExpanded)}
          >
            <h2 className="font-medium text-white">MediaInfo (技术参数)</h2>
            {isMediaInfoExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
          {isMediaInfoExpanded && (
            <div className="p-4">
              <pre className="max-h-[500px] overflow-x-auto overflow-y-auto rounded bg-gray-950 p-4 font-mono text-xs whitespace-pre-wrap text-gray-300">
                {mediaInfo || "暂无 MediaInfo 信息"}
              </pre>
            </div>
          )}
        </div>

        {/* 4. 文件列表 */}
        <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
          <div
            className="flex cursor-pointer items-center justify-between border-b border-neutral-700/50 px-5 py-4"
            onClick={() => setIsFilesExpanded(!isFilesExpanded)}
          >
            <h2 className="font-medium text-white">文件列表</h2>
            {isFilesExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
          {isFilesExpanded && (
            <div className="max-h-[500px] divide-y divide-gray-800 overflow-y-auto">
              {fileList.length > 0 ? (
                fileList.map((item, index) => <LocalFileListItem key={index} item={item} />)
              ) : (
                <div className="p-4 text-center text-gray-500">暂无文件信息</div>
              )}
            </div>
          )}
        </div>

        {/* 5. 评论区 (只读) */}
        {comments && comments.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
            <div className="border-b border-neutral-700/50 px-5 py-4">
              <h2 className="font-medium text-white">用户评论 ({comments.length})</h2>
            </div>
            <div className="space-y-6 p-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <ImageWithFallback
                    src={comment.avatar}
                    alt={comment.user}
                    className="h-10 w-10 rounded-full bg-gray-700"
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
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Heart className="h-4 w-4 fill-red-400/20 text-red-400" />
                      <span>{comment.thanks} 感谢</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
