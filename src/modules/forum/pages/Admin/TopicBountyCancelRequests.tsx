import { useEffect, useState } from "react";
import { ForumsTopicsService } from "@/api";
import { AdminListTopicBountyCancelRequestsDto } from "@/api/models/AdminListTopicBountyCancelRequestsDto";
import { AdminReviewTopicBountyCancelRequestDto } from "@/api/models/AdminReviewTopicBountyCancelRequestDto";
import { useForumTheme } from "../../context/ForumThemeContext";
import { useAccess } from "@/context/AccessContext";
import { customToast } from "@/hooks/useToast";
import { Button } from "@/modules/forum/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/forum/components/ui/select";

type Item = {
  id: string;
  topicId: string;
  amount: string;
  cancelRequestStatus: string;
  cancelRequestReason?: string;
  topic?: { id: string; title: string };
};

export function TopicBountyCancelRequestsAdminPage() {
  const { colors } = useForumTheme();
  const { access } = useAccess();
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">(
    "pending",
  );

  const load = async (p = 1) => {
    setLoading(true);
    const body: AdminListTopicBountyCancelRequestsDto = {
      page: p,
      limit: 20,
      cancelRequestStatus:
        statusFilter === "all"
          ? undefined
          : statusFilter === "pending"
            ? AdminListTopicBountyCancelRequestsDto.cancelRequestStatus.PENDING
            : statusFilter === "approved"
              ? AdminListTopicBountyCancelRequestsDto.cancelRequestStatus.APPROVED
              : AdminListTopicBountyCancelRequestsDto.cancelRequestStatus.REJECTED,
    };
    const res = await ForumsTopicsService.topicsControllerAdminListCancelRequests(body);
    const data = res.data as unknown as {
      items: Item[];
      total: number;
      page: number;
      limit: number;
    };
    setItems(data.items || []);
    setTotal(data.total || 0);
    setPage(data.page || p);
    setLoading(false);
  };

  useEffect(() => {
    if (access?.roles?.includes("admin") || access?.roles?.includes("moderator")) {
      load(1);
    }
  }, [statusFilter]);

  const review = async (topicId: string, action: "approve" | "reject") => {
    const body: AdminReviewTopicBountyCancelRequestDto = {
      topicId,
      action:
        action === "approve"
          ? AdminReviewTopicBountyCancelRequestDto.action.APPROVE
          : AdminReviewTopicBountyCancelRequestDto.action.REJECT,
      note: action === "approve" ? "同意取消" : "拒绝取消",
    };
    await ForumsTopicsService.topicsControllerAdminReviewCancelRequest(body);
    customToast.success("审核已提交");
    load(page);
  };

  if (!(access?.roles?.includes("admin") || access?.roles?.includes("moderator"))) {
    return <div className={`p-6 ${colors.pageBg} ${colors.textSecondary}`}>无权限访问此页面</div>;
  }

  return (
    <div className={`p-4 ${colors.pageBg}`}>
      <h2 className={`mb-4 text-lg font-bold ${colors.titleColor}`}>悬赏取消申请审核</h2>
      <div className="mb-3 flex items-center gap-2">
        <label className={`text-sm ${colors.textMuted}`}>状态筛选</label>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">待审核</SelectItem>
            <SelectItem value="approved">已同意</SelectItem>
            <SelectItem value="rejected">已拒绝</SelectItem>
            <SelectItem value="all">全部</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading && <div className="p-4">加载中...</div>}
      {!loading && items.length === 0 && <div className="p-4">暂无待审核申请</div>}
      {!loading && items.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${colors.dividerColor}`}>
              <th className="p-2 text-left">话题</th>
              <th className="p-2 text-left">金额</th>
              <th className="p-2 text-left">理由</th>
              <th className="p-2 text-left">状态</th>
              <th className="p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className={`border-b ${colors.dividerColor}`}>
                <td className="p-2">{it.topic?.title || it.topicId}</td>
                <td className="p-2">{it.amount}</td>
                <td className="p-2 wrap-break-word">{it.cancelRequestReason || "-"}</td>
                <td className="p-2">{it.cancelRequestStatus}</td>
                <td className="p-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => review(it.topicId, "approve")}
                    className="mr-2"
                  >
                    同意
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => review(it.topicId, "reject")}>
                    拒绝
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {total > 0 && (
        <div className="mt-3 flex items-center justify-end gap-2">
          <Button variant="default" size="sm" disabled={page <= 1} onClick={() => load(page - 1)}>
            上一页
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={items.length < 20}
            onClick={() => load(page + 1)}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}

export default TopicBountyCancelRequestsAdminPage;
