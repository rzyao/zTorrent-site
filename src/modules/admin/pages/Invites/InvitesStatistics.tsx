import { useState } from "react";
import { App, Button, Form, Input, Select, Space, Table, DatePicker, Card } from "antd";
import { BarChartOutlined, ReloadOutlined } from "@ant-design/icons";
import type { StatisticsDto } from "@/api/models/StatisticsDto";
import { Service as InvitesService } from "@/api/services/Service";

/**
 * 邀请统计页
 * 说明：以 createdAt 为时间维度，展示各状态的数量聚合
 */
export default function InvitesStatistics() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<
    Array<{
      time: string;
      total: number;
      unused: number;
      accepted: number;
      expired: number;
      revoked: number;
    }>
  >([]);

  const fetchStat = async () => {
    setLoading(true);
    try {
      const v = form.getFieldsValue();
      const req: StatisticsDto = {
        dateFrom: v.dateRange?.[0]?.toISOString?.() ?? "",
        dateTo: v.dateRange?.[1]?.toISOString?.() ?? "",
        granularity: v.granularity || "day",
        issuerId: v.issuerId || undefined,
      };
      const resp = await InvitesService.inviteStatsControllerStatistics(req);
      const buckets = (resp as any)?.data?.buckets ?? [];
      setRows(Array.isArray(buckets) ? buckets : []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "加载统计失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <Card
        title={
          <>
            <BarChartOutlined /> 邀请统计
          </>
        }
      >
        <Form form={form} layout="inline" onFinish={fetchStat}>
          <Form.Item name="dateRange" label="日期范围">
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item name="granularity" label="粒度" initialValue="day">
            <Select
              style={{ width: 140 }}
              options={[
                { label: "按天", value: "day" },
                { label: "按周", value: "week" },
                { label: "按月", value: "month" },
              ]}
            />
          </Form.Item>
          <Form.Item name="issuerId" label="发起人ID">
            <Input allowClear placeholder="可选" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
                统计
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setRows([]);
                }}
              >
                清空
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Table
        bordered
        // 统一开启表格边框，便于对比各统计列并提升阅读性
        style={{ marginTop: 12 }}
        rowKey="time"
        dataSource={rows}
        loading={loading}
        pagination={false}
        columns={[
          { title: "时间", dataIndex: "time", width: 160 },
          { title: "总数", dataIndex: "total", width: 100 },
          { title: "未使用", dataIndex: "unused", width: 100 },
          { title: "已接受", dataIndex: "accepted", width: 100 },
          { title: "已过期", dataIndex: "expired", width: 100 },
          { title: "已撤销", dataIndex: "revoked", width: 100 },
        ]}
      />
    </div>
  );
}
