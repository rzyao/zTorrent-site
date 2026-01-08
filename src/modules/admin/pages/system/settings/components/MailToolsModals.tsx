import React from "react";
import { Modal, Form, Input, Typography, Tag, Result } from "antd";

interface MailToolsModalsProps {
  // Snapshot
  mailConfigSnapshot: string | null;
  onCloseSnapshot: () => void;
  selectedGroup: string;
  mailInfo: {
    enabled: boolean;
    fromPreview: string;
    smtpPreview: string;
    missing: { host: boolean; port: boolean; email: boolean };
  };

  // Send Diagnostic
  sendDiagOpen: boolean;
  onCloseSendDiag: () => void;
  onSubmitSendDiag: (values: {
    to: string;
    subject?: string;
    text?: string;
    html?: string;
  }) => Promise<void>;
  sendDiagLoading: boolean;
  sendDiagResult: any;

  // Verify Report
  mailVerifyReport: {
    ok?: boolean;
    error?: { name?: string; code?: string; message?: string } | null;
  } | null;
  onCloseVerifyReport: () => void;
}

export const MailToolsModals: React.FC<MailToolsModalsProps> = ({
  mailConfigSnapshot,
  onCloseSnapshot,
  selectedGroup,
  mailInfo,
  sendDiagOpen,
  onCloseSendDiag,
  onSubmitSendDiag,
  sendDiagLoading,
  sendDiagResult,
  mailVerifyReport,
  onCloseVerifyReport,
}) => {
  const [sendDiagForm] = Form.useForm();

  return (
    <>
      {/* SMTP 配置快照弹窗 */}
      <Modal
        open={!!mailConfigSnapshot}
        onCancel={onCloseSnapshot}
        footer={null}
        title="SMTP 配置快照"
        width={720}
      >
        {selectedGroup === "mail" && (
          <div style={{ marginBottom: 8 }}>
            <Typography.Text type="secondary">发件人：</Typography.Text>
            <Typography.Text code>{mailInfo.fromPreview}</Typography.Text>
          </div>
        )}
        <pre
          style={{
            maxHeight: 480,
            overflow: "auto",
            background: "#f6f8fa",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {mailConfigSnapshot}
        </pre>
      </Modal>

      {/* 诊断性发送弹窗 */}
      <Modal
        open={sendDiagOpen}
        onCancel={onCloseSendDiag}
        onOk={() => sendDiagForm.submit()}
        confirmLoading={sendDiagLoading}
        title="发送测试邮件"
        okText="发送"
        width={720}
      >
        {selectedGroup === "mail" && (
          <div
            style={{
              marginBottom: 8,
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Tag color={mailInfo.enabled ? "green" : "red"}>
              {mailInfo.enabled ? "已启用" : "未启用"}
            </Tag>
            <Typography.Text>
              发件人：
              <Typography.Text code>{mailInfo.fromPreview}</Typography.Text>
            </Typography.Text>
            <Typography.Text>
              SMTP：
              <Typography.Text code>{mailInfo.smtpPreview}</Typography.Text>
            </Typography.Text>
            {(!mailInfo.enabled || mailInfo.missing.email) && (
              <Typography.Text type="danger">
                当前发件配置不可用，可能导致发送失败
              </Typography.Text>
            )}
          </div>
        )}
        <Form
          form={sendDiagForm}
          layout="vertical"
          onFinish={onSubmitSendDiag}
          initialValues={{ subject: "SMTP 诊断测试" }}
        >
          <Form.Item
            label="收件人"
            name="to"
            rules={[
              { required: true, message: "请输入收件人邮箱" },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "邮箱格式不正确",
              },
            ]}
          >
            <Input placeholder="example@domain.com" />
          </Form.Item>
          <Form.Item label="主题" name="subject">
            <Input placeholder="SMTP 诊断测试" />
          </Form.Item>
          <Form.Item label="文本正文" name="text">
            <Input.TextArea rows={4} placeholder="纯文本正文，可留空" />
          </Form.Item>
          <Form.Item
            label="HTML 正文"
            name="html"
            rules={[
              {
                validator: (_, value) => {
                  const text = sendDiagForm.getFieldValue("text");
                  if (!value && !text)
                    return Promise.reject(
                      new Error("文本正文与 HTML 正文至少填写一项")
                    );
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="HTML 正文，可与文本正文二选一"
            />
          </Form.Item>
        </Form>
        {sendDiagResult && (
          <div style={{ marginTop: 12 }}>
            <Typography.Text type="secondary">原始返回结果：</Typography.Text>
            <pre
              style={{
                maxHeight: 320,
                overflow: "auto",
                background: "#f6f8fa",
                padding: 12,
                borderRadius: 8,
              }}
            >
              {JSON.stringify(sendDiagResult, null, 2)}
            </pre>
          </div>
        )}
      </Modal>

      {/* SMTP 连通性报告弹窗 */}
      <Modal
        open={!!mailVerifyReport}
        onCancel={onCloseVerifyReport}
        footer={null}
        title="SMTP 连通性报告"
      >
        {mailVerifyReport?.ok ? (
          <Result status="success" title="SMTP 连通性正常" />
        ) : (
          <Result
            status="error"
            title="SMTP 连通性失败"
            subTitle={
              mailVerifyReport?.error?.message ||
              "请检查主机、端口、账号、密码、TLS/SSL 设置"
            }
            extra={[
              mailVerifyReport?.error?.name && (
                <Typography.Text key="name">
                  错误名：{mailVerifyReport?.error?.name}
                </Typography.Text>
              ),
              mailVerifyReport?.error?.code && (
                <Typography.Text key="code" style={{ display: "block" }}>
                  错误码：{mailVerifyReport?.error?.code}
                </Typography.Text>
              ),
            ]}
          />
        )}
      </Modal>
    </>
  );
};
