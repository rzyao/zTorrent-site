import { useEffect, useState, useCallback } from "react";
import { App, Card, Descriptions, Form, List, Modal, Space, Tag, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useParams, useNavigate } from "react-router-dom";
import { TicketsService } from "@/api/services/TicketsService";
import type { ReplyDto } from "@/api/models/ReplyDto";
import { statusText, statusColor, categoryText, priorityText, priorityColor } from "./constants";
import { Button } from "@/modules/admin/components/ui/button";
import { Textarea } from "@/modules/admin/components/ui/textarea";
import { formatDate } from "@/modules/admin/utils/formatDate";

export default function TicketDetail() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id = "" } = useParams();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replying, setReplying] = useState(false);
  const [form] = Form.useForm<ReplyDto>();
  const [files, setFiles] = useState<UploadFile[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await TicketsService.ticketsControllerDetail({
        ticketId: id,
      } as any);
      setDetail(res?.data?.detail || res?.data || {});
      setReplies(res?.data?.replies ?? []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "加载失败");
    } finally {
      setLoading(false);
    }
  }, [id, message]);

  useEffect(() => {
    load();
  }, [load]);

  const handleClose = useCallback(() => {
    Modal.confirm({
      title: "确认关闭该工单？",
      onOk: async () => {
        try {
          await TicketsService.ticketsControllerClose({
            ticketId: id,
            reason: "后台关闭",
          } as any);
          message.success("已关闭");
          load();
        } catch (e: any) {
          message.error(e?.response?.data?.message || e?.message || "关闭失败");
        }
      },
    });
  }, [id, load, message]);

  const handleConfirmResolved = useCallback(async () => {
    try {
      await TicketsService.ticketsControllerConfirmResolved({ ticketId: id } as any);
      message.success("已确认");
      load();
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "操作失败");
    }
  }, [id, load, message]);

  const beforeUpload = async (file: File) => {
    try {
      const res: any = await TicketsService.ticketsControllerUpload({
        ticketId: id,
        purpose: "reply",
        file,
      } as any);
      const att = res?.data?.attachment || res?.data;
      const old = form.getFieldValue("attachments") || [];
      form.setFieldsValue({
        attachments: [
          ...old,
          {
            attachmentId: att?.attachmentId,
            url: att?.url,
            name: att?.name || file.name,
            size: att?.size || file.size,
          },
        ],
      });
      setFiles((fs) =>
        fs.concat([
          {
            uid: String(Date.now()),
            name: att?.name || file.name,
            status: "done",
            url: att?.url,
          } as any,
        ]),
      );
      return false;
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "上传失败");
      return Upload.LIST_IGNORE;
    }
  };

  const onReply = async () => {
    const values = await form.validateFields();
    setReplying(true);
    try {
      await TicketsService.ticketsControllerReply({
        ticketId: id,
        content: values.content,
        attachments: values.attachments,
      } as any);
      message.success("已回复");
      form.resetFields();
      setFiles([]);
      load();
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "回复失败");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card
        loading={loading}
        title={<div className="text-lg font-bold">工单详情 #{id}</div>}
        extra={
          <Space>
            <Button variant="default" onClick={() => navigate(-1)}>
              返回
            </Button>
            <Button
              variant="text"
              className="text-destructive h-8"
              disabled={detail?.status === "closed"}
              onClick={handleClose}
            >
              关闭工单
            </Button>
            <Button disabled={detail?.status !== "resolved"} onClick={handleConfirmResolved}>
              确认已解决
            </Button>
          </Space>
        }
        className="shadow-sm"
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="标题" span={2}>
            {detail?.title}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusColor[detail?.status]}>{statusText[detail?.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="优先级">
            <Tag color={priorityColor[detail?.priority]}>{priorityText[detail?.priority]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="类别">{categoryText[detail?.category]}</Descriptions.Item>
          <Descriptions.Item label="创建人">{detail?.creatorName}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{detail?.createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="历史回复" className="shadow-sm">
        <List
          dataSource={replies}
          renderItem={(it: any) => (
            <List.Item>
              <div className="w-full space-y-2">
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>{it.userName}</span>
                  <span>{formatDate(it.createdAt)}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{it?.content}</div>
                {Array.isArray(it?.attachments) && it.attachments.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {it.attachments.map((a: any) => (
                      <a
                        key={a.attachmentId}
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary bg-primary/5 rounded px-2 py-1 text-xs hover:underline"
                      >
                        📎 {a.name}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card title="回复工单" className="shadow-sm">
        <Form form={form} layout="vertical" onFinish={onReply}>
          <Form.Item
            name="content"
            label="回复内容"
            rules={[{ required: true, message: "请输入回复内容" }]}
          >
            <Textarea rows={4} placeholder="请输入回复内容..." />
          </Form.Item>
          <Form.Item name="attachments" label="附件资料">
            <Upload
              multiple
              fileList={files}
              beforeUpload={beforeUpload}
              onRemove={(file) => {
                setFiles((fs) => fs.filter((x) => x.uid !== file.uid));
                const list = (form.getFieldValue("attachments") || []).filter(
                  (x: any) => x.name !== file.name || x.url !== (file as any).url,
                );
                form.setFieldsValue({ attachments: list });
              }}
            >
              <Button variant="default">选择附件</Button>
            </Upload>
          </Form.Item>
          <div className="flex justify-end space-x-2">
            <Button
              variant="default"
              onClick={() => {
                form.resetFields();
                setFiles([]);
              }}
            >
              清空
            </Button>
            <Button type="submit" loading={replying}>
              提交回复
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
