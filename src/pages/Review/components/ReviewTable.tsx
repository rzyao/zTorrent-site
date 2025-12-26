import { formatDateTime } from "@/utils/format";
import {
  Film,
  List,
  Package,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  History,
  Star,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { getVisibilityLabel, getTypeLabel } from "../utils";
import type { ReviewItem } from "../types";

function TypeIcon({ type }: { type: "movie" | "series" | "playlist" | "torrent" }) {
  switch (type) {
    case "movie":
      return <Film className="h-4 w-4" />;
    case "series":
      return <Film className="h-4 w-4" />;
    case "playlist":
      return <List className="h-4 w-4" />;
    case "torrent":
      return <Package className="h-4 w-4" />;
  }
}

interface Props {
  items: ReviewItem[];
  onView: (item: ReviewItem) => void;
  onApprove: (item: ReviewItem) => void;
  onReject: (item: ReviewItem) => void;
  onViewHistory: (item: ReviewItem) => void;
}

export function ReviewTable({ items, onView, onViewHistory }: Props) {
  // onApprove / onReject 暂时不直接在列表中使用，已移至详情抽屉
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700/50 bg-neutral-900/50">
              <th className="px-4 py-3 text-left text-xs text-neutral-400">封面/类型</th>
              <th className="px-4 py-3 text-left text-xs text-neutral-400">标题</th>
              <th className="px-4 py-3 text-left text-xs text-neutral-400">提交人</th>
              <th className="px-4 py-3 text-left text-xs text-neutral-400">提交时间</th>
              <th className="px-4 py-3 text-left text-xs text-neutral-400">可见性</th>
              <th className="px-4 py-3 text-left text-xs text-neutral-400">状态</th>
              <th className="px-4 py-3 text-left text-xs text-neutral-400">警告</th>
              <th className="px-4 py-3 text-right text-xs text-neutral-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <Tag className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
                  <p className="text-neutral-400">暂无符合条件的审核项目</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-700/30 transition-colors hover:bg-neutral-700/20"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {item.type === "movie" && item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-16 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-12 items-center justify-center rounded bg-neutral-700/50">
                          <TypeIcon type={item.type} />
                        </div>
                      )}
                      <span className="text-xs text-neutral-400">{getTypeLabel(item.type)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="max-w-[300px]">
                      <div className="mb-1 truncate text-neutral-200">{item.title}</div>
                      {item.category && (
                        <div className="text-xs text-amber-400">{item.category}</div>
                      )}
                      {item.rating && (
                        <div className="mt-1 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-yellow-400">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {item.submitterAvatar ? (
                        <img
                          src={item.submitterAvatar}
                          alt={item.submitter}
                          className="h-8 w-8 rounded-full bg-neutral-700 object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700/50">
                          <User className="h-4 w-4 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-neutral-200">{item.submitter}</div>
                        <div
                          className={`text-xs ${item.submitterReputation >= 90 ? "text-green-400" : item.submitterReputation >= 70 ? "text-yellow-400" : "text-red-400"}`}
                        >
                          信誉 {item.submitterReputation}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Calendar className="h-4 w-4" />
                      {formatDateTime(item.submitDate)}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-neutral-300">
                      {getVisibilityLabel(item.visibility)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {item.missingFields && item.missingFields.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-400">
                          <AlertTriangle className="h-3 w-3" />
                          缺失字段
                        </div>
                      )}
                      {item.sensitiveWords && item.sensitiveWords.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          敏感词
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === "pending" ? (
                        <button
                          onClick={() => onView(item)}
                          className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-500 transition-colors hover:bg-amber-500 hover:text-white"
                          title="开始审核"
                        >
                          审核
                        </button>
                      ) : (
                        <button
                          onClick={() => onViewHistory(item)}
                          className="rounded-lg p-2 transition-colors hover:bg-neutral-700"
                          title="审核历史"
                        >
                          <History className="h-4 w-4 text-neutral-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
