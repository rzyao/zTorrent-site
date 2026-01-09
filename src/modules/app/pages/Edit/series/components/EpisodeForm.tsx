import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/app/components/ui/dialog";
import { Button } from "@/modules/app/components/ui/button";
import { AccessControl } from "@/components/AccessControl";
import { Input } from "@/modules/app/components/ui/input";
import { Label } from "@/modules/app/components/ui/label";
import { Textarea } from "@/modules/app/components/ui/textarea";
import { Calendar, Clock, Film } from "lucide-react";
import type { Episode, EpisodeFormState } from "../types";

interface EpisodeFormProps {
  seriesId: string;
  initialData?: Episode;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EpisodeFormState) => Promise<void>;
}

export function EpisodeForm({
  seriesId,
  initialData,
  isOpen,
  onClose,
  onSubmit,
}: EpisodeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EpisodeFormState>({
    defaultValues: {
      seriesId,
      episodeNumber: 1,
      title: "",
      overview: "",
      airDate: "",
      runtime: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          seriesId: initialData.seriesId,
          episodeNumber: initialData.episodeNumber,
          title: initialData.title,
          overview: initialData.overview || "",
          airDate: initialData.airDate || "",
          runtime: initialData.runtime || 0,
        });
      } else {
        reset({
          seriesId,
          episodeNumber: 1,
          title: "",
          overview: "",
          airDate: "",
          runtime: 0,
        });
      }
    }
  }, [isOpen, initialData, seriesId, reset]);

  const onValid = async (data: EpisodeFormState) => {
    try {
      // 根据模式构造不同的提交数据，避免后端 Body 校验报错
      let submitData: any;

      if (initialData) {
        // 更新模式：后端不允许包含 seriesId 和 episodeNumber
        submitData = {
          id: initialData.id,
          title: data.title,
        };
      } else {
        // 创建模式：包含 seriesId 和 episodeNumber
        submitData = {
          seriesId: data.seriesId,
          episodeNumber: Number(data.episodeNumber),
          title: data.title,
        };
      }

      // 可选字段：仅当有值时才包含
      if (data.overview?.trim()) {
        submitData.overview = data.overview.trim();
      }
      if (data.airDate?.trim()) {
        submitData.airDate = data.airDate;
      }
      if (data.runtime && Number(data.runtime) > 0) {
        submitData.runtime = Number(data.runtime);
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl  pop text-white/85">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Film className="w-5 h-5 text-amber-500" />
            {initialData ? "编辑分集" : "添加分集"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="episodeNumber" className="text-gray-400">
                集号
              </Label>
              <Input
                id="episodeNumber"
                className=" focus:border-amber-500 input"
                disabled={!!initialData}
                {...register("episodeNumber", { required: "请输入集号" })}
              />
              {errors.episodeNumber && (
                <span className="text-xs text-red-500">
                  {errors.episodeNumber.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="runtime" className="text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 时长 (分钟)
                </div>
              </Label>
              <Input
                id="runtime"
                min="0"
                className=" focus:border-amber-500 input"
                {...register("runtime")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="airDate" className="text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> 首播日期
                </div>
              </Label>
              <Input
                id="airDate"
                type="date"
                className=" focus:border-amber-500 input"
                {...register("airDate")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-400">
              标题
            </Label>
            <Input
              id="title"
              placeholder="分集标题"
              className=" focus:border-amber-500 input"
              {...register("title", { required: "请输入标题" })}
            />
            {errors.title && (
              <span className="text-xs text-red-500">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview" className="text-gray-400">
              简介
            </Label>
            <Textarea
              id="overview"
              rows={4}
              className="resize-none input"
              placeholder="本集剧情概要..."
              {...register("overview")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              取消
            </Button>
            {/* 保存分集按钮：根据模式区分创建与更新权限 */}
            <AccessControl
              requiredPermissions={[initialData ? "episode:update" : "episode:create"]}
              name="保存分集"
              fallback={
                <Button disabled className="bg-neutral-700 text-neutral-400">
                  {isSubmitting ? "保存中..." : "保存分集"}
                </Button>
              }
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-500 text-black hover:bg-amber-400"
              >
                {isSubmitting ? "保存中..." : "保存分集"}
              </Button>
            </AccessControl>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
