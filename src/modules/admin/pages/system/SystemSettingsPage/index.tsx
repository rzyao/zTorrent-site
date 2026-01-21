import {
  Settings,
  Search,
  Save,
  RotateCcw,
  Plus,
  RefreshCw,
  Mail,
  Send,
  Eye,
  AlertTriangle,
  Info,
} from "lucide-react";

import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import Tag from "@/modules/admin/components/ui/tag";
import { useSystemSettings } from "./hooks/useSystemSettings";
import { SettingSidebar } from "./components/SettingSidebar";
import { SettingItem } from "./components/SettingItem";
import { CreateSettingModal } from "./components/CreateSettingModal";
import { EditSettingModal } from "./components/EditSettingModal";
import { MailToolsModals } from "./components/MailToolsModals";

const SettingsSkeleton = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex animate-pulse items-start gap-3">
        <div className="mt-4 h-4 w-4 rounded bg-gray-200"></div>
        <div className="flex-1 rounded-lg border border-gray-100 bg-white p-4">
          <div className="mb-4 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="h-10 w-full rounded bg-gray-200"></div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * 系统设置页面 (SystemSettings)
 *
 * 职责：
 * - 组装各个子模块 (Sidebar, List, Modals)
 * - 通过 useSystemSettings Hook 获取状态与操作
 * - 保持页面主要布局结构
 */
export default function SystemSettingsPage() {
  const {
    // Data
    settings,
    loading,
    selectedGroup,
    searchText,
    editedValues,
    hasChanges,
    selectedGroupInfo,
    groupInfoByKey,
    mailInfo,

    // UI & Loading States
    createOpen,
    createSubmitting,
    editOpen,
    editSubmitting,
    editingSetting,

    mailConfigSnapshot,
    mailConfigLoading,
    mailVerifyLoading,
    mailVerifyReport,
    sendDiagOpen,
    sendDiagLoading,
    sendDiagResult,

    // Setters
    setSelectedGroup,
    setSearchText,
    setCreateOpen,
    setEditOpen,
    setEditingSetting,
    setMailConfigSnapshot,
    setMailVerifyReport,
    setSendDiagOpen,

    // Actions
    handleValueChange,
    handleSave,
    handleReset,
    handleVerifyMail,
    handleViewMailConfig,
    submitCreate,
    submitEditMeta,
    submitSendDiag,
  } = useSystemSettings();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-0">
      {/* 顶部操作区：标题与保存/重置按钮；全局操作与搜索入口 */}
      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">系统设置</h2>
            <span className="text-sm text-gray-500">管理系统运行参数和配置项</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" onClick={handleReset} disabled={!hasChanges || loading}>
              <RotateCcw className="mr-1.5 h-4 w-4" />
              重置
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!hasChanges} loading={loading}>
              <Save className="mr-1.5 h-4 w-4" />
              保存更改
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setCreateOpen(true);
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              新增配置项
            </Button>
            {!searchText && selectedGroup === "mail" && (
              <div className="flex gap-2 border-l border-gray-200 pl-2">
                <Button
                  variant="default"
                  onClick={() => handleVerifyMail()}
                  loading={mailVerifyLoading}
                >
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  测试连通性
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleViewMailConfig()}
                  loading={mailConfigLoading}
                >
                  <Eye className="mr-1.5 h-4 w-4" />
                  查看SMTP配置
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setSendDiagOpen(true);
                  }}
                >
                  <Send className="mr-1.5 h-4 w-4" />
                  发送测试邮件
                </Button>
              </div>
            )}
          </div>
          <div className="ml-4 flex items-center">
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="w-64 pl-9"
                placeholder="搜索配置键、描述 or 值..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 主体布局：左侧分组导航 + 右侧设置列表 */}
      <div className="flex min-h-0 w-full flex-1 items-start gap-4 overflow-hidden">
        {/* 左侧分组导航 */}
        <SettingSidebar
          visible={!searchText}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
        />

        {/* 右侧内容区 */}
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-4 flex w-full shrink-0 justify-between border-b border-gray-100 pb-2">
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-900">
                {searchText ? "搜索结果" : selectedGroupInfo?.name}
              </h3>
              {!searchText && (
                <span className="text-xs text-gray-500">{selectedGroupInfo?.description}</span>
              )}
              {!searchText && selectedGroup === "mail" && (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Tag color={mailInfo.enabled ? "green" : "red"}>
                    {mailInfo.enabled ? "已启用" : "未启用"}
                  </Tag>
                  <span className="text-sm text-gray-600">
                    发件人：
                    <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">
                      {mailInfo.fromPreview}
                    </code>
                  </span>
                  <span className="text-sm text-gray-600">
                    SMTP：
                    <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">
                      {mailInfo.smtpPreview}
                    </code>
                  </span>
                  {(mailInfo.missing.host || mailInfo.missing.port || mailInfo.missing.email) && (
                    <span className="flex items-center text-sm text-red-500">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      配置不完整：
                      {[
                        mailInfo.missing.host ? "host" : null,
                        mailInfo.missing.port ? "port" : null,
                        mailInfo.missing.email ? "from.email" : null,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                </div>
              )}
            </div>
            {hasChanges && (
              <div className="flex items-center gap-2 text-amber-500">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">有未保存的更改</span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {loading && settings.length === 0 ? (
              <SettingsSkeleton />
            ) : settings.length > 0 ? (
              <div className="flex flex-col gap-4">
                {settings.map((setting) => (
                  <SettingItem
                    key={setting.id}
                    setting={setting}
                    searchText={searchText}
                    editedValue={editedValues[setting.key]}
                    onValueChange={handleValueChange}
                    onEdit={(s) => {
                      setEditingSetting(s);
                      setEditOpen(true);
                    }}
                    groupName={groupInfoByKey[setting.group]?.name}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-gray-400">
                {searchText ? "没有找到匹配的配置" : "该分组暂无配置"}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateSettingModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSubmit={submitCreate}
        confirmLoading={createSubmitting}
        initialGroup={selectedGroup}
      />

      <EditSettingModal
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingSetting(null);
        }}
        onSubmit={submitEditMeta}
        confirmLoading={editSubmitting}
        setting={editingSetting}
      />

      <MailToolsModals
        mailConfigSnapshot={mailConfigSnapshot}
        onCloseSnapshot={() => setMailConfigSnapshot(null)}
        selectedGroup={selectedGroup}
        mailInfo={mailInfo}
        sendDiagOpen={sendDiagOpen}
        onCloseSendDiag={() => setSendDiagOpen(false)}
        onSubmitSendDiag={submitSendDiag}
        sendDiagLoading={sendDiagLoading}
        sendDiagResult={sendDiagResult}
        mailVerifyReport={mailVerifyReport}
        onCloseVerifyReport={() => setMailVerifyReport(null)}
      />
    </div>
  );
}
