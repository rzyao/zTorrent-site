import { memo, useMemo, useCallback, startTransition, useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Typography,
  Space,
  Tag,
  theme,
  Empty,
  Skeleton,
} from "antd";
import { SaveOutlined, ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { componentRegistry } from "@/routes/componentRegistry";

const { Text, Title } = Typography;

interface DetailsPanelProps {
  node: RouteTreeNodeDto | null;
  onSave: (node: RouteTreeNodeDto) => void;
  onDelete: (nodeId: string) => void;
  isSaving?: boolean;
}

// 组件选项常量
const COMPONENT_OPTIONS = Object.keys(componentRegistry).sort();

// 布局选项常量
const LAYOUT_OPTIONS = [
  { value: "none", label: "无布局 (None)" },
  { value: "app", label: "前台布局 (AppLayout)" },
  { value: "forum", label: "论坛布局 (ForumLayout)" },
  { value: "admin", label: "后台布局 (AdminLayout)" },
];

// 空状态组件
const EmptyState = memo(function EmptyState() {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: token.colorBgContainer,
        border: `1px dashed ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Empty description="请在左侧选择一个路由节点" />
    </div>
  );
});

// 主组件
export const DetailsPanel = memo(function DetailsPanel({
  node,
  onSave,
  onDelete,
  isSaving,
}: DetailsPanelProps) {
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  // 延迟渲染状态 - 防止切换节点时的卡顿
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayNode, setDisplayNode] = useState<RouteTreeNodeDto | null>(null);

  // 节点切换时的处理 - 简化逻辑,移除双重延迟
  useEffect(() => {
    if (node?.id !== displayNode?.id) {
      setIsTransitioning(true);
      setDisplayNode(node);

      if (node) {
        // 直接同步更新表单,使用 Skeleton 过渡即可
        form.setFieldsValue({
          id: node.id,
          path: node.path,
          name: typeof node.name === "string" ? node.name : node.id,
          redirect: node.redirect || "",
          component: node.component || undefined,
          layout: node.layout || "none",
          permissions: node.permissions || [],
          isVisible: node.isVisible !== false,
          openInNewTab: (node as any).openInNewTab || false,
        });
      } else {
        form.resetFields();
      }

      // 短暂延迟后隐藏骨架屏,给用户视觉反馈
      const timer = setTimeout(() => setIsTransitioning(false), 100);
      return () => clearTimeout(timer);
    }
  }, [node?.id, form]);

  const handleFinish = useCallback(
    (values: any) => {
      if (!displayNode) return;
      const updatedNode: RouteTreeNodeDto = {
        ...displayNode,
        ...values,
        permissions: Array.isArray(values.permissions) ? values.permissions : [],
      };
      onSave(updatedNode);
    },
    [displayNode, onSave],
  );

  const handleReset = useCallback(() => {
    if (displayNode) {
      form.setFieldsValue({
        id: displayNode.id,
        path: displayNode.path,
        name: typeof displayNode.name === "string" ? displayNode.name : displayNode.id,
        redirect: displayNode.redirect || "",
        component: displayNode.component || undefined,
        layout: displayNode.layout || "none",
        permissions: displayNode.permissions || [],
        isVisible: displayNode.isVisible !== false,
        openInNewTab: (displayNode as any).openInNewTab || false,
      });
    }
  }, [form, displayNode]);

  const handleDelete = useCallback(() => {
    if (displayNode) {
      onDelete(displayNode.id);
    }
  }, [onDelete, displayNode]);

  const handleSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  // 无节点时显示空状态
  if (!node) {
    return <EmptyState />;
  }

  const displayName = displayNode
    ? typeof displayNode.name === "string"
      ? displayNode.name
      : displayNode.id
    : "";

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: token.boxShadowTertiary,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(5,5,5,0.06)] px-6 py-4">
        <div>
          <Space align="center">
            <Title level={4} style={{ margin: 0 }}>
              {displayName || <Skeleton.Input active size="small" style={{ width: 100 }} />}
            </Title>
            {displayNode?.isVisible === false && <Tag color="error">已隐藏</Tag>}
          </Space>
          <div className="mt-1">
            <Text type="secondary" code>
              {displayNode?.id || "..."}
            </Text>
          </div>
        </div>
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          disabled={!displayNode}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isTransitioning ? (
          <div className="space-y-4">
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            // 关闭表单验证触发，减少渲染
            validateTrigger={[]}
          >
            {/* Basic Config Section */}
            <div className="mb-6">
              <Text
                type="secondary"
                strong
                style={{ fontSize: "12px", textTransform: "uppercase" }}
              >
                基础配置
              </Text>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item label="ID (唯一标识)" name="id">
                  <Input disabled />
                </Form.Item>

                <Form.Item label="路径 Path" name="path">
                  <Input placeholder="/admin/users" />
                </Form.Item>

                <Form.Item label="显示名称 Name" name="name">
                  <Input placeholder="用户管理" />
                </Form.Item>

                <Form.Item label="重定向 Redirect" name="redirect">
                  <Input placeholder="可选: /admin/users/list" />
                </Form.Item>

                <Form.Item
                  label="新标签页打开"
                  name="openInNewTab"
                  valuePropName="checked"
                  tooltip="仅在设置了重定向时生效,勾选后将在新标签页打开重定向链接"
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </div>
            </div>

            {/* Render Config Section */}
            <div className="mb-6 border-t border-[rgba(5,5,5,0.06)] pt-6">
              <Text
                type="secondary"
                strong
                style={{ fontSize: "12px", textTransform: "uppercase" }}
              >
                渲染配置
              </Text>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item label="渲染组件 Component" name="component">
                  <Select
                    showSearch
                    placeholder="选择组件"
                    optionFilterProp="label"
                    options={COMPONENT_OPTIONS.map((c) => ({ value: c, label: c }))}
                    allowClear
                  />
                </Form.Item>

                <Form.Item label="所属布局 Layout" name="layout">
                  <Select options={LAYOUT_OPTIONS} />
                </Form.Item>
              </div>
            </div>

            {/* Access Control Section */}
            <div className="mb-6 border-t border-[rgba(5,5,5,0.06)] pt-6">
              <Text
                type="secondary"
                strong
                style={{ fontSize: "12px", textTransform: "uppercase" }}
              >
                访问控制
              </Text>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item label="访问权限 Permissions" name="permissions">
                  <Select mode="tags" placeholder="输入权限Key" />
                </Form.Item>

                <Form.Item label="侧边栏是否显示" name="isVisible" valuePropName="checked">
                  <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
                </Form.Item>
              </div>
            </div>
          </Form>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 border-t border-[rgba(5,5,5,0.06)] bg-[rgba(5,5,5,0.02)] px-6 py-4">
        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          disabled={isSaving || isTransitioning}
        >
          重置
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={isSaving}
          disabled={isTransitioning}
        >
          保存变更
        </Button>
      </div>
    </div>
  );
});
