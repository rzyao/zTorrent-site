import React, { memo } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Separator } from "@/modules/app/components/ui/separator";
import { ImageUpload } from "@/components/ImageUpload";

/**
 * Images
 * 纯展示组件：负责渲染“图片”板块（海报与剧照上传/外链添加/删除）。
 */
export interface ImagesProps {
  poster: string;
  posterAttachmentId: string;
  onPosterChange: (id: string, url: string) => void;

  screenshots: string[];
  screenshotAttachmentIds: string[];
  onScreenshotsChange: (ids: string[], urls: string[]) => void;
}

export const Images = memo(function Images(props: ImagesProps) {
  const {
    poster,
    posterAttachmentId,
    onPosterChange,
    screenshots,
    screenshotAttachmentIds,
    onScreenshotsChange,
  } = props;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-700/50 bg-neutral-800/40 shadow-2xl backdrop-blur-sm">
      {/* 模块标题区域 */}
      <div className="border-b border-neutral-700/50 bg-linear-to-r from-orange-500/20 to-amber-500/20 px-6 py-3.5">
        <h2 className="flex items-center gap-2 text-white">
          <ImageIcon className="h-5 w-5 text-orange-400" />
          图片
        </h2>
      </div>

      <div className="space-y-8 p-6">
        {/* 海报上传/外链 */}
        <div>
          <label className="mb-4 block text-sm text-neutral-300">海报</label>
          <ImageUpload
            value={posterAttachmentId}
            defaultPreview={poster}
            onChange={(id, url) => onPosterChange(id as string, url as string)}
            attachableType="torrent"
            field="poster"
            maxCount={1}
            placeholder="点击上传海报或输入链接"
            className="aspect-2/3 w-48"
            tips={[
              "• 支持 JPG、PNG 格式",
              "• 推荐尺寸: 800x1200 像素",
              "• 推荐比例: 2:3（竖版海报）",
              "• 文件大小不超过 5MB",
            ]}
          />
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 剧照上传/外链 */}
        <div>
          <label className="mb-4 block text-sm text-neutral-300">剧照</label>
          <ImageUpload
            value={screenshotAttachmentIds}
            defaultPreview={screenshots}
            onChange={(ids, urls) => {
              onScreenshotsChange(
                Array.isArray(ids) ? ids : [ids],
                Array.isArray(urls) ? urls : [urls],
              );
            }}
            attachableType="torrent"
            field="screenshots"
            maxCount={10}
            placeholder="点击添加剧照"
            tips={["上传剧照可以帮助用户更好地了解资源，建议上传 4-8 张"]}
          />
        </div>
      </div>
    </div>
  );
});
