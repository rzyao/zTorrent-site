import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";
import { DataTable, Column } from "@/modules/admin/components/ui/data-table";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Card, CardContent } from "@/modules/admin/components/ui/card";
import { Input } from "@/modules/admin/components/ui/input";
import { Label } from "@/modules/admin/components/ui/label";
import { useResourceMappingLogic, ResourceMapping } from "./useResourceMappingLogic";

export const ResourceMappingPage: React.FC = () => {
  const {
    mappings,
    isLoading,
    isModalOpen,
    editingItem,
    form: {
      register,
      formState: { errors },
    },
    isSubmitting,
    openCreate,
    openEdit,
    closeModal,
    onSubmit,
  } = useResourceMappingLogic();

  const columns: Column<ResourceMapping>[] = [
    {
      title: "资源类型",
      dataIndex: "resourceType",
      key: "resourceType",
      render: (text: string) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "默认版块ID",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (text: string) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_: any, record: ResourceMapping) => (
        <Button variant="link" onClick={() => openEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">资源映射配置</h1>
      </div>

      <Card>
        <div className="flex items-center justify-end p-6 pb-0">
          <Button variant="primary" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新增配置
          </Button>
        </div>
        <CardContent>
          <DataTable
            columns={columns}
            dataSource={mappings}
            rowKey="resourceType"
            loading={isLoading}
          />
        </CardContent>
      </Card>

      <Modal
        title={editingItem ? "编辑映射" : "新增映射"}
        open={isModalOpen}
        onOk={onSubmit}
        onCancel={closeModal}
        confirmLoading={isSubmitting}
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resourceType" required>
              资源类型
            </Label>
            <Input
              id="resourceType"
              placeholder="e.g. movie"
              disabled={!!editingItem}
              {...register("resourceType")}
            />
            {errors.resourceType && (
              <p className="text-sm text-red-500">{errors.resourceType.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId" required>
              版块ID
            </Label>
            <Input id="categoryId" placeholder="论坛 Category ID" {...register("categoryId")} />
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};
