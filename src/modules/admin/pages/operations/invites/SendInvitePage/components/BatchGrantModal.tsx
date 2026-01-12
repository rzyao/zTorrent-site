import { memo } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/modules/admin/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/admin/components/ui/dialog";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { LOGIC_OPTIONS } from "../constants";
import type { SelectOption } from "../types";

interface BatchGrantModalProps {
  open: boolean;
  onClose: () => void;
  form: any;
  loading: boolean;
  rolesOptions: SelectOption[];
  levelsOptions: SelectOption[];
  previewCount: number | null;
  onPreview: () => void;
  onSubmit: () => void;
}

export const BatchGrantModal = memo(function BatchGrantModal({
  open,
  onClose,
  form,
  loading,
  rolesOptions,
  levelsOptions,
  previewCount,
  onPreview,
  onSubmit,
}: BatchGrantModalProps) {
  const { control } = form;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>批量授予邀请名额</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>用户等级（多选）</Label>
              <Controller
                name="levels"
                control={control}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={levelsOptions}
                    placeholder="筛选等级"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>用户角色（多选）</Label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={rolesOptions}
                    placeholder="筛选角色"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>过滤逻辑</Label>
            <Controller
              name="logic"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={LOGIC_OPTIONS}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>永久名额</Label>
              <Controller
                name="permanent"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="输入数量"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>临时名额</Label>
              <Controller
                name="temporaryCount"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="输入数量"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>临时名额过期时间</Label>
            <Controller
              name="temporaryExpiresAt"
              control={control}
              render={({ field }) => (
                <Input
                  type="datetime-local"
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex gap-2">
              <Button type="button" variant="default" onClick={onPreview} loading={loading}>
                预览匹配
              </Button>
              <Button type="button" variant="primary" onClick={onSubmit} loading={loading}>
                提交执行
              </Button>
            </div>
            <span className="text-sm font-semibold text-blue-600">
              匹配用户数：{previewCount !== null ? previewCount : "-"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
