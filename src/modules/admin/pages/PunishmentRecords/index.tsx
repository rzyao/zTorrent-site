import React from "react";
// import { App } from "antd";
import { usePunishmentRecordsLogic } from "./hooks/usePunishmentRecordsLogic";
import { SearchFilter } from "./components/SearchFilter";
import { PunishmentTable } from "./components/PunishmentTable";
import { RevokePunishmentModal } from "./components/RevokePunishmentModal";
import { OPS_BY_FIELD, ADV_FIELD_OPTIONS } from "./constants";
import AdvancedQueryBuilder from "../../components/AdvancedQueryBuilder";
import { Button, Modal } from "antd";

const PunishmentRecordsPage: React.FC = () => {
  const {
    searchText,
    setSearchText,
    searchUserAndFetch,
    typeSelect,
    setTypeSelect,
    typeOptions,
    typeLoading,
    reasonSelect,
    setReasonSelect,
    reasonOptions,
    reasonLoading,
    statusSelect,
    setStatusSelect,
    activeSelect,
    setActiveSelect,
    advOpen,
    setAdvOpen,
    fetchList,
    page,
    pageSize,
    loading,
    data,
    total,
    setPage,
    setPageSize,
    columns,
    tableContainerRef,
    expandedCacheRef,
    revokeOpen,
    setRevokeOpen,
    revokeTarget,
    revokeForm,
    revokeReasonOptions,
    revokeReasonLoading,
    revokeLoading,
    setRevokeLoading,
    message,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
  } = usePunishmentRecordsLogic();

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SearchFilter
        searchText={searchText}
        setSearchText={setSearchText}
        searchUserAndFetch={searchUserAndFetch}
        typeSelect={typeSelect}
        setTypeSelect={setTypeSelect}
        typeOptions={typeOptions}
        typeLoading={typeLoading}
        reasonSelect={reasonSelect}
        setReasonSelect={setReasonSelect}
        reasonOptions={reasonOptions}
        reasonLoading={reasonLoading}
        statusSelect={statusSelect}
        setStatusSelect={setStatusSelect}
        activeSelect={activeSelect}
        setActiveSelect={setActiveSelect}
        advOpen={advOpen}
        setAdvOpen={setAdvOpen}
        fetchList={fetchList}
        pageSize={pageSize}
      />

      <PunishmentTable
        loading={loading}
        data={data}
        total={total}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        fetchList={fetchList}
        columns={columns}
        tableContainerRef={tableContainerRef}
        expandedCacheRef={expandedCacheRef}
      />

      <RevokePunishmentModal
        revokeOpen={revokeOpen}
        setRevokeOpen={setRevokeOpen}
        revokeTarget={revokeTarget}
        revokeForm={revokeForm}
        revokeReasonOptions={revokeReasonOptions}
        revokeReasonLoading={revokeReasonLoading}
        revokeLoading={revokeLoading}
        setRevokeLoading={setRevokeLoading}
        fetchList={fetchList}
        page={page}
        pageSize={pageSize}
        message={message}
      />

      {/* Advanced Search Modal Wrapper */}
      <Modal
        title="高级搜索"
        open={advOpen}
        onCancel={() => setAdvOpen(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <AdvancedQueryBuilder
          fieldOptions={ADV_FIELD_OPTIONS}
          opsByField={OPS_BY_FIELD}
          rules={advRules}
          logic={advLogic}
          onChange={(nextRules, nextLogic) => {
            setAdvRules(nextRules as any);
            setAdvLogic(nextLogic);
          }}
        />
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <Button
            onClick={() => {
              setAdvRules([]);
              setAdvLogic("AND");
              fetchList({ page: 1, limit: pageSize }, { rules: [] });
              setAdvOpen(false);
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setAdvOpen(false);
              fetchList({ page: 1, limit: pageSize });
            }}
          >
            搜索
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PunishmentRecordsPage;
