import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/modules/app/components/ui/button";
import { Input } from "@/modules/forum/components/ui/input"; // 注意：这里使用了 forum 模块的 input，可能需要统一
import { customToast } from "@/hooks/useToast";
import { processImage } from "@/utils/imageUtils";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string | string[]; // attachmentId
  defaultPreview?: string | string[]; // 初始预览图URL
  onChange?: (attachmentId: any, url: any) => void;
  className?: string;
  attachableType?: string; // 业务类型
  attachableId?: string; // 业务ID
  field?: string; // 字段名
  placeholder?: string;
  maxCount?: number;
  tips?: string[];
}

export function ImageUpload({
  value,
  defaultPreview,
  onChange,
  className,
  attachableType,
  attachableId,
  field,
  placeholder,
  maxCount = 1,
  tips,
}: ImageUploadProps) {
  const isMultiple = maxCount > 1;
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化状态
  useEffect(() => {
    // 处理预览图 URL
    if (defaultPreview) {
      if (Array.isArray(defaultPreview)) {
        setPreviewUrls(defaultPreview);
      } else {
        setPreviewUrls([defaultPreview]);
      }
    } else {
      setPreviewUrls([]);
    }

    // 处理附件 ID
    if (value) {
      if (Array.isArray(value)) {
        setAttachmentIds(value);
      } else {
        setAttachmentIds([value]);
      }
    } else {
      setAttachmentIds([]);
    }

    // 如果是单图模式且有值，同步到 inputValue 以便显示链接
    if (!isMultiple && typeof defaultPreview === "string") {
      setInputValue(defaultPreview);
    }
  }, [defaultPreview, value, isMultiple]);

  const triggerChange = (newIds: string[], newUrls: string[]) => {
    if (isMultiple) {
      onChange?.(newIds, newUrls);
    } else {
      onChange?.(newIds[0] || "", newUrls[0] || "");
    }
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (files.length === 0) return;

    // 检查数量限制
    if (isMultiple) {
      if (previewUrls.length + files.length > maxCount) {
        customToast.error(`最多上传 ${maxCount} 张图片`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const newIds: string[] = [];
      const newUrls: string[] = [];

      // 并发上传
      const uploadPromises = Array.from(files).map((file) =>
        processImage(file, { attachableType, attachableId, field }),
      );

      const results = await Promise.all(uploadPromises);

      results.forEach((res) => {
        newIds.push(res.attachmentId);
        newUrls.push(res.url);
      });

      if (isMultiple) {
        const nextIds = [...attachmentIds, ...newIds];
        const nextUrls = [...previewUrls, ...newUrls];
        setAttachmentIds(nextIds);
        setPreviewUrls(nextUrls);
        triggerChange(nextIds, nextUrls);
      } else {
        // 单图模式覆盖
        setAttachmentIds(newIds);
        setPreviewUrls(newUrls);
        setInputValue(newUrls[0]); // 更新输入框
        triggerChange(newIds, newUrls);
      }

      customToast.success("图片上传成功");
    } catch (error: any) {
      customToast.error(error.message || "上传失败");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadFiles(files);
    }
  };

  const handleRemove = (index: number) => {
    const nextIds = [...attachmentIds];
    const nextUrls = [...previewUrls];
    nextIds.splice(index, 1);
    nextUrls.splice(index, 1);

    setAttachmentIds(nextIds);
    setPreviewUrls(nextUrls);

    if (!isMultiple) {
      setInputValue("");
    }

    triggerChange(nextIds, nextUrls);
  };

  // 处理 Input 变化 (外部链接)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (!isMultiple) {
      // 单图模式逻辑保持不变：即时预览
      if (val && /^https?:\/\//.test(val)) {
        setPreviewUrls([val]);
        // 清空ID，因为是外部链接
        setAttachmentIds([""]);
        onChange?.("", val); // 立即通知
      } else if (!val) {
        setPreviewUrls([]);
        setAttachmentIds([]);
        onChange?.("", "");
      }
    }
  };

  const handleAddExternalLink = () => {
    // 多图模式下，手动添加链接
    if (!inputValue || !/^https?:\/\//.test(inputValue)) return;

    if (previewUrls.length >= maxCount) {
      customToast.error(`最多上传 ${maxCount} 张图片`);
      return;
    }

    const nextUrls = [...previewUrls, inputValue];
    const nextIds = [...attachmentIds, ""]; // 外部链接没有 ID

    setPreviewUrls(nextUrls);
    setAttachmentIds(nextIds);
    setInputValue(""); // 清空输入框
    triggerChange(nextIds, nextUrls);
  };

  // 单图模式的渲染逻辑 (保持原样)
  if (!isMultiple) {
    const currentPreview = previewUrls[0];
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="flex items-start gap-4">
          {currentPreview ? (
            <div className="group relative w-48 overflow-hidden rounded-xl border-2 border-neutral-700/50">
              {/* @ts-ignore */}
              <img
                src={currentPreview}
                alt="Preview"
                className="aspect-2/3 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-red-500/80 hover:text-white"
                  onClick={() => handleRemove(0)}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  上传中...
                </div>
              )}
            </div>
          ) : (
            <div
              className="group flex w-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700/60 p-8 text-center transition-all hover:border-orange-500/50 hover:bg-orange-500/5"
              onClick={() => fileInputRef.current?.click()}
            >
              {isLoading ? (
                <Loader2 className="mx-auto mb-3 h-12 w-12 animate-spin text-neutral-500" />
              ) : (
                <ImageIcon className="mx-auto mb-3 h-12 w-12 text-neutral-500 transition-colors group-hover:text-orange-400" />
              )}
              <p className="mb-1 text-sm text-neutral-400 transition-colors group-hover:text-neutral-300">
                {isLoading ? "上传中..." : "点击上传图片"}
              </p>
              <p className="text-xs text-neutral-600">推荐 2:3 比例</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
            disabled={isLoading}
          />

          <div className="min-w-0 flex-1 py-2">
            {currentPreview && (
              <div className="mb-2 line-clamp-2 text-sm break-all text-neutral-400">
                {currentPreview.startsWith("http") ? currentPreview : "已上传本地附件"}
              </div>
            )}
          </div>
        </div>

        {tips && tips.length > 0 && (
          <ul className="space-y-1 text-xs text-neutral-500">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        )}

        <div>
          <label className="mb-1.5 block text-xs text-neutral-400">或使用外部图片链接</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder || "https://example.com/image.jpg"}
              className="w-full rounded-lg border border-neutral-700/60 bg-neutral-900/60 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  // 多图模式渲染逻辑
  return (
    <div className={cn("w-full space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={onFileChange}
        disabled={isLoading}
      />

      {/* 图片列表 Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="group relative aspect-2/3 overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-900/30"
          >
            {/* @ts-ignore */}
            <img
              src={url}
              alt={`Preview ${index}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg==";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-red-500/80 hover:text-white"
                onClick={() => handleRemove(index)}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* 上传按钮 (如果未满) */}
        {previewUrls.length < maxCount && (
          <div
            className="flex aspect-2/3 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700/60 bg-neutral-900/20 transition-all hover:border-orange-500/50 hover:bg-orange-500/5"
            onClick={() => fileInputRef.current?.click()}
          >
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            ) : (
              <Upload className="mb-2 h-8 w-8 text-neutral-500" />
            )}
            <span className="text-xs text-neutral-400">
              {isLoading ? "..." : `${previewUrls.length}/${maxCount}`}
            </span>
          </div>
        )}
      </div>

      {/* 外部链接添加 (多图模式下为添加操作) */}
      <div>
        <label className="mb-1.5 block text-xs text-neutral-400">添加外部图片链接</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder || "https://example.com/image.jpg"}
            className="flex-1 rounded-lg border border-neutral-700/60 bg-neutral-900/60 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-neutral-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
            disabled={isLoading || previewUrls.length >= maxCount}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddExternalLink();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddExternalLink}
            disabled={!inputValue || isLoading || previewUrls.length >= maxCount}
          >
            添加
          </Button>
        </div>
        {previewUrls.length >= maxCount && (
          <p className="mt-1 text-xs text-amber-500">已达到最大上传数量 {maxCount}</p>
        )}
      </div>
    </div>
  );
}
