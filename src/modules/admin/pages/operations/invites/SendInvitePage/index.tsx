import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { ShieldCheck, Mail, User, Info } from "lucide-react";
import { useSendInviteLogic } from "./useSendInviteLogic";
import { BatchGrantModal } from "./components/BatchGrantModal";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";

export default function SendInvitePage() {
  const {
    mainForm,
    batchOpen,
    batchForm,
    batchLoading,
    submitLoading,
    rolesOptions,
    levelsOptions,
    previewCount,
    canOfficial,
    canManageInvites,
    handleMainSubmit,
    openBatchModal,
    closeBatchModal,
    handlePreview,
    handleBatchSubmit,
  } = useSendInviteLogic();

  const {
    control,
    formState: { errors },
  } = mainForm;

  // 无权限提示
  const noPermissionContent = useMemo(
    () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <ShieldCheck className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">无权限</h2>
          <p className="text-muted-foreground">申请该权限或联系管理员</p>
        </div>
      </div>
    ),
    [],
  );

  if (!canOfficial) {
    return noPermissionContent;
  }

  return (
    <div className="space-y-6 p-4">
      {/* 发送官方邀请卡片 */}
      <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="text-primary h-5 w-5" />
          <h2 className="text-lg font-semibold">发送官方邀请</h2>
        </div>

        <form onSubmit={handleMainSubmit} className="max-w-2xl space-y-5">
          <div className="space-y-2">
            <Label htmlFor="userId" required className="flex items-center gap-2">
              <User className="h-4 w-4" /> 用户标识 (ID/用户名)
            </Label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="请输入受邀用户的 UID 或用户名" size="lg" />
              )}
            />
            {errors.userId && (
              <p className="text-destructive text-xs font-medium">{errors.userId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="count" required>
                邀请数量
              </Label>
              <Controller
                name="count"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    size="lg"
                  />
                )}
              />
              {errors.count && (
                <p className="text-destructive text-xs font-medium">{errors.count.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" required className="flex items-center gap-2">
              <Info className="h-4 w-4" /> 发送原因
            </Label>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="例如：特殊奖励、补偿等" size="lg" />
              )}
            />
            {errors.reason && (
              <p className="text-destructive text-xs font-medium">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button type="submit" variant="primary" size="lg" loading={submitLoading}>
              <Mail className="mr-2 h-4 w-4" />
              确认发送邀请
            </Button>
            {canManageInvites && (
              <Button type="button" variant="default" size="lg" onClick={openBatchModal}>
                批量授予名额
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* 批量授予弹窗 */}
      <BatchGrantModal
        open={batchOpen}
        onClose={closeBatchModal}
        form={batchForm}
        loading={batchLoading}
        rolesOptions={rolesOptions}
        levelsOptions={levelsOptions}
        previewCount={previewCount}
        onPreview={handlePreview}
        onSubmit={handleBatchSubmit}
      />
    </div>
  );
}
