import { useEffect, useState } from "react";
import {
  App,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tag,
} from "antd";
import { useParams } from "react-router-dom";
import { PlaylistsService } from "@/api/services/PlaylistsService";
import { PlaylistsItemsService } from "@/api/services/PlaylistsItemsService";
import { PlaylistsReviewService } from "@/api/services/PlaylistsReviewService";
import { PlaylistsInteractionService } from "@/api/services/PlaylistsInteractionService";
import { ReviewDto } from "@/api/models/ReviewDto";
import { AddItemToPlaylistDto } from "@/api/models/AddItemToPlaylistDto";
import { RemoveItemFromPlaylistDto } from "@/api/models/RemoveItemFromPlaylistDto";
import { PlaylistItemOrderInfo } from "@/api/models/PlaylistItemOrderInfo";

// 说明：详情页用于展示片单信息与维护与影片的关系（添加/移除/排序），并可调用运营统计接口
export default function PlaylistDetail() {
  const { message: msg } = App.useApp();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm] = Form.useForm<{ filmId: string; sort?: number }>();
  const [reorderOpen, setReorderOpen] = useState(false);
  const [reorderForm] = Form.useForm<{ filmId: string; sort: number }>();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<ReviewDto.action>(ReviewDto.action.APPROVE);
  const [reviewForm] = Form.useForm<{ note?: string }>();

  async function loadDetail() {
    if (!id) return;
    setLoading(true);
    try {
      const resp: any = await PlaylistsService.playlistCoreControllerGet({ id });
      const data = resp?.data || {};
      setDetail(data);
      setMovies(Array.isArray((data as any)?.movies) ? (data as any).movies : []);
    } catch (e: any) {
      msg.error(e?.message || "加载片单详情失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
  }, [id]);

  async function addFilm() {
    try {
      const v = await addForm.validateFields();
      await PlaylistsItemsService.playlistItemsControllerAddItem({
        playlistId: id!,
        itemId: v.filmId,
        itemType: AddItemToPlaylistDto.itemType.MOVIE,
      });
      setAddOpen(false);
      msg.success("已添加影片到片单");
      loadDetail();
    } catch (e: any) {
      msg.error(e?.message || "添加失败");
    }
  }

  async function removeFilm(filmId?: string) {
    if (!filmId) return;
    try {
      await PlaylistsItemsService.playlistItemsControllerRemoveItem({
        playlistId: id!,
        itemId: filmId,
        itemType: RemoveItemFromPlaylistDto.itemType.MOVIE,
      });
      msg.success("已移除影�?);
      loadDetail();
    } catch (e: any) {
      msg.error(e?.message || "移除失败");
    }
  }

  async function submitReorder() {
    try {
      const v = await reorderForm.validateFields();
      const current = (movies || []).map((m: any) => String(m.filmId)).filter(Boolean);
      const target = String(v.filmId);
      const without = current.filter((f) => f !== target);
      const pos = Math.max(0, Math.min(v.sort ?? 0, without.length));
      const orderIds = [...without.slice(0, pos), target, ...without.slice(pos)];
      const order = orderIds.map((itemId) => ({
        itemId,
        itemType: PlaylistItemOrderInfo.itemType.MOVIE,
      }));
      await PlaylistsItemsService.playlistItemsControllerReorderItems({ playlistId: id!, order });
      setReorderOpen(false);
      msg.success("已更新排�?);
      loadDetail();
    } catch (e: any) {
      msg.error(e?.message || "更新排序失败");
    }
  }

  async function review(action: ReviewDto.action, note?: string) {
    if (!id) return;
    try {
      await PlaylistsReviewService.playlistReviewControllerReview({ id, action, note });
      msg.success(action === ReviewDto.action.APPROVE ? "审核通过成功" : "审核驳回成功");
      loadDetail();
    } catch (e: any) {
      msg.error(e?.message || "审核操作失败");
    }
  }

  async function incViews() {
    try {
      const resp: any = await PlaylistsInteractionService.playlistInteractionControllerIncViews({
        id: id!,
      });
      msg.success(`浏览�?{resp?.data?.views ?? ""}`);
      loadDetail();
    } catch {
      msg.error("浏览统计失败");
    }
  }

  async function like() {
    try {
      const resp: any = await PlaylistsInteractionService.playlistInteractionControllerLike({
        id: id!,
      });
      msg.success(`点赞�?{resp?.data?.likes ?? ""}`);
      loadDetail();
    } catch {
      msg.error("点赞失败");
    }
  }

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="large">
      <Card
        loading={loading}
        title={`片单详情�?{detail?.title || id}`}
        extra={
          <Space>
            <Button onClick={incViews}>浏览+1</Button>
            <Button onClick={like}>点赞</Button>
            <Button onClick={() => review(ReviewDto.action.APPROVE)}>通过</Button>
            <Button
              danger
              onClick={() => {
                setReviewAction(ReviewDto.action.REJECT);
                setReviewOpen(true);
                reviewForm.resetFields();
              }}
            >
              驳回
            </Button>
          </Space>
        }
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="ID">{detail?.id}</Descriptions.Item>
          <Descriptions.Item label="类型">{detail?.type}</Descriptions.Item>
          <Descriptions.Item label="可见�?>{detail?.visibility}</Descriptions.Item>
          <Descriptions.Item label="启用">{String(detail?.enabled)}</Descriptions.Item>
          <Descriptions.Item label="排序">{detail?.sort}</Descriptions.Item>
          <Descriptions.Item label="封面">{detail?.coverUrl}</Descriptions.Item>
          <Descriptions.Item label="浏览">{detail?.views}</Descriptions.Item>
          <Descriptions.Item label="点赞">{detail?.likes}</Descriptions.Item>
          <Descriptions.Item label="审核状�?>{detail?.approvalStatus}</Descriptions.Item>
          <Descriptions.Item label="通过时间">{detail?.approvedAt}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {detail?.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="片单内影�?>
        <Space style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            onClick={() => {
              addForm.resetFields();
              setAddOpen(true);
            }}
          >
            添加影片
          </Button>
        </Space>
        <Table
          bordered
          // 为片单影片列表开启边框，便于管理排序与可见�?
          rowKey={(r) => (r as any)?.filmId || (r as any)?.id}
          dataSource={movies}
          pagination={false}
          columns={[
            { title: "影片ID", dataIndex: "filmId", width: 160 },
            { title: "标题", dataIndex: "title", ellipsis: true },
            { title: "排序", dataIndex: "sort", width: 80 },
            {
              title: "可见",
              dataIndex: "visible",
              width: 80,
              render: (v: boolean) => <Tag color={v ? "green" : "red"}>{String(v)}</Tag>,
            },
            {
              title: "操作",
              width: 220,
              render: (_: any, record: any) => (
                <Space>
                  <Button
                    type="link"
                    onClick={() => {
                      reorderForm.setFieldsValue({ filmId: record.filmId, sort: record.sort });
                      setReorderOpen(true);
                    }}
                  >
                    调整排序
                  </Button>
                  <Button type="link" danger onClick={() => removeFilm(record.filmId)}>
                    移除
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* 添加影片到片�?*/}
      <Modal
        title="添加影片到片�?
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        onOk={addFilm}
        okText="保存"
        destroyOnHidden
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="filmId"
            label="影片ID"
            rules={[{ required: true, message: "请输入影片ID" }]}
          >
            <Input placeholder="请输入要添加的影片ID" />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 排序调整：基�?filmId 更新 sort */}
      <Modal
        title="更新排序"
        open={reorderOpen}
        onCancel={() => setReorderOpen(false)}
        onOk={submitReorder}
        okText="保存"
        destroyOnHidden
      >
        <Form form={reorderForm} layout="vertical">
          <Form.Item name="filmId" label="影片ID" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="sort" label="排序" rules={[{ required: true, message: "请输入排序�? }]}>
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={reviewAction === ReviewDto.action.APPROVE ? "审核通过" : "审核驳回"}
        open={reviewOpen}
        onCancel={() => setReviewOpen(false)}
        onOk={async () => {
          const v = await reviewForm.validateFields().catch(() => null);
          setReviewOpen(false);
          await review(reviewAction, v?.note);
        }}
        okText="提交"
        destroyOnHidden
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="note" label="备注（≤500字）">
            <Input.TextArea
              rows={4}
              maxLength={500}
              showCount
              placeholder="请输入备注原因（可选）"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
