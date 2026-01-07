import { useEffect, useState } from "react";
import {
  App,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  List,
  Modal,
  Space,
  Tag,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useParams, useNavigate } from "react-router-dom";
import { TicketsService } from "@/api/services/TicketsService";
import type { TicketDetailDto } from "@/api/models/TicketDetailDto";
import type { ReplyDto } from "@/api/models/ReplyDto";
import type { CloseTicketDto } from "@/api/models/CloseTicketDto";
import type { ConfirmResolvedDto } from "@/api/models/ConfirmResolvedDto";
import { statusText, statusColor, categoryText, priorityText, priorityColor } from "./_dicts";

/**
 * 工单管理 - 详情页
 * 功能：展示工单详情与历史回复；支持回复（含附件上传）、关闭与确认已解决
 */
export default function TicketDetail() {
  const { message } = App.useApp();
  const nav = useNavigate();
  const { id = "" } = useParams();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replying, setReplying] = useState(false);
  const [form] = Form.useForm<ReplyDto>();
  const [files, setFiles] = useState<UploadFile[]>([]);

  /** 加载详情与回复列表 */
  const load = async () => {
    setLoading(true);
    try {
      const res: any = await TicketsService.ticketsControllerDetail({
        ticketId: id,
      } as TicketDetailDto);
      setDetail(res?.data?.detail || res?.data || {});
      setReplies(res?.data?.replies ?? []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [id]);

  /** 关闭工单 */
  const handleClose = () => {
    Modal.confirm({
      title: "确认关闭该工单？",
      onOk: async () => {
        try {
          await TicketsService.ticketsControllerClose({
            ticketId: id,
            reason: "后台关闭",
          } as CloseTicketDto);
          message.success("已关闭");
          load();
        } catch (e: any) {
          message.error(e?.response?.data?.message || e?.message || "关闭失败");
        }
      },
    });
  };

  /** 确认已解决 */
  const handleConfirmResolved = async () => {
    try {
      await TicketsService.ticketsControllerConfirmResolved({ ticketId: id } as ConfirmResolvedDto);
      message.success("已确认");
      load();
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "操作失败");
    }
  };

  /**
   * 附件上传：调用后端上传接口获取可用于提交回复的附件信息
   * 注意：具体后端返回结构可能不同，这里以常见 { attachmentId, url, name, size } 为例
   */
  const beforeUpload = async (file: File) => {
    try {
      const res: any = await TicketsService.ticketsControllerUpload({
        ticketId: id,
        purpose: "reply",
        file,
      } as any);
      const att = res?.data?.attachment || res?.data;
      // 将附件写入回复表单字段 attachments，结构需满足 ReplyAttachmentInput
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

  /** 提交回复 */
  const onReply = async () => {
    const values = await form.validateFields();
    setReplying(true);
    try {
      await TicketsService.ticketsControllerReply({
        ticketId: id,
        content: values.content,
        attachments: values.attachments,
      } as ReplyDto);
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
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Card
        loading={loading}
        title={`工单详情 #${id}`}
        extra={
          <Space>
            <Button onClick={() => nav("/tickets")}>返回列表</Button>
            <Button danger disabled={detail?.status === "closed"} onClick={handleClose}>
              关闭工单
            </Button>
            <Button
              type="primary"
              disabled={detail?.status !== "resolved"}
              onClick={handleConfirmResolved}
            >
              确认已解决
            </Button>
          </Space>
        }
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

      <Card title="历史回复">
        <List
          dataSource={replies}
          renderItem={(it: any) => (
            <List.Item>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>{it?.content}</div>
                {/* 附件列表（如有） */}
                {Array.isArray(it?.attachments) && it.attachments.length > 0 ? (
                  <Space wrap>
                    {it.attachments.map((a: any) => (
                      <a key={a.attachmentId} href={a.url} target="_blank" rel="noreferrer">
                        {a.name}
                      </a>
                    ))}
                  </Space>
                ) : null}
              </Space>
            </List.Item>
          )}
        />
      </Card>

      <Card title="回复">
        <Form form={form} layout="vertical" onFinish={onReply}>
          <Form.Item
            name="content"
            label="回复内容"
            rules={[{ required: true, message: "请输入回复内容" }]}
          >
            <Input.TextArea rows={4} maxLength={2000} showCount />
          </Form.Item>
          <Form.Item name="attachments" label="附件">
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
              <Button>选择文件</Button>
            </Upload>
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={replying}>
              提交回复
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setFiles([]);
              }}
            >
              重置
            </Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}
