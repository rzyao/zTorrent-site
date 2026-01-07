import { useState, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  TreeSelect,
  Typography,
  App,
  Divider,
  InputNumber,
} from "antd";
import { CreateRouteDto } from "@/api/models/CreateRouteDto";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { componentRegistry } from "@/routes/componentRegistry";

const { Text } = Typography;
const { Option } = Select;

interface CreateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treeData: RouteTreeNodeDto[];
  onSubmit: (values: CreateRouteDto) => Promise<void>;
}

// 将路由树转换为 TreeSelect 数据结构
function convertToTreeSelectData(nodes: RouteTreeNodeDto[]): any[] {
  return nodes.map((node) => ({
    title: typeof node.name === "string" ? node.name : node.id,
    value: node.id,
    key: node.id,
    children: node.children?.length ? convertToTreeSelectData(node.children) : undefined,
  }));
}

export function CreateRouteModal({
  open,
  onOpenChange,
  treeData,
  onSubmit,
}: CreateRouteModalProps) {
  const [form] = Form.useForm<CreateRouteDto>();
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 组件列表
  const componentList = useMemo(() => Object.keys(componentRegistry).sort(), []);

  // 父级节点选择树
  const treeSelectData = useMemo(() => convertToTreeSelectData(treeData), [treeData]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // 默认值处理
      const payload: CreateRouteDto = {
        ...values,
        isVisible: values.isVisible ?? true,
        isEnabled: values.isEnabled ?? true,
        isIndex: values.isIndex ?? false,
        openInNewTab: values.openInNewTab ?? false,
        permissions: values.permissions || [],
      };

      await onSubmit(payload);
      form.resetFields();
      onOpenChange(false);
    } catch (err: any) {
      // 表单校验错误会自动显示
      if (err.errorFields) return;
      message.error(`创建失败: ${err.message || "未知错误"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onOpenChange(false);
  };

  return (
    <Modal
      title="新建路由节点"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isSubmitting}
      okText="创建"
      cancelText="取消"
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          layout: "none",
          isVisible: true,
          isEnabled: true,
          isIndex: false,
          openInNewTab: false,
          sortOrder: 0,
        }}
      >
        {/* 基础信息 */}
        <Text type="secondary" strong style={{ fontSize: "12px", textTransform: "uppercase" }}>
          基础信息
        </Text>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          <Form.Item
            label="路由标识 (routeKey)"
            name="routeKey"
            rules={[
              { required: true, message: "请输入路由标识" },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: "仅支持字母、数字、下划线和连字符" },
            ]}
            tooltip="全局唯一标识，如 admin-users"
          >
            <Input placeholder="admin-users" />
          </Form.Item>

          <Form.Item
            label="路由路径 (path)"
            name="path"
            rules={[{ required: true, message: "请输入路由路径" }]}
            tooltip="访问路径，如 /admin/users 或相对路径 users"
          >
            <Input placeholder="/admin/users 或 users" />
          </Form.Item>

          <Form.Item label="显示名称" name="name">
            <Input placeholder="用户管理" />
          </Form.Item>

          <Form.Item label="父级节点" name="parentId">
            <TreeSelect
              placeholder="根节点 (无父级)"
              allowClear
              treeData={treeSelectData}
              treeDefaultExpandAll
              showSearch
              treeNodeFilterProp="title"
            />
          </Form.Item>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* 渲染配置 */}
        <Text type="secondary" strong style={{ fontSize: "12px", textTransform: "uppercase" }}>
          渲染配置
        </Text>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          <Form.Item label="渲染组件" name="component">
            <Select showSearch allowClear placeholder="选择组件 (可选)" optionFilterProp="children">
              {componentList.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="所属布局" name="layout">
            <Select>
              <Option value="none">无布局 (None)</Option>
              <Option value="app">前台布局 (AppLayout)</Option>
              <Option value="forum">论坛布局 (ForumLayout)</Option>
              <Option value="admin">后台布局 (AdminLayout)</Option>
            </Select>
          </Form.Item>

          <Form.Item label="重定向" name="redirect">
            <Input placeholder="可选: /admin/users/list" />
          </Form.Item>

          <Form.Item label="排序权重" name="sortOrder" tooltip="数字越小越靠前">
            <InputNumber min={0} step={10} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* 访问控制 */}
        <Text type="secondary" strong style={{ fontSize: "12px", textTransform: "uppercase" }}>
          访问控制
        </Text>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          <Form.Item label="访问权限" name="permissions" tooltip="输入权限Key并回车">
            <Select mode="tags" placeholder="输入权限 Key" />
          </Form.Item>

          <div className="flex items-end gap-6 pb-2">
            <Form.Item label="菜单可见" name="isVisible" valuePropName="checked" className="mb-0">
              <Switch />
            </Form.Item>

            <Form.Item label="启用状态" name="isEnabled" valuePropName="checked" className="mb-0">
              <Switch />
            </Form.Item>

            <Form.Item
              label="索引路由"
              name="isIndex"
              valuePropName="checked"
              className="mb-0"
              tooltip="是否为默认子路由"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="新签页"
              name="openInNewTab"
              valuePropName="checked"
              className="mb-0"
              tooltip="在新标签页中打开链接"
            >
              <Switch />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
