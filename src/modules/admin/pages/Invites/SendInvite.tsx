import { useMemo, useState } from "react";
import {
  App,
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
import type { SendInviteDto } from "@/api/models/SendInviteDto";
import { Service as InvitesService } from "@/api/services/Service";
import { UsersService } from "@/api/services/UsersService";
import { RolesService } from "@/api/services/RolesService";
import { LevelsService } from "@/api/services/LevelsService";
import type { ListUsersDto } from "@/api/models/ListUsersDto";
import type { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import type { RoleDto } from "@/api/models/RoleDto";

/**
 * 发送邀请页
 * 权限：
 *  - 私人邀请按钮需要 send-invite-private
 *  - 官方邀请按钮需要 send-official-invite
 * 若两者均无，则页面展示 403 提示
 */
export default function SendInvite() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchForm] = Form.useForm();
  const [batchLoading, setBatchLoading] = useState(false);
  const [rolesOptions, setRolesOptions] = useState<{ label: string; value: string }[]>([]);
  const [levelsOptions, setLevelsOptions] = useState<{ label: string; value: string }[]>([]);
  const [previewCount, setPreviewCount] = useState(0);

  // 读取权限集合与判定
  const perms = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]") as string[];
    } catch {
      return [];
    }
  }, []);
  const isSuperAdmin = (localStorage.getItem("username") || "") === "admin";
  const hasPerm = (key: string) => isSuperAdmin || perms.includes(key);
  const canOfficial = hasPerm("send-official-invite");
  const canManageInvites = hasPerm("manage-invites");

  const handleSubmit = async () => {
    try {
      const v = (await form.validateFields()) as SendInviteDto;
      const resp = await InvitesService.inviteCoreControllerSendOfficial(v);
      const ok = (resp as any)?.code === 1000 || !!(resp as any)?.data?.recordId;
      if (ok) {
        const rid = (resp as any)?.data?.recordId;
        message.success(`邀请已发送，记录ID：${rid}`);
        form.resetFields();
      } else {
        message.error((resp as any)?.message || "发送失败");
      }
    } catch (e: any) {
      if (e?.errorFields) return; // 表单校验错误
      message.error(e?.response?.data?.message || e?.message || "发送失败");
    }
  };

  async function loadRolesOptions() {
    try {
      const resp: any = await RolesService.rolesControllerListRoles({
        page: 1,
        limit: 100,
      });
      const items: RoleDto[] = (resp?.data?.items || []) as RoleDto[];
      const opts = items.map((r) => ({
        label: String(r.name || r.key),
        value: String(r.key),
      }));
      setRolesOptions(opts);
    } catch (e: any) {
      // ignore
    }
  }

  async function loadLevelsOptions() {
    try {
      const resp: any = await LevelsService.levelsCoreControllerList({
        page: 1,
        limit: 100,
      });
      const items: any[] = resp?.data?.items || [];
      const opts = items.map((x: any) => ({
        label: String(x.label || x.key || ""),
        value: String(x.key || ""),
      }));
      setLevelsOptions(opts);
    } catch (e: any) {}
  }

  function buildUserListRequest(values: any): ListUsersDto {
    const rules: AdvancedRuleDto[] = [] as any;
    const lvls: string[] = Array.isArray(values.levels) ? values.levels : [];
    const roles: string[] = Array.isArray(values.roles) ? values.roles : [];
    if (lvls.length) {
      rules.push({ field: "level", op: "In" as any, value: lvls as any });
    }
    if (roles.length) {
      rules.push({ field: "roles", op: "In" as any, value: roles as any });
    }
    const logic: any = values.logic === "AND" ? "AND" : "OR";
    return { page: 1, limit: 100, rules, logic };
  }

  async function previewMatching() {
    setBatchLoading(true);
    try {
      const v = await batchForm.validateFields();
      const req = buildUserListRequest(v);
      let total = 0;
      let page = 1;
      while (true) {
        const resp: any = await UsersService.usersControllerListUsers({
          ...req,
          page,
        });
        const items: any[] = resp?.data?.items || [];
        total += items.length;
        const limit = Number((req as any).limit || 100);
        if (!items.length || items.length < limit) break;
        page += 1;
        if (page > 100) break;
      }
      setPreviewCount(total);
      message.success(`匹配用户数：${total}`);
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || e?.message || "预览失败");
    } finally {
      setBatchLoading(false);
    }
  }

  async function executeBatchGrant() {
    setBatchLoading(true);
    try {
      const v = await batchForm.validateFields();
      const req = buildUserListRequest(v);
      let page = 1;
      let success = 0;
      let fail = 0;
      const permanent = Number(v.permanent || 0);
      const temporaryCount = Number(v.temporaryCount || 0);
      const temporaryExpiresAt =
        v.temporaryExpiresAt && typeof v.temporaryExpiresAt.toISOString === "function"
          ? v.temporaryExpiresAt.toISOString()
          : undefined;
      while (true) {
        const usersResp: any = await UsersService.usersControllerListUsers({
          ...req,
          page,
        });
        const items: any[] = usersResp?.data?.items || [];
        if (!items.length) break;
        for (const u of items) {
          try {
            await InvitesService.inviteQuotaControllerGrantQuota({
              userId: String(u.id),
              permanent,
              temporaryCount,
              temporaryExpiresAt,
            });
            success += 1;
          } catch (e) {
            fail += 1;
          }
        }
        const limit = Number((req as any).limit || 100);
        if (items.length < limit) break;
        page += 1;
        if (page > 100) break;
      }
      message.success(`批量授予完成：成功 ${success}，失败 ${fail}`);
      setBatchOpen(false);
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || e?.message || "批量授予失败");
    } finally {
      setBatchLoading(false);
    }
  }

  if (!canOfficial) {
    return <Result status="403" title="无权限" subTitle="需要权限：send-official-invite" />;
  }

  return (
    <div style={{ padding: 12 }}>
      <Card title="发送官方邀请">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input placeholder="被邀请邮箱" allowClear />
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" allowClear />
          </Form.Item>
          <Form.Item label="操作">
            <Space>
              <Button
                type="primary"
                icon={<SafetyCertificateOutlined />}
                disabled={!canOfficial}
                onClick={handleSubmit}
              >
                发送官方邀请
              </Button>
              {canManageInvites && (
                <Button
                  onClick={() => {
                    setBatchOpen(true);
                    setPreviewCount(0);
                    loadRolesOptions();
                    loadLevelsOptions();
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
        title="批量授予名额"
        open={!!batchOpen}
        onCancel={() => setBatchOpen(false)}
        footer={null}
      >
        <Form form={batchForm} layout="vertical">
          <Form.Item name="levels" label="用户等级（多选）">
            <Select mode="multiple" allowClear options={levelsOptions} />
          </Form.Item>
          <Form.Item name="roles" label="用户角色（多选）">
            <Select mode="multiple" allowClear options={rolesOptions} placeholder="选择角色" />
          </Form.Item>
          <Form.Item name="logic" label="命中逻辑" initialValue="OR">
            <Select
              options={[
                { label: "满足任一(OR)", value: "OR" },
                { label: "同时满足(AND)", value: "AND" },
              ]}
            />
          </Form.Item>
          <Form.Item name="permanent" label="永久名额数量" initialValue={0}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="temporaryCount" label="临时名额数量" initialValue={0}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="temporaryExpiresAt" label="临时名额过期时间">
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Space>
            <Button onClick={previewMatching} loading={!!batchLoading}>
              预览匹配
            </Button>
            <Button type="primary" onClick={executeBatchGrant} loading={!!batchLoading}>
              提交授予
            </Button>
            <Typography.Text type="secondary">匹配数：{previewCount}</Typography.Text>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
