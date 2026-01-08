import React from "react";
import { useUsersLogic } from "@/modules/admin/shared/users/hooks/useUsersLogic";
import { SearchBar } from "@/modules/admin/shared/users/components/SearchBar";
import { UsersTable } from "@/modules/admin/shared/users/components/UsersTable";
import { AdvancedSearchModal } from "@/modules/admin/shared/users/components/AdvancedSearchModal";
import { EditUserModal } from "@/modules/admin/shared/users/components/EditUserModal";
import { BanUserModal } from "@/modules/admin/shared/users/components/BanUserModal";
import { AssignRolesModal } from "@/modules/admin/shared/users/components/AssignRolesModal";

const UsersPage: React.FC = () => {
  const {
    scrollY,
    tableContainerRef,
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
    expandCacheRef,
    columns,
    fetchList,
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
  } = useUsersLogic();

  return (
    <div className="min-h-full space-y-4 bg-gray-50/50 p-4">
      {/* 统一的卡片容器：操作栏 + 表格 */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          setQuery={setQuery}
          setAdvOpen={setAdvOpen}
          setAdvRules={setAdvRules}
          setAdvLogic={setAdvLogic}
          fetchList={fetchList}
          can={can}
        />

        <UsersTable
          loading={loading}
          data={data}
          total={total}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          scrollY={scrollY}
          tableContainerRef={tableContainerRef}
          expandCacheRef={expandCacheRef}
          columns={columns}
        />
      </div>

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
    </div>
  );
};

export default UsersPage;
