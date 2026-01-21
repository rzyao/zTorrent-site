import React from "react";
import { Search } from "lucide-react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Modal, ConfirmModal } from "@/modules/admin/components/ui/modal";
import { Tag } from "@/modules/admin/components/ui/tag";
import { useUsersLogic } from "./useUsersLogic";
import { AdvancedSearchModal } from "./components/AdvancedSearchModal";
import { EditUserModal } from "./components/EditUserModal";
import { BanUserModal } from "./components/BanUserModal";
import { AssignRolesModal } from "./components/AssignRolesModal";

const UsersPage: React.FC = () => {
  const {
    searchText,
    setSearchText,
    handleSearch,
    handleClear,
    loading,
    data,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    columns,
    fetchList,
    // Modals
    editOpen,
    setEditOpen,
    editingUser,
    banOpen,
    setBanOpen,
    banTargetId,
    punishTypeOptions,
    banReasonOptions,
    banTimeOptions,
    banDictLoading,
    punishTypesLoading,
    assignOpen,
    setAssignOpen,
    assignData,
    assigning,
    setAssigning,
    rolesOptions,
    rolesLoading,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleDelete,
    detailOpen,
    setDetailOpen,
    detailData,
    advOpen,
    setAdvOpen,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    advFieldOptions,
  } = useUsersLogic();

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        toolbarLeft={
          <div className="flex items-center gap-2">
            <div className="flex items-center overflow-hidden rounded-md border bg-white focus-within:ring-1 focus-within:ring-blue-500">
              <div className="flex items-center px-3 text-neutral-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="搜索用户名称或邮箱"
                className="h-8 min-w-[240px] border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button
                variant="text"
                className="h-8 rounded-none border-l px-3 text-neutral-500 hover:text-blue-600"
                onClick={handleSearch}
              >
                搜索
              </Button>
            </div>
            <Button variant="default" className="h-8" onClick={() => setAdvOpen(true)}>
              高级搜索
            </Button>
            <Button
              variant="dashed"
              className="h-8 text-neutral-500 hover:text-red-500"
              onClick={handleClear}
            >
              重置
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
        open={advOpen}
        onClose={setAdvOpen}
        onSuccess={fetchList}
        fieldOptions={advFieldOptions}
        rules={advRules}
        setRules={setAdvRules}
        logic={advLogic}
        setLogic={setAdvLogic}
      />

      <EditUserModal
        open={editOpen}
        onClose={setEditOpen}
        editingUser={editingUser}
        onSuccess={fetchList}
      />

      <BanUserModal
        open={banOpen}
        onClose={setBanOpen}
        targetId={banTargetId}
        punishTypeOptions={punishTypeOptions}
        banReasonOptions={banReasonOptions}
        banTimeOptions={banTimeOptions}
        banDictLoading={banDictLoading}
        punishTypesLoading={punishTypesLoading}
        onSuccess={fetchList}
      />

      <AssignRolesModal
        open={assignOpen}
        onClose={setAssignOpen}
        assignData={assignData}
        assigning={assigning}
        setAssigning={setAssigning}
        rolesOptions={rolesOptions}
        rolesLoading={rolesLoading}
        onSuccess={fetchList}
      />

      {/* 详情展示弹窗 */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={detailData?.title}
        footer={null}
        width={720}
      >
        <div className="max-h-[70vh] overflow-auto p-2">
          {detailData?.type === "info" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 border-l-2 border-blue-500 pl-2 text-sm font-semibold text-neutral-900">
                  基础信息
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex border-b border-neutral-100 pb-2">
                    <span className="w-24 text-neutral-500">用户名</span>
                    <span className="font-medium">{detailData.record?.username || "-"}</span>
                  </div>
                  <div className="flex border-b border-neutral-100 pb-2">
                    <span className="w-24 text-neutral-500">邮箱</span>
                    <span className="font-medium">{detailData.record?.email || "-"}</span>
                  </div>
                  <div className="flex border-b border-neutral-100 pb-2">
                    <span className="w-24 text-neutral-500">等级</span>
                    {detailData.record?.level ? (
                      <Tag color="blue">{detailData.record.level}</Tag>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="flex border-b border-neutral-100 pb-2">
                    <span className="w-24 text-neutral-500">VIP</span>
                    <div className="flex gap-1">
                      <Tag color={detailData.record?.isVip ? "magenta" : "default"}>
                        {detailData.record?.isVip ? "VIP" : "非VIP"}
                      </Tag>
                      {detailData.record?.isVip && detailData.record?.vipLevel && (
                        <Tag color="magenta">{detailData.record.vipLevel}</Tag>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 border-l-2 border-green-500 pl-2 text-sm font-semibold text-neutral-900">
                  账号状态
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex border-b border-neutral-100 pb-2">
                    <span className="w-24 text-neutral-500">状态</span>
                    <Tag
                      color={
                        detailData.record?.status === "active"
                          ? "green"
                          : detailData.record?.status === "banned"
                            ? "red"
                            : "gold"
                      }
                    >
                      {detailData.record?.status === "active"
                        ? "正常"
                        : detailData.record?.status === "banned"
                          ? "已封禁"
                          : "待激活"}
                    </Tag>
                  </div>
                  <div className="flex border-b border-neutral-100 pb-2">
                    <span className="w-24 text-neutral-500">下载权限</span>
                    <Tag color={detailData.record?.hasDownloadPermission ? "green" : "red"}>
                      {detailData.record?.hasDownloadPermission ? "允许" : "禁止"}
                    </Tag>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 border-l-2 border-purple-500 pl-2 text-sm font-semibold text-neutral-900">
                  权限与角色
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="rounded-md bg-neutral-50 p-3">
                    <span className="mb-2 block font-medium text-neutral-500">所属角色</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(detailData.record?.roles) &&
                      detailData.record.roles.length > 0 ? (
                        detailData.record.roles.map((role: string) => (
                          <Tag key={role} color="blue">
                            {role}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="default">未设置</Tag>
                      )}
                    </div>
                  </div>
                  <div className="rounded-md bg-neutral-50 p-3">
                    <span className="mb-2 block font-medium text-neutral-500">独立权限</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(detailData.record?.permissions) &&
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
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 border-l-2 border-orange-500 pl-2 text-sm font-semibold text-neutral-900">
                  系统时间
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex rounded bg-neutral-50 px-3 py-2">
                    <span className="w-32 text-neutral-500">最后访问时间</span>
                    <span>{detailData.record?.lastVisitAt || "-"}</span>
                  </div>
                  <div className="flex rounded bg-neutral-50 px-3 py-2">
                    <span className="w-32 text-neutral-500">账号创建时间</span>
                    <span>{detailData.record?.createdAt || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(detailData?.type === "roles" || detailData?.type === "permissions") && (
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(detailData.record[detailData.type]) &&
                detailData.record[detailData.type].length > 0 ? (
                  detailData.record[detailData.type].map((item: string) => (
                    <Tag key={item} color={detailData.type === "roles" ? "blue" : "purple"}>
                      {item}
                    </Tag>
                  ))
                ) : (
                  <Tag color="default">未设置</Tag>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onOk={handleDelete}
        title="确认删除"
        content="确定要删除该用户吗？此操作不可撤销。"
        okText="确定删除"
        okButtonProps={{ variant: "primary", danger: true }}
      />
    </div>
  );
};

export default UsersPage;
