import { Clock, Check, X, Shield } from "lucide-react";
import { useReviewData } from "./hooks/useReviewData";
import { useReviewActions } from "./hooks/useReviewActions";
import { useReviewHistory } from "./hooks/useReviewHistory";
import { ReviewHeader } from "./components/ReviewHeader";
import { FiltersBar } from "./components/FiltersBar";
import { ReviewTable } from "./components/ReviewTable";
import { DetailDrawer } from "./components/DetailDrawer";
import { ActionModal } from "./components/ActionModal";
import { HistoryModal } from "./components/HistoryModal";
import { PageContainer } from "@/components/PageContainer";

export default function ReviewPage() {
  const data = useReviewData();
  const actions = useReviewActions(data.setItems);
  const history = useReviewHistory(actions.selectedItem, actions.showHistory);

  return (
    <PageContainer>
      <ReviewHeader reviewSwitches={data.reviewSwitches} />

      <FiltersBar
        typeFilter={data.typeFilter}
        setTypeFilter={data.setTypeFilter}
        statusFilter={data.statusFilter}
        setStatusFilter={data.setStatusFilter}
        searchQuery={data.searchQuery}
        setSearchQuery={data.setSearchQuery}
        showFilters={data.showFilters}
        setShowFilters={data.setShowFilters}
        timeRange={data.timeRange}
        setTimeRange={data.setTimeRange}
        stats={data.stats}
      />

      <ReviewTable
        items={data.filteredItems}
        onView={(item) => actions.setSelectedItem(item)}
        onApprove={(item) => actions.handleAction(item, "approve")}
        onReject={(item) => actions.handleAction(item, "reject")}
        onViewHistory={(item) => {
          actions.setSelectedItem(item);
          actions.setShowHistory(true);
        }}
      />

      {actions.selectedItem && !actions.actionType && !actions.showHistory && (
        <DetailDrawer
          item={actions.selectedItem}
          onClose={() => actions.setSelectedItem(null)}
          onApprove={(item) => actions.handleAction(item, "approve")}
          onReject={(item) => actions.handleAction(item, "reject")}
        />
      )}

      <ActionModal
        visible={Boolean(actions.actionType && actions.selectedItem)}
        item={actions.selectedItem}
        actionType={actions.actionType}
        actionNotes={actions.actionNotes}
        onNotesChange={actions.setActionNotes}
        onCancel={actions.cancelAction}
        onConfirm={actions.confirmAction}
      />

      <HistoryModal
        visible={actions.showHistory && Boolean(actions.selectedItem)}
        items={history.historyItems}
        loading={history.historyLoading}
        onClose={() => {
          actions.setShowHistory(false);
          actions.setSelectedItem(null);
        }}
      />
    </PageContainer>
  );
}
