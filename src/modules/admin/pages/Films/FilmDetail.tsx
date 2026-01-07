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
  Switch,
  Select,
  Alert,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { MoviesService } from "@/api/services/MoviesService";
import type { UpdateMovieDto } from "@/api/models/UpdateMovieDto";
import { extractErrorMessage } from "@/utils/errorMessage";

// 说明：详情页用于展示影片信息
// 关联种子功能暂未适配新的 Movie 模型（缺少接口），故暂时隐藏
export default function FilmDetail() {
  const { message: msg } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const showError = (e: any, fallback: string) => {
    try {
      const m = extractErrorMessage(e, fallback);
      msg.error(m || fallback);
    } catch {
      msg.error(fallback);
    }
  };
  const [loading, setLoading] = useState(false);

  // 详情本地类型
  type FilmDetailItem = {
    id?: string;
    title?: string;
    originalTitle?: string;
    year?: string;
    categories?: string[];
    rating?: number;
    director?: string;
    posterUrl?: string;
    backdropUrl?: string;
    enabled?: boolean;
    sort?: number;
    genres?: string[];
    cast?: string[];
    description?: string;
    duration?: string;
    imdbLink?: string;
    doubanLink?: string;
  };

  const [detail, setDetail] = useState<FilmDetailItem | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm] = Form.useForm<{ id: string; data: any }>();
  const [saving, setSaving] = useState(false);

  // 分类选项列表 (硬编码)
  const [categoryOptions] = useState<{ label: string; value: string }[]>([
    { label: "动作", value: "Action" },
    { label: "喜剧", value: "Comedy" },
    { label: "剧情", value: "Drama" },
    { label: "科幻", value: "Sci-Fi" },
    { label: "惊悚", value: "Thriller" },
    { label: "恐怖", value: "Horror" },
    { label: "爱情", value: "Romance" },
    { label: "动画", value: "Animation" },
    { label: "纪录片", value: "Documentary" },
  ]);

  async function loadDetail() {
    if (!id) return;
    setLoading(true);
    try {
      // 拉取公开影片详情
      const resp: any = await MoviesService.movieBaseControllerGetDetail({
        id,
      });
      const api: any = resp?.data || {};
      const mapped: FilmDetailItem = {
        id: api?.id,
        title: api?.title,
        originalTitle: api?.originalTitle,
        year: api?.year,
        categories: api?.categories,
        rating: api?.rating,
        director: api?.director,
        posterUrl: api?.posterUrl,
        backdropUrl: api?.backdropUrl,
        enabled: api?.enabled,
        sort: api?.sort,
        genres: api?.genres,
        cast: api?.cast,
        description: api?.description,
        duration: api?.duration ? String(api.duration) : undefined,
        imdbLink: api?.imdbLink,
        doubanLink: api?.doubanLink,
      };
      setDetail(mapped);
    } catch (e: any) {
      showError(e, "加载影片详情失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
  }, [id]);

  function openEdit() {
    if (!detail) return;
    editForm.setFieldsValue({
      id: detail.id!,
      data: {
        title: detail.title,
        originalTitle: detail.originalTitle,
        year: detail.year,
        categories: detail.categories,
        rating: detail.rating,
        description: detail.description,
        posterUrl: detail.posterUrl,
        backdropUrl: detail.backdropUrl,
        duration: detail.duration,
        director: detail.director,
        sort: detail.sort,
        enabled: detail.enabled,
        genres: detail.genres,
        cast: detail.cast,
      },
    });
    setIsEditOpen(true);
  }

  async function submitEdit() {
    try {
      const values = await editForm.validateFields();
      setSaving(true);
      await MoviesService.movieBaseControllerUpdate({
        id: values.id,
        ...values.data,
      });
      setIsEditOpen(false);
      msg.success("更新影片成功");
      loadDetail();
    } catch (e: any) {
      showError(e, "更新影片失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card
        loading={loading}
        title={`影片详情：${detail?.title || id}`}
        extra={
          <Space>
            <Button onClick={() => navigate("/films")}>返回列表</Button>
            <Button type="primary" onClick={openEdit}>
              编辑
            </Button>
          </Space>
        }
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="ID">{detail?.id}</Descriptions.Item>
          <Descriptions.Item label="原名">{detail?.originalTitle}</Descriptions.Item>
          <Descriptions.Item label="年份">{detail?.year}</Descriptions.Item>
          <Descriptions.Item label="分类">{detail?.categories?.join(", ")}</Descriptions.Item>
          <Descriptions.Item label="评分">{detail?.rating}</Descriptions.Item>
          <Descriptions.Item label="导演">{detail?.director}</Descriptions.Item>
          <Descriptions.Item label="海报">{detail?.posterUrl}</Descriptions.Item>
          <Descriptions.Item label="背景">{detail?.backdropUrl}</Descriptions.Item>
          <Descriptions.Item label="启用">
            {detail?.enabled === undefined ? "-" : String(detail?.enabled)}
          </Descriptions.Item>
          <Descriptions.Item label="排序">{detail?.sort}</Descriptions.Item>
          <Descriptions.Item label="流派">{detail?.genres?.join(", ")}</Descriptions.Item>
          <Descriptions.Item label="演职员">{detail?.cast?.join(", ")}</Descriptions.Item>
          <Descriptions.Item label="IMDb">{detail?.imdbLink}</Descriptions.Item>
          <Descriptions.Item label="豆瓣">{detail?.doubanLink}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {detail?.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="关联种子">
        <Alert
          message="提示"
          description="种子管理功能正在升级适配中，暂不可用。"
          type="info"
          showIcon
        />
        {/* 原有种子列表表格代码已移除，待 API 支持后再恢复 */}
      </Card>

      <Modal
        title="编辑影片"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={submitEdit}
        okText="保存"
        confirmLoading={saving}
        destroyOnClose
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() => (
              <>
                <Form.Item
                  name={["data", "title"]}
                  label="标题"
                  rules={[{ required: true, message: "请输入标题" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name={["data", "originalTitle"]} label="原名">
                  <Input />
                </Form.Item>
                <Space>
                  <Form.Item name={["data", "year"]} label="年份">
                    <Input />
                  </Form.Item>
                  <Form.Item name={["data", "rating"]} label="评分">
                    <InputNumber min={0} max={10} step={0.1} />
                  </Form.Item>
                  <Form.Item name={["data", "duration"]} label="时长">
                    <InputNumber />
                  </Form.Item>
                </Space>
                <Form.Item name={["data", "categories"]} label="分类">
                  <Select mode="tags" options={categoryOptions} />
                </Form.Item>
                <Form.Item name={["data", "description"]} label="描述">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name={["data", "posterUrl"]} label="海报URL">
                  <Input />
                </Form.Item>
                <Form.Item name={["data", "backdropUrl"]} label="背景URL">
                  <Input />
                </Form.Item>
                <Form.Item name={["data", "director"]} label="导演">
                  <Input />
                </Form.Item>
                <Space>
                  <Form.Item name={["data", "sort"]} label="排序">
                    <InputNumber />
                  </Form.Item>
                  <Form.Item name={["data", "enabled"]} label="启用" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Space>
                <Form.Item name={["data", "genres"]} label="流派ID（数组）">
                  <Select mode="tags" tokenSeparators={[","]} placeholder="输入ID后回车" />
                </Form.Item>
                <Form.Item name={["data", "cast"]} label="演职员（数组）">
                  <Select mode="tags" tokenSeparators={[","]} placeholder="输入名称后回车" />
                </Form.Item>
              </>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
