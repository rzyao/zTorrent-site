import { Card, Typography, Segmented, Button, Skeleton, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { usePermissionsLogic } from "./hooks/usePermissionsLogic";
import { PermissionItem } from "./components/PermissionItem";
import { PermissionModal } from "./components/PermissionModal";
import { PermissionsPageProps, Permission } from "./types";

export default function PermissionsPage({ scope, title }: PermissionsPageProps) {
  const {
    permissions,
    loading,
    expandedIds,
    toggleExpand,
    searchText,
    setSearchText,
    typeFilter,
    setTypeFilter,
    isModalOpen,
    setIsModalOpen,
    editingPermission,
    parentId,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
  } = usePermissionsLogic({ scope });

  const renderTree = (items: Permission[], level = 0): React.ReactNode => {
    return items.map((item) => {
      const isExpanded = expandedIds.has(item.id);
      return (
        <div key={item.id}>
          <PermissionItem
            permission={item}
            level={level}
            expanded={isExpanded}
            onToggleExpand={toggleExpand}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showExpand={!typeFilter}
          />
          {item.children && (isExpanded || typeFilter) && renderTree(item.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* 搜索与筛选 */}
      <Card
        size="small"
        className="flex-shrink-0 border-none bg-white/80 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Typography.Text
              type="secondary"
              className="text-xs font-semibold tracking-wider uppercase"
            >
              关键词
            </Typography.Text>
            <SearchInput
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索权限名称、键或描述..."
              className="w-80"
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography.Text
              type="secondary"
              className="text-xs font-semibold tracking-wider uppercase"
            >
              类型
            </Typography.Text>
            <Segmented
              value={typeFilter || "all"}
              onChange={(val) => setTypeFilter(val === "all" ? "" : (val as any))}
              options={[
                { label: "全部", value: "all" },
                { label: "页面", value: "page" },
                { label: "按钮", value: "button" },
                { label: "接口", value: "api" },
              ]}
              className="bg-gray-100/50"
            />
          </div>
        </div>
      </Card>

      {/* 内容展示区 */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{title || "权限管理"}</span>
            <span className="mt-1 text-xs font-normal text-gray-400">
              ({typeFilter ? "列表视图" : "树形视图"})
            </span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAdd()}
            className="shadow-primary/20 rounded-full px-6 shadow-md"
          >
            添加根权限
          </Button>
        }
        className="flex min-h-0 flex-1 flex-col border-none shadow-sm"
        styles={{
          body: { flex: 1, padding: 0, overflow: "auto", display: "flex", flexDirection: "column" },
        }}
      >
        {loading && permissions.length === 0 ? (
          <div className="p-8">
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        ) : permissions.length > 0 ? (
          <div className="divide-y divide-gray-50">{renderTree(permissions)}</div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="flex flex-col items-center gap-4">
                  <span className="text-gray-400">未找到匹配的权限节点</span>
                  <Button type="primary" ghost icon={<PlusOutlined />} onClick={() => handleAdd()}>
                    创建第一个权限
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </Card>

      {/* 编辑/新增弹窗 */}
      <PermissionModal
        open={isModalOpen}
        editingItem={editingPermission}
        parentId={parentId}
        scope={scope}
        loading={loading}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      />
    </div>
  );
}
