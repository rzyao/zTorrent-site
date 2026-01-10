import { Button, Form, Input, Select, Space, Table, DatePicker, Card } from "antd";
import { BarChartOutlined, ReloadOutlined } from "@ant-design/icons";
import { useInvitesStatistics } from "@/modules/admin/shared/invites/hooks/useInvitesStatistics";

export default function InvitesStatisticsPage() {
  const { form, loading, rows, fetchStat } = useInvitesStatistics();

  return (
    <div className="space-y-4 p-4">
      <Card
        title={
          <Space>
            <BarChartOutlined />
            邀请统�?
          </Space>
        }
        className="border-none shadow-sm"
      >
        <Form form={form} layout="inline" className="gap-y-4" onFinish={fetchStat}>
          <Form.Item name="dateRange" label="时间范围">
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item name="granularity" label="统计粒度" initialValue="day">
            <Select
              className="w-32"
              options={[
                { label: "按天", value: "day" },
                { label: "按周", value: "week" },
                { label: "按月", value: "month" },
              ]}
            />
          </Form.Item>
          <Form.Item name="issuerId" label="发起人ID">
            <Input allowClear placeholder="可�? className="w-40" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
                统计
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Table
        bordered
        rowKey="time"
        dataSource={rows}
        loading={loading}
        pagination={false}
        className="rounded-lg bg-white shadow-sm"
        columns={[
          { title: "统计周期", dataIndex: "time", width: 160 },
          { title: "总量", dataIndex: "total", width: 100, className: "font-bold" },
          { title: "未使�?, dataIndex: "unused", width: 100 },
          { title: "已接�?, dataIndex: "accepted", width: 100, className: "text-green-600" },
          { title: "已过�?, dataIndex: "expired", width: 100, className: "text-orange-500" },
          { title: "已撤销", dataIndex: "revoked", width: 100, className: "text-red-500" },
        ]}
      />
    </div>
  );
}
