import { useState, useEffect } from "react";
import {
  Card,
  Space,
  Typography,
  Tag,
  Input,
  Segmented,
  Button,
  Modal,
  Form,
  Select,
  Skeleton,
  Empty,
  Popconfirm,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownOutlined,
  RightOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import type { Permission, PermissionType, PermissionScope } from "./types/permission";
import { PermissionsService } from "@/api/services/PermissionsService";
import { ListPermissionsDto } from "@/api/models/ListPermissionsDto";
import { CreatePermissionDto } from "@/api/models/CreatePermissionDto";
import { UpdatePermissionRequestDto as UpdatePermissionDto } from "@/api/models/UpdatePermissionRequestDto";

/**
 * 权限页面 Props
 */
interface PermissionsPageProps {
  /** 权限作用范围：web (网页端) 或 admin (后台管理) */
  scope: "admin" | "web";
  /** 页面标题 */
  title?: string;
}

/**
 * 权限管理页面组件
 * 支持通过 props 指定 scope，用于拆分为独立的网页权限/后台权限页面
 */
export default function PermissionsPage({ scope, title }: PermissionsPageProps) {
  const USE_MOCK = false;
  const { message } = App.useApp();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [parentId, setParentId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<PermissionType | "">("");
  const [searchText, setSearchText] = useState("");

  const [formData, setFormData] = useState<{
    key: string;
    name: string;
    description: string;
    type: PermissionType;
    scope: PermissionScope;
  }>({
    key: "",
    name: "",
    description: "",
    type: "page",
    scope: scope,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    loadPermissions();
  }, [typeFilter, scope]);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        const now = new Date().toISOString();
        const mock: Permission[] = [
          {
            id: "mock-page-dashboard",
            key: `${scope}/dashboard`,
            name: "仪表盘",
            description: "系统概览页面",
            type: "page",
            scope,
            children: [
              {
                id: "mock-button-refresh",
                key: `${scope}/dashboard/refresh`,
                name: "刷新数据",
                description: "刷新仪表盘数据",
                type: "button",
                scope,
                parent_id: "mock-page-dashboard",
                children: [
                  {
                    id: "mock-api-dashboard-refresh",
                    key: `${scope}/dashboard/refresh:POST`,
                    name: "刷新接口",
                    description: "调用刷新接口",
                    type: "api",
                    scope,
                    parent_id: "mock-button-refresh",
                  },
                ],
              },
            ],
            created_at: now,
            updated_at: now,
          },
          {
            id: "mock-page-users",
            key: `${scope}/users`,
            name: "用户管理",
            description: "管理系统用户",
            type: "page",
            scope,
            children: [
              {
                id: "mock-button-create-user",
                key: `${scope}/users/create`,
                name: "创建用户按钮",
                description: "页面内创建用户操作",
                type: "button",
                scope,
                parent_id: "mock-page-users",
                children: [
                  {
                    id: "mock-api-users-create",
                    key: `${scope}/users/create:POST`,
                    name: "创建用户接口",
                    description: "后端创建用户接口",
                    type: "api",
                    scope,
                    parent_id: "mock-button-create-user",
                  },
                ],
              },
              {
                id: "mock-button-delete-user",
                key: `${scope}/users/delete`,
                name: "删除用户按钮",
                description: "页面内删除用户操作",
                type: "button",
                scope,
                parent_id: "mock-page-users",
                children: [
                  {
                    id: "mock-api-users-delete",
                    key: `${scope}/users/delete:DELETE`,
                    name: "删除用户接口",
                    description: "后端删除用户接口",
                    type: "api",
                    scope,
                    parent_id: "mock-button-delete-user",
                  },
                ],
              },
            ],
            created_at: now,
            updated_at: now,
          },
        ];

        const filterByTypeTree = (nodes: Permission[], t?: PermissionType): Permission[] => {
          if (!t) return nodes;
          const walk = (arr: Permission[]): Permission[] =>
            arr
              .map((n) => ({
                ...n,
                children: n.children ? walk(n.children) : undefined,
              }))
              .filter((n) => n.type === t || (n.children && n.children.length > 0));
          return walk(nodes);
        };

        const roots = filterByTypeTree(mock, typeFilter || undefined);
        setPermissions(roots);
        setExpandedIds(new Set(roots.map((p) => p.id)));
      } else {
        const isListMode = !!typeFilter;
        if (isListMode) {
          const resp = await PermissionsService.permissionsCoreControllerListPermissions({
            scope:
              scope === "admin" ? ListPermissionsDto.scope.ADMIN : ListPermissionsDto.scope.WEB,
            type:
              typeFilter === "page"
                ? ListPermissionsDto.type.PAGE
                : typeFilter === "button"
                  ? ListPermissionsDto.type.BUTTON
                  : ListPermissionsDto.type.API,
            page: 1,
            limit: 10,
          });
          const items = resp.data?.items ?? [];
          const flat: Permission[] = items.map((p) => ({
            id: p.id,
            key: p.key,
            name: p.name,
            description: p.description ?? undefined,
            type: p.type as any,
            scope,
            parent_id: p.parentId ?? undefined,
            children: [],
            created_at: p.createdAt,
            updated_at: p.updatedAt,
          }));
          setPermissions(flat);
          setExpandedIds(new Set());
        } else {
          const resp = await PermissionsService.permissionsCoreControllerListPermissionsTree({
            scope:
              scope === "admin" ? ListPermissionsDto.scope.ADMIN : ListPermissionsDto.scope.WEB,
          });
          const items = resp.data ?? [];
          const map = new Map<string, Permission & { children: Permission[] }>();
          items.forEach((p) => {
            map.set(p.id!, {
              id: p.id!,
              key: p.key!,
              name: p.name!,
              description: p.description ?? undefined,
              type: p.type as any as PermissionType,
              scope,
              parent_id: p.parentId ?? undefined,
              children: [],
              created_at: p.createdAt,
              updated_at: p.updatedAt,
            });
          });
          const childIds = new Set<string>();
          const nodes = Array.from(map.values());
          nodes.forEach((node) => {
            const pid = node.parent_id;
            if (pid && map.has(pid)) {
              (map.get(pid) as any).children.push(node);
              childIds.add(node.id);
              return;
            }
            let parentKey: string | undefined;
            if (node.type === "button") {
              parentKey = node.key.split("/").slice(0, -1).join("/");
            } else if (node.type === "api") {
              parentKey = node.key.split(":")[0];
            }
            if (parentKey) {
              const expectedType: PermissionType | undefined =
                node.type === "button" ? "page" : node.type === "api" ? "button" : undefined;
              const parentNode = nodes.find(
                (n) =>
                  n.key === parentKey &&
                  n.scope === node.scope &&
                  (!expectedType || n.type === expectedType),
              );
              if (parentNode) {
                (parentNode as any).children.push(node);
                childIds.add(node.id);
              }
            }
          });
          const roots: Permission[] = nodes.filter((n) => !childIds.has(n.id));
          setPermissions(roots);
          setExpandedIds(new Set(roots.map((p) => p.id)));
        }
      }
    } catch (error) {
      console.error("加载权限失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAdd = (parent?: Permission) => {
    setEditingPermission(null);
    setParentId(parent?.id || "");

    // 根据父级自动推断类型和键前缀
    let suggestedType: PermissionType = "page";
    let keyPrefix = `${scope}/`;

    if (parent) {
      if (parent.type === "page") {
        suggestedType = "button";
        keyPrefix = parent.key + "/";
      } else if (parent.type === "button") {
        suggestedType = "api";
        keyPrefix = parent.key.split("/").slice(0, -1).join("/") + "/";
      }
    }

    setFormData({
      key: keyPrefix,
      name: "",
      description: "",
      type: suggestedType,
      scope,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      key: permission.key,
      name: permission.name,
      description: permission.description || "",
      type: permission.type,
      scope: permission.scope,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        message.info("当前为模拟数据模式，删除操作仅展示 UI 效果");
        setLoading(false);
        return;
      }
      await PermissionsService.permissionsCoreControllerRemove({ id });
      message.success("删除成功");
      await loadPermissions();
    } catch (error) {
      console.error("删除权限失败:", error);
      message.error("删除失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const getTypeTagColor = (type: PermissionType) => {
    switch (type) {
      case "page":
        return "blue";
      case "button":
        return "green";
      case "api":
        return "purple";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: PermissionType) => {
    switch (type) {
      case "page":
        return "页面";
      case "button":
        return "按钮";
      case "api":
        return "接口";
      default:
        return type;
    }
  };

  const filterPermissions = (perms: Permission[]): Permission[] => {
    if (!searchText) return perms;

    const search = searchText.toLowerCase();
    return perms
      .filter((p) => {
        const match =
          p.name.toLowerCase().includes(search) ||
          p.key.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search);

        if (match) return true;
        if (p.children) {
          const filteredChildren = filterPermissions(p.children);
          return filteredChildren.length > 0;
        }
        return false;
      })
      .map((p) => ({
        ...p,
        children: p.children ? filterPermissions(p.children) : undefined,
      }));
  };

  const renderPermissionTree = (perms: Permission[], level: number = 0) => {
    const filtered = filterPermissions(perms);

    return filtered.map((permission) => {
      const hasChildren = permission.children && permission.children.length > 0;
      const isExpanded = expandedIds.has(permission.id);
      const indent = level * 24;

      return (
        <div key={permission.id}>
          <div
            style={{
              padding: "12px 16px",
              paddingLeft: indent + 16,
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {hasChildren ? (
              <Button
                type="text"
                size="small"
                icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
                onClick={() => toggleExpand(permission.id)}
              />
            ) : (
              <span style={{ width: 24, height: 24, display: "inline-block" }} />
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
                minWidth: 0,
              }}
            >
              <FolderOutlined style={{ color: "#bfbfbf" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography.Text>{permission.name}</Typography.Text>
                  <Tag color={getTypeTagColor(permission.type)}>
                    {getTypeLabel(permission.type)}
                  </Tag>
                  <Typography.Text code>{permission.key}</Typography.Text>
                </div>
                {permission.description && (
                  <Typography.Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 0 }}>
                    {permission.description}
                  </Typography.Paragraph>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Button type="link" icon={<PlusOutlined />} onClick={() => handleAdd(permission)}>
                子权限
              </Button>
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(permission)}>
                编辑
              </Button>
              <Popconfirm
                title="确定删除这个权限吗？所有子权限也会被删除。"
                onConfirm={() => handleDelete(permission.id)}
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </div>

          {hasChildren && isExpanded && renderPermissionTree(permission.children!, level + 1)}
        </div>
      );
    });
  };

  const renderPermissionList = (perms: Permission[]) => {
    const search = searchText.toLowerCase();
    const filtered = perms.filter((p) => {
      if (!search) return true;
      return (
        p.name.toLowerCase().includes(search) ||
        p.key.toLowerCase().includes(search) ||
        (p.description ?? "").toLowerCase().includes(search)
      );
    });

    return filtered.map((permission) => (
      <div
        key={permission.id}
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          <FolderOutlined style={{ color: "#bfbfbf" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Typography.Text>{permission.name}</Typography.Text>
              <Tag color={getTypeTagColor(permission.type)}>{getTypeLabel(permission.type)}</Tag>
              <Typography.Text code>{permission.key}</Typography.Text>
            </div>
            {permission.description && (
              <Typography.Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 0 }}>
                {permission.description}
              </Typography.Paragraph>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button type="link" icon={<PlusOutlined />} onClick={() => handleAdd(permission)}>
            子权限
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(permission)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个权限吗？所有子权限也会被删除。"
            onConfirm={() => handleDelete(permission.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      </div>
    ));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 12,
        overflow: "hidden",
      }}
    >
      {/* 高级搜索卡片 */}
      <Card size="small" style={{ flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Typography.Text type="secondary">关键词</Typography.Text>
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索权限名称、键或描述..."
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Typography.Text type="secondary">类型</Typography.Text>
            <Segmented
              value={typeFilter || "全部"}
              onChange={(val) => {
                const v = val as string;
                setTypeFilter(v === "全部" ? "" : (v as any));
              }}
              options={[
                { label: "全部", value: "全部" },
                { label: "页面", value: "page" },
                { label: "按钮", value: "button" },
                { label: "接口", value: "api" },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card
        title="权限树结构"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAdd()}
            loading={loading}
          >
            添加权限
          </Button>
        }
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
        styles={{
          body: {
            flex: 1,
            overflow: "auto",
            minHeight: 0,
          },
        }}
        className="scroll-area"
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : permissions.length > 0 ? (
          typeFilter ? (
            renderPermissionList(permissions)
          ) : (
            renderPermissionTree(permissions)
          )
        ) : (
          <Empty description="暂无权限">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
              添加权限
            </Button>
          </Empty>
        )}
      </Card>

      <Modal
        open={isModalOpen}
        title={editingPermission ? "编辑权限" : parentId ? "添加子权限" : "添加权限"}
        onCancel={() => setIsModalOpen(false)}
        onOk={async () => {
          const values = await form.validateFields();
          setLoading(true);
          try {
            if (USE_MOCK) {
              message.info("当前为模拟数据模式，保存操作仅展示 UI 效果");
              setIsModalOpen(false);
              setLoading(false);
              return;
            }
            if (editingPermission) {
              // WORKAROUND: API 定义变更，不再接受 data 包装，改为扁平结构
              await PermissionsService.permissionsCoreControllerUpdate({
                id: editingPermission.id,
                name: values.name,
                description: values.description,
                type:
                  values.type === "page"
                    ? UpdatePermissionDto.type.PAGE
                    : values.type === "button"
                      ? UpdatePermissionDto.type.BUTTON
                      : UpdatePermissionDto.type.API,
                scope:
                  scope === "admin"
                    ? UpdatePermissionDto.scope.ADMIN
                    : UpdatePermissionDto.scope.WEB,
                parentId: parentId || undefined,
                sort: Number(values.sort ?? 1),
                sorts: String(values.sort ?? 1),
                parentIds: parentId ? String(parentId) : undefined,
                urls: "",
              } as any);
            } else {
              await PermissionsService.permissionsCoreControllerCreate({
                key: values.key,
                name: values.name,
                description: values.description,
                type:
                  values.type === "page"
                    ? CreatePermissionDto.type.PAGE
                    : values.type === "button"
                      ? CreatePermissionDto.type.BUTTON
                      : CreatePermissionDto.type.API,
                scope:
                  scope === "admin"
                    ? CreatePermissionDto.scope.ADMIN
                    : CreatePermissionDto.scope.WEB,
                parentId: parentId || undefined,
                sort: Number(values.sort ?? 1),
                sorts: String(values.sort ?? 1),
                parentIds: parentId ? String(parentId) : undefined,
                urls: "",
              });
            }
            setIsModalOpen(false);
            message.success("保存成功");
            await loadPermissions();
          } catch (error) {
            console.error("保存权限失败:", error);
            message.error("保存失败，请重试");
          } finally {
            setLoading(false);
          }
        }}
        confirmLoading={loading}
        okText={editingPermission ? "保存" : "添加"}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          {!editingPermission && (
            <Form.Item
              label="权限键"
              name="key"
              rules={[{ required: true, message: "请输入权限键" }]}
            >
              <Input placeholder={`${scope}/users/create`} />
            </Form.Item>
          )}
          <Form.Item
            label="权限名称"
            name="name"
            rules={[{ required: true, message: "请输入权限名称" }]}
          >
            <Input placeholder="例如：创建用户" />
          </Form.Item>
          <Form.Item
            label="权限类型"
            name="type"
            rules={[{ required: true, message: "请选择权限类型" }]}
          >
            <Select
              options={[
                { label: "页面 - 路由页面访问控制", value: "page" },
                { label: "按钮 - 页面内操作按钮控制", value: "button" },
                { label: "接口 - 后端接口权限校验", value: "api" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="排序值"
            name="sort"
            initialValue={1}
            rules={[{ required: true, message: "请输入排序值" }]}
          >
            <Input type="number" min={0} placeholder="越小越靠前，如 1" />
          </Form.Item>
          <Form.Item
            label="作用范围"
            name="scope"
            rules={[{ required: true, message: "请选择作用范围" }]}
          >
            <Select
              options={[
                {
                  label: scope === "admin" ? "后台管理端" : "用户端网页",
                  value: scope,
                } as any,
              ]}
              disabled
            />
          </Form.Item>
          <Form.Item label="权限描述" name="description">
            <Input.TextArea rows={3} placeholder="权限的详细描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
