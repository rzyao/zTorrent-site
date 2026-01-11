import { Download } from "lucide-react";
import { useStoreOrdersLogic } from "./hooks/useStoreOrdersLogic";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { OrderDeliveryDrawer } from "./components/OrderDeliveryDrawer";
import { StoreOrdersToolbar } from "./components/StoreOrdersToolbar";

export default function StoreOrdersPage() {
  const logic = useStoreOrdersLogic();

  return (
    <>
      <DataTable
        columns={logic.columns}
        dataSource={logic.items}
        rowKey="id"
        loading={logic.loading}
        pagination={{
          current: logic.page,
          pageSize: logic.pageSize,
          total: logic.total,
          onChange: logic.handlePageChange,
        }}
        toolbarLeft={
          <StoreOrdersToolbar
            filters={logic.filters}
            setFilters={logic.setFilters}
            handleSearch={logic.handleSearch}
            handleReset={logic.handleReset}
            pageSize={logic.pageSize}
            handlePageChange={logic.handlePageChange}
          />
        }
        toolbarRight={
          <Button onClick={logic.handleExportCsv} variant="default">
            <Download className="mr-1 h-4 w-4" />
            导出CSV
          </Button>
        }
      />

      <OrderDeliveryDrawer order={logic.detailOrder} onClose={() => logic.setDetailOrder(null)} />
    </>
  );
}
