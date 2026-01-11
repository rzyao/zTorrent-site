import { useMemo } from "react";
import { Form, Input } from "antd";
import { ShieldCheck } from "lucide-react";
import { useSendInviteLogic } from "./useSendInviteLogic";
import { BatchGrantModal } from "./components/BatchGrantModal";
import { Button } from "@/modules/admin/components/ui/button";

/**
 * 发送官方邀请页面
 * 已完成架构层重构：
 * - TanStack Query useMutation 管理请求状态
 * - Admin UI 组件
 * - 逻辑与视图分离
 * - 性能优化 (memo/useMemo/useCallback)
 */
export default function SendInvitePage() {
  const {
    form,
    batchOpen,
    batchForm,
    batchLoading,
    submitLoading,
    rolesOptions,
    levelsOptions,
    previewCount,
    canOfficial,
    canManageInvites,
    handleSubmit,
    openBatchModal,
    closeBatchModal,
    previewMatching,
    executeBatchGrant,
  } = useSendInviteLogic();

  // 无权限提示
  const noPermissionContent = useMemo(
    () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldCheck className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">无权限</h2>
          <p className="text-gray-500">申请该权限或联系管理员</p>
        </div>
      </div>
    ),
    [],
  );

  if (!canOfficial) {
    return noPermissionContent;
  }

  return (
    <div className="space-y-4 p-4">
      {/* 发送官方邀请卡片 */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">发送官方邀请</h2>
        <Form form={form} layout="vertical" className="max-w-2xl">
          <Form.Item
            name="email"
            label="受邀邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input placeholder="name@example.com" size="large" allowClear />
          </Form.Item>
          <Form.Item
            name="username"
            label="受邀用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" size="large" allowClear />
          </Form.Item>
          <Form.Item className="mt-8">
            <div className="flex gap-3">
              <Button variant="primary" size="lg" onClick={handleSubmit} loading={submitLoading}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                发送邀请邮件
              </Button>
              {canManageInvites && (
                <Button variant="default" size="lg" onClick={openBatchModal}>
                  批量授予名额
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
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
        onPreview={previewMatching}
        onSubmit={executeBatchGrant}
      />
    </div>
  );
}
