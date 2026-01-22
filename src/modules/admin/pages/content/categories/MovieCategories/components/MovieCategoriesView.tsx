import React from "react";
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { useMovieCategories } from "../hooks/useMovieCategories";
import { MovieCategoryDialog } from "./MovieCategoryDialog";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import { DataTable, Column } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Switch } from "@/modules/admin/components/ui/switch";
import { formatDate } from "@/modules/admin/utils/formatDate";

interface CategoryItem {
  id: string;
  key?: string;
  label?: string;
  name?: string;
  sort?: number;
  enabled?: boolean;
  createdAt?: string;
  children?: CategoryItem[];
  _level?: number; // 用于标记层级
  _hasChildren?: boolean; // 用于标记是否有子项
}

export function MovieCategoriesView() {
  const {
    loading,
    data,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    editingItem,
    setEditingItem,
    handleCreate,
    handleEdit,
    handleRemove,
    confirmRemove,
    isRemoveOpen,
    setIsRemoveOpen,
    removeItem,
    toggleEnabled,
  } = useMovieCategories();

  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newKeys = new Set(expandedKeys);
    if (newKeys.has(id)) {
      newKeys.delete(id);
    } else {
      newKeys.add(id);
    }
    setExpandedKeys(newKeys);
  };

  // 将树形数据扁平化，同时保留层级信息
  const flattenData = React.useMemo(() => {
    const result: CategoryItem[] = [];

    const flatten = (items: CategoryItem[], level = 0) => {
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        const children = Array.isArray(item.children) ? item.children : [];
        const hasChildren = children.length > 0;
        const isExpanded = expandedKeys.has(item.id);

        result.push({
          ...item,
          _level: level,
          _hasChildren: hasChildren,
        });

        // 仅当展开时才添加子项
        if (hasChildren && isExpanded) {
          flatten(children, level + 1);
        }
      });
    };

    flatten(data);
    return result;
  }, [data, expandedKeys]);

  // 定义列配置
  const columns: Column<CategoryItem>[] = [
    {
      key: "label",
      title: "名称",
      width: 300,
      render: (_, record) => {
        const isExpanded = expandedKeys.has(record.id);
        const levelPadding = (record._level || 0) * 24;

        return (
          <div className="flex items-center gap-2" style={{ marginLeft: levelPadding }}>
            {record._hasChildren ? (
              <button
                onClick={() => toggleExpand(record.id)}
                className="group rounded p-1 hover:bg-black/5"
                type="button"
              >
                {isExpanded ? (
                  <ChevronDown className="group-hover:text-primary h-4 w-4 text-neutral-400 transition-colors" />
                ) : (
                  <ChevronRight className="group-hover:text-primary h-4 w-4 text-neutral-400 transition-colors" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium">{record.label || record.name || "-"}</span>
          </div>
        );
      },
    },
    {
      key: "key",
      title: "Key",
      render: (_, record) => (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-neutral-600">
          {record.key || "-"}
        </code>
      ),
    },
    {
      key: "sort",
      title: "排序",
      dataIndex: "sort",
      render: (value) => value ?? 0,
    },
    {
      key: "enabled",
      title: "状态",
      render: (_, record) => (
        <Switch checked={!!record.enabled} onCheckedChange={() => toggleEnabled(record)} />
      ),
    },
    {
      key: "createdAt",
      title: "创建时间",
      render: (_, record) => (
        <span className="text-neutral-500">{formatDate(record.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      title: "操作",
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button
            variant="link"
            size="small"
            className="text-sm"
            onClick={() => {
              setEditingItem(record);
              setIsEditOpen(true);
            }}
          >
            <Edit2 className="mr-1 h-3.5 w-3.5" />
            编辑
          </Button>
          <Button
            variant="text"
            size="small"
            className="text-error hover:bg-error/5 hover:text-error-hover text-sm"
            onClick={() => handleRemove(record)}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        dataSource={flattenData}
        rowKey="id"
        loading={loading}
        toolbarLeft={<h2 className="text-lg font-semibold text-neutral-900">电影分类</h2>}
        toolbarRight={
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            新建分类
          </Button>
        }
        emptyText="暂无数据"
        className="h-full"
      />

      <MovieCategoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        title="新建分类"
        loading={loading}
      />

      <MovieCategoryDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialValues={editingItem}
        onSubmit={handleEdit}
        title="编辑分类"
        loading={loading}
      />

      <ConfirmModal
        open={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        title="确认删除"
        content={`确定要删除分类 "${removeItem?.label || removeItem?.name}" 吗？`}
        onOk={confirmRemove}
        confirmLoading={loading}
      />
    </>
  );
}
