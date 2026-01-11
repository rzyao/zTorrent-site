import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Input } from "@/modules/admin/components/ui/input";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { Label } from "@/modules/admin/components/ui/label";
import Tag from "@/modules/admin/components/ui/tag";

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
  // Form State for Send Diag
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("SMTP 诊断测试");
  const [text, setText] = useState("");
  const [html, setHtml] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when opening
  useEffect(() => {
    if (sendDiagOpen) {
      setTo("");
      setSubject("SMTP 诊断测试");
      setText("");
      setHtml("");
      setErrors({});
    }
  }, [sendDiagOpen]);

  const validateSendDiag = () => {
    const newErrors: Record<string, string> = {};
    if (!to) {
      newErrors.to = "请输入收件人邮箱";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      newErrors.to = "邮箱格式不正确";
    }

    if (!text && !html) {
      newErrors.html = "文本正文与 HTML 正文至少填写一项";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitSendDiag = async () => {
    if (!validateSendDiag()) return;
    try {
      await onSubmitSendDiag({ to, subject, text, html });
      // Note: We don't verify success here, parent does,
      // but if result is displayed in modal, we might keep it open.
      // Assuming parent logic keeps modal open if result is shown?
      // Actually usually logic is: submit -> wait result -> show result in same modal or close.
      // Based on original code: "{sendDiagResult && ...}" inside modal.
      // So we don't close automatically here wait for parent or user action.
    } catch (e) {}
  };

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
          <div className="mb-2">
            <span className="text-gray-500">发件人：</span>
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">
              {mailInfo.fromPreview}
            </code>
          </div>
        )}
        <pre className="max-h-[480px] overflow-auto rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800">
          {mailConfigSnapshot}
        </pre>
      </Modal>

      {/* 诊断性发送弹窗 */}
      <Modal
        open={sendDiagOpen}
        onCancel={onCloseSendDiag}
        onOk={handleSubmitSendDiag}
        confirmLoading={sendDiagLoading}
        title="发送测试邮件"
        okText="发送"
        width={720}
      >
        <div className="space-y-4">
          {selectedGroup === "mail" && (
            <div className="flex flex-wrap items-center gap-3 rounded-md bg-blue-50 p-3 text-sm">
              <Tag color={mailInfo.enabled ? "green" : "red"}>
                {mailInfo.enabled ? "已启用" : "未启用"}
              </Tag>
              <span className="text-gray-700">
                发件人：
                <code className="rounded bg-white/50 px-1 font-mono">{mailInfo.fromPreview}</code>
              </span>
              <span className="text-gray-700">
                SMTP：
                <code className="rounded bg-white/50 px-1 font-mono">{mailInfo.smtpPreview}</code>
              </span>
              {(!mailInfo.enabled || mailInfo.missing.email) && (
                <span className="flex items-center font-medium text-red-600">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  当前配置不可用
                </span>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="to" className="required">
              收件人
            </Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="example@domain.com"
              className={errors.to ? "border-red-500" : ""}
            />
            {errors.to && <span className="text-xs text-red-500">{errors.to}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">主题</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="SMTP 诊断测试"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">文本正文</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="纯文本正文"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="html">HTML 正文</Label>
            <Textarea
              id="html"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={4}
              placeholder="HTML 正文，可与文本正文二选一"
              className={errors.html ? "border-red-500" : ""}
            />
            {errors.html && <span className="text-xs text-red-500">{errors.html}</span>}
          </div>

          {sendDiagResult && (
            <div className="mt-4">
              <Label className="mb-2 block text-gray-500">原始返回结果：</Label>
              <pre className="max-h-60 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                {JSON.stringify(sendDiagResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Modal>

      {/* SMTP 连通性报告弹窗 */}
      <Modal
        open={!!mailVerifyReport}
        onCancel={onCloseVerifyReport}
        footer={null}
        title="SMTP 连通性报告"
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          {mailVerifyReport?.ok ? (
            <>
              <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">SMTP 连通性正常</h3>
              <p className="text-sm text-gray-500">成功连接到 SMTP 服务器并验证通过。</p>
            </>
          ) : (
            <>
              <XCircle className="mb-4 h-16 w-16 text-red-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">SMTP 连通性失败</h3>
              <p className="mb-4 text-sm text-gray-500">
                {mailVerifyReport?.error?.message || "请检查主机、端口、账号、密码、TLS/SSL 设置"}
              </p>
              {mailVerifyReport?.error && (
                <div className="w-full rounded bg-red-50 p-3 text-left">
                  {mailVerifyReport.error.name && (
                    <div className="text-xs font-medium text-red-800">
                      错误名: {mailVerifyReport.error.name}
                    </div>
                  )}
                  {mailVerifyReport.error.code && (
                    <div className="text-xs text-red-700">代码: {mailVerifyReport.error.code}</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
