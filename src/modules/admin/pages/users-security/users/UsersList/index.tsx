import React from "react";
import { Search } from "lucide-react";
import { useUsersLogic, handleDeleteUser } from "@/modules/admin/shared/users/hooks/useUsersLogic";
import { DataTable, Column } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { AdvancedSearchModal } from "@/modules/admin/shared/users/components/AdvancedSearchModal";
import { EditUserModal } from "@/modules/admin/shared/users/components/EditUserModal";
import { BanUserModal } from "@/modules/admin/shared/users/components/BanUserModal";
import { AssignRolesModal } from "@/modules/admin/shared/users/components/AssignRolesModal";
import { Modal, ConfirmModal } from "@/modules/admin/components/ui/modal";
import { Tag } from "@/modules/admin/components/ui/tag";
import type { UserDto } from "@/api/models/UserDto";

const UsersPage: React.FC = () => {
  const {
    searchText,
    setSearchText,
    setQuery,
    loading,
    data,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    columns, // 现有列配置包含 antd 渲染逻辑，我们通过 DataTable 适配
    can,
    advOpen,
    setAdvOpen,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    advFieldOptions,
    editOpen,
    setEditOpen,
    editForm,
    banOpen,
    setBanOpen,
    banForm,
    banTargetId,
    punishTypeOptions,
    banReasonOptions,
    banTimeOptions,
    banDictLoading,
    punishTypesLoading,
    assignOpen,
    setAssignOpen,
    assigning,
    setAssigning,
    assignForm,
    rolesOptions,
    rolesLoading,
    detailOpen,
    setDetailOpen,
    detailData,
    renderDetailContent,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteTargetId,
    setDeleteTargetId,
    fetchList,
  } = useUsersLogic();

  // 将 antd 的 columns 转换为 DataTable 的 Column 格式
  const adaptedColumns: Column<UserDto>[] = React.useMemo(() => {
    return columns.map((col: any, idx: number) => ({
      key: col.key || col.dataIndex || `col-${idx}`,
      title: col.title,
      width: col.width,
      align: col.align,
      render: (value: any, record: UserDto, index: number) => {
        if (col.render) {
          return col.render(value, record, index);
        }
        return value ?? "-";
      },
      dataIndex: col.dataIndex as keyof UserDto,
    }));
  }, [columns]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <DataTable
        columns={adaptedColumns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        toolbarLeft={
          <div className="flex items-center gap-2">
            <div className="relative w-80">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="搜索用户名称或邮箱"
                className="pl-9"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setQuery(searchText);
                  }
                }}
              />
            </div>
            <Button className="h-8 shadow-none" onClick={() => setQuery(searchText)}>
              搜索
            </Button>
            <Button variant="default" className="h-8 shadow-none" onClick={() => setAdvOpen(true)}>
              高级搜索
            </Button>
            <Button
              variant="dashed"
              className="h-8 shadow-none"
              onClick={() => {
                setAdvRules([]);
                setAdvLogic("AND");
                fetchList();
              }}
            >
              清空
            </Button>
          </div>
        }
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        className="flex-1"
      />

      <AdvancedSearchModal
        advOpen={advOpen}
        setAdvOpen={setAdvOpen}
        fetchList={fetchList}
        fieldOptions={advFieldOptions}
        advRules={advRules}
        setAdvRules={setAdvRules}
        advLogic={advLogic}
        setAdvLogic={setAdvLogic}
      />

      <EditUserModal
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        editForm={editForm}
        fetchList={fetchList}
      />

      <BanUserModal
        banOpen={banOpen}
        setBanOpen={setBanOpen}
        banForm={banForm}
        banTargetId={banTargetId}
        punishTypeOptions={punishTypeOptions}
        banReasonOptions={banReasonOptions}
        banTimeOptions={banTimeOptions}
        banDictLoading={banDictLoading}
        punishTypesLoading={punishTypesLoading}
        fetchList={fetchList}
      />

      <AssignRolesModal
        assignOpen={assignOpen}
        setAssignOpen={setAssignOpen}
        assignForm={assignForm}
        assigning={assigning}
        setAssigning={setAssigning}
        rolesOptions={rolesOptions}
        rolesLoading={rolesLoading}
        fetchList={fetchList}
      />

      {/* 使用项目标准的 Modal 组件 */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={detailData?.title}
        footer={null}
        width={720}
      >
        <div className="max-h-[70vh] overflow-auto">
          {detailData?.type === "info" && renderDetailContent(detailData.record)}
          {detailData?.type === "roles" && (
            <div className="flex flex-wrap gap-2">
              {Array.isArray(detailData.record.roles) && detailData.record.roles.length > 0 ? (
                detailData.record.roles.map((role: string) => (
                  <Tag key={role} color="blue">
                    {role}
                  </Tag>
                ))
              ) : (
                <Tag color="default">未设置</Tag>
              )}
            </div>
          )}
          {detailData?.type === "permissions" && (
            <div className="flex flex-wrap gap-2">
              {Array.isArray(detailData.record.permissions) &&
              detailData.record.permissions.length > 0 ? (
                detailData.record.permissions.map((perm: string) => (
                  <Tag key={perm} color="purple">
                    {perm}
                  </Tag>
                ))
              ) : (
                <Tag color="default">未设置</Tag>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onOk={async () => {
          if (deleteTargetId) {
            await handleDeleteUser(deleteTargetId, fetchList);
            setDeleteConfirmOpen(false);
          }
        }}
        title="确认删除"
        content="确定要删除该用户吗？此操作不可撤销。"
        okText="确定删除"
        okButtonProps={{ variant: "primary", danger: true }}
      />
    </div>
  );
};

export default UsersPage;
