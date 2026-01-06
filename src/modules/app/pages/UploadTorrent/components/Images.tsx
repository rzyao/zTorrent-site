import React, { memo } from 'react';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

/**
 * Images
 * 纯展示组件：负责渲染“图片”板块（海报与剧照上传/外链添加/删除）。
 */
export interface ImagesProps {
  uploadedPoster: string;
  onPosterRemove: () => void;
  posterUploading: boolean;
  posterInputRef: React.RefObject<HTMLInputElement>;
  onPosterInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetPosterUrl: (url: string) => void;

  screenshots: string[];
  onRemoveScreenshot: (index: number) => void;
  shotsUploading: boolean;
  shotsInputRef: React.RefObject<HTMLInputElement>;
  onShotsInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddScreenshotUrl: (url: string) => void;
}

export const Images = memo(function Images(props: ImagesProps) {
  const {
    uploadedPoster,
    onPosterRemove,
    posterUploading,
    posterInputRef,
    onPosterInputChange,
    onSetPosterUrl,
    screenshots,
    onRemoveScreenshot,
    shotsUploading,
    shotsInputRef,
    onShotsInputChange,
    onAddScreenshotUrl,
  } = props;

  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      {/* 模块标题区域 */}
      <div className="bg-linear-to-r from-orange-500/20 to-amber-500/20 border-b border-neutral-700/50 px-6 py-3.5">
        <h2 className="text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-orange-400" />
          图片
        </h2>
      </div>

      <div className="p-6 space-y-8">
        {/* 海报上传/外链 */}
        <div>
          <label className="text-neutral-300 text-sm mb-4 block">海报</label>
          <div className="flex items-start gap-4">
            {uploadedPoster ? (
              <div className="relative w-48 rounded-xl overflow-hidden group border-2 border-neutral-700/50">
                <ImageWithFallback src={uploadedPoster} alt="海报" className="w-full aspect-2/3 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-red-500/80 hover:text-white" onClick={onPosterRemove}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {posterUploading && (
                  <div className="absolute inset-0 bg-black/50 text-white text-xs flex items-center justify-center">上传中...</div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-700/60 rounded-xl p-8 text-center hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer w-48 group" onClick={() => posterInputRef.current?.click()}>
                <ImageIcon className="w-12 h-12 text-neutral-500 group-hover:text-orange-400 mx-auto mb-3 transition-colors" />
                <p className="text-neutral-400 group-hover:text-neutral-300 text-sm mb-1 transition-colors">点击上传海报</p>
                <p className="text-neutral-600 text-xs">推荐 2:3 比例</p>
              </div>
            )}
            <input ref={posterInputRef} type="file" accept="image/*" className="hidden" onChange={onPosterInputChange} />
            <div className="flex-1">
              <p className="text-neutral-400 text-sm mb-2">上传指南：</p>
              <ul className="text-neutral-500 text-xs space-y-1">
                <li>• 支持 JPG、PNG 格式</li>
                <li>• 推荐尺寸: 800x1200 像素</li>
                <li>• 推荐比例: 2:3（竖版海报）</li>
                <li>• 文件大小不超过 5MB</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-neutral-400 text-xs mb-1.5 block">或使用外部图片链接</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://example.com/screenshot.jpg"
                className="flex-1 bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    if (input.value.trim()) {
                      onSetPosterUrl(input.value.trim());
                      input.value = '';
                    }
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  if (input?.value.trim()) {
                    onSetPosterUrl(input.value.trim());
                    input.value = '';
                  }
                }}
              >
                添加
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-700/40" />

        {/* 剧照上传/外链 */}
        <div>
          <label className="text-neutral-300 text-sm mb-4 block">剧照</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="relative aspect-video rounded-xl overflow-hidden group border-2 border-neutral-700/50">
                <ImageWithFallback src={screenshot} alt={`剧照 ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-red-500/80 hover:text-white" onClick={() => onRemoveScreenshot(index)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="aspect-video border-2 border-dashed border-neutral-700/60 rounded-xl flex items-center justify-center hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group" onClick={() => shotsInputRef.current?.click()}>
              <div className="text-center">
                <Plus className="w-10 h-10 text-neutral-500 group-hover:text-orange-400 mx-auto mb-2 transition-colors" />
                <p className="text-neutral-500 group-hover:text-neutral-400 text-xs transition-colors">添加剧照</p>
              </div>
            </div>
          </div>
          <p className="text-neutral-500 text-xs mt-3">上传剧照可以帮助用户更好地了解资源，建议上传 4-8 张</p>
          <input ref={shotsInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onShotsInputChange} />
          <div className="mt-4">
            <label className="text-neutral-400 text-xs mb-1.5 block">或使用外部图片链接</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://example.com/screenshot.jpg"
                className="flex-1 bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    if (input.value.trim()) {
                      onAddScreenshotUrl(input.value.trim());
                      input.value = '';
                    }
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  if (input?.value.trim()) {
                    onAddScreenshotUrl(input.value.trim());
                    input.value = '';
                  }
                }}
              >
                添加
              </Button>
            </div>
            {shotsUploading && <p className="text-neutral-400 text-xs mt-2">剧照上传中...</p>}
          </div>
        </div>
      </div>
    </div>
  );
});

