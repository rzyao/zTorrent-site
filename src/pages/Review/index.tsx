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

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 to-orange-600/10 p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-neutral-400">待审核总数</span>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mb-1 text-3xl text-amber-400">{data.stats.pending}</div>
          <div className="text-xs text-neutral-500">
            种子 {data.stats.pendingTorrents} · 电影 {data.stats.pendingMovies} · 剧集{" "}
            {data.stats.pendingSeries} · 片单 {data.stats.pendingPlaylists}
          </div>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-linear-to-br from-green-500/10 to-emerald-600/10 p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-neutral-400">今日通过</span>
            <Check className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-3xl text-green-400">{data.stats.todayApproved}</div>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-linear-to-br from-red-500/10 to-rose-600/10 p-5">
          <div className="items中心 mb-2 flex justify-between">
            <span className="text-sm text-neutral-400">今日驳回</span>
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-3xl text-red-400">{data.stats.todayRejected}</div>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 to-cyan-600/10 p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-neutral-400">审核效率</span>
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-3xl text-blue-400">94%</div>
        </div>
        <div className="rounded-xl border border-purple-500/20 bg-linear-to-br from-purple-500/10 to-pink-600/10 p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-neutral-400">平均用时</span>
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl text-purple-400">
            5.2<span className="text-lg">分</span>
          </div>
        </div>
      </div>

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
