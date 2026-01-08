import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Result,
  Modal,
  Select,
  InputNumber,
  DatePicker,
  Typography,
} from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useSendInvite } from "@/modules/admin/shared/invites/hooks/useSendInvite";

export default function SendInvitePage() {
  const {
    form,
    batchOpen,
    setBatchOpen,
    batchForm,
    batchLoading,
    rolesOptions,
    levelsOptions,
    previewCount,
    canOfficial,
    canManageInvites,
    handleSubmit,
    loadOptions,
    previewMatching,
    executeBatchGrant,
  } = useSendInvite();

  if (!canOfficial) {
    return (
      <div className="flex h-full items-center justify-center">
        <Result status="403" title="无权限" subTitle="申请该权限或联系管理员" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card title="发送官方邀请" className="border-none shadow-sm">
        <Form form={form} layout="vertical" className="max-w-2xl">
          <Form.Item
            name="email"
            label="受邀邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input placeholder="name@example.com" size="large" allowClear />
          </Form.Item>
          <Form.Item
            name="username"
            label="受邀用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" size="large" allowClear />
          </Form.Item>
          <Form.Item className="mt-8">
            <Space size="middle">
              <Button
                type="primary"
                size="large"
                icon={<SafetyCertificateOutlined />}
                onClick={handleSubmit}
              >
                发送邀请邮件
              </Button>
              {canManageInvites && (
                <Button
                  size="large"
                  onClick={() => {
                    setBatchOpen(true);
                    loadOptions();
                  }}
                >
                  批量授予名额
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="批量授予邀请名额"
        open={batchOpen}
        onCancel={() => setBatchOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={batchForm} layout="vertical" className="p-2">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="levels" label="用户等级（多选）">
              <Select mode="multiple" allowClear options={levelsOptions} placeholder="筛选等级" />
            </Form.Item>
            <Form.Item name="roles" label="用户角色（多选）">
              <Select mode="multiple" allowClear options={rolesOptions} placeholder="筛选角色" />
            </Form.Item>
          </div>

          <Form.Item name="logic" label="过滤逻辑" initialValue="OR">
            <Select
              options={[
                { label: "满足任一（OR）", value: "OR" },
                { label: "同时满足（AND）", value: "AND" },
              ]}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="permanent" label="永久名额" initialValue={0}>
              <InputNumber min={0} className="w-full" placeholder="输入数量" />
            </Form.Item>
            <Form.Item name="temporaryCount" label="临时名额" initialValue={0}>
              <InputNumber min={0} className="w-full" placeholder="输入数量" />
            </Form.Item>
          </div>

          <Form.Item name="temporaryExpiresAt" label="临时名额过期时间">
            <DatePicker showTime className="w-full" />
          </Form.Item>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <Space>
              <Button onClick={previewMatching} loading={batchLoading}>
                预览匹配
              </Button>
              <Button type="primary" onClick={executeBatchGrant} loading={batchLoading}>
                提交执行
              </Button>
            </Space>
            <Typography.Text type="secondary" className="font-semibold text-blue-600">
              匹配用户数：{previewCount}
            </Typography.Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
