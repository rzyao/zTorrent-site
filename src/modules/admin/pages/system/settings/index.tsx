import {
  Card,
  Button,
  Input,
  List,
  Typography,
  Skeleton,
  Tag,
  Space,
} from "antd";
import {
  SettingOutlined,
  SearchOutlined,
  SaveOutlined,
  ReloadOutlined,
  AlertOutlined,
} from "@ant-design/icons";

import { useSystemSettings } from "./hooks/useSystemSettings";
import { SettingSidebar } from "./components/SettingSidebar";
import { SettingItem } from "./components/SettingItem";
import { CreateSettingModal } from "./components/CreateSettingModal";
import { EditSettingModal } from "./components/EditSettingModal";
import { MailToolsModals } from "./components/MailToolsModals";

/**
 * 系统设置页面 (SystemSettings)
 *
 * 职责�?
 * - 组装各个子模�?(Sidebar, List, Modals)
 * - 通过 useSystemSettings Hook 获取状态与操作
 * - 保持页面主要布局结构
 */
export default function SystemSettings() {
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
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 顶部操作区：标题与保�?重置按钮；全局操作与搜索入�?*/}
        <Card styles={{ body: { padding: 16 } }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SettingOutlined />
              <Typography.Text strong>系统设置</Typography.Text>
              <Typography.Text type="secondary">
                管理系统运行参数和配置项
              </Typography.Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                disabled={!hasChanges || loading}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!hasChanges}
                loading={loading}
              >
                保存更改
              </Button>
              <Button
                type="dashed"
                onClick={() => {
                  setCreateOpen(true);
                }}
              >
                新增配置�?
              </Button>
              {!searchText && selectedGroup === "mail" && (
                <Space>
                  <Button
                    onClick={() => handleVerifyMail()}
                    loading={mailVerifyLoading}
                  >
                    测试连通�?
                  </Button>
                  <Button
                    onClick={() => handleViewMailConfig()}
                    loading={mailConfigLoading}
                  >
                    查看SMTP配置
                  </Button>
                  <Button
                    onClick={() => {
                      setSendDiagOpen(true);
                    }}
                  >
                    发送测试邮�?
                  </Button>
                </Space>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                size="large"
                allowClear
                placeholder="搜索配置键、描�?or �?.."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 主体布局：左侧分组导�?+ 右侧设置列表 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {/* 左侧分组导航 */}
          <SettingSidebar
            visible={!searchText}
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
          />

          {/* 右侧内容�?*/}
          <Card
            className="scroll-area"
            style={{
              marginLeft: !searchText ? 16 : 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography.Text strong>
                  {searchText ? "搜索结果" : selectedGroupInfo?.name}
                </Typography.Text>
                {!searchText && (
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedGroupInfo?.description}
                  </Typography.Text>
                )}
                {!searchText && selectedGroup === "mail" && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Tag color={mailInfo.enabled ? "green" : "red"}>
                      {mailInfo.enabled ? "已启�? : "未启�?}
                    </Tag>
                    <Typography.Text>
                      发件人：
                      <Typography.Text code>
                        {mailInfo.fromPreview}
                      </Typography.Text>
                    </Typography.Text>
                    <Typography.Text>
                      SMTP�?
                      <Typography.Text code>
                        {mailInfo.smtpPreview}
                      </Typography.Text>
                    </Typography.Text>
                    {(mailInfo.missing.host ||
                      mailInfo.missing.port ||
                      mailInfo.missing.email) && (
                      <Typography.Text type="danger">
                        配置不完整：
                        {[
                          mailInfo.missing.host ? "host" : null,
                          mailInfo.missing.port ? "port" : null,
                          mailInfo.missing.email ? "from.email" : null,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Typography.Text>
                    )}
                  </div>
                )}
              </div>
              {hasChanges && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertOutlined style={{ color: "#fa8c16" }} />
                  <Typography.Text type="warning">
                    有未保存的更�?
                  </Typography.Text>
                </div>
              )}
            </div>

            <div className="scroll-area" style={{ flex: 1, overflow: "auto" }}>
              {loading && settings.length === 0 ? (
                <Skeleton active />
              ) : settings.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={settings}
                  renderItem={(setting) => (
                    <List.Item key={setting.id}>
                      <SettingItem
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
                    </List.Item>
                  )}
                />
              ) : (
                <Typography.Text type="secondary">
                  {searchText ? "没有找到匹配的配�? : "该分组暂无配�?}
                </Typography.Text>
              )}
            </div>
          </Card>
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
    </>
  );
}
