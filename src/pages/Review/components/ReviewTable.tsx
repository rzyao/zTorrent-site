import { Film, List, Package, User, Calendar, Tag, AlertTriangle, Eye, Check, X, History, Star } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { getVisibilityLabel, getTypeLabel } from '../utils';
import type { ReviewItem } from '../types';

function TypeIcon({ type }: { type: 'movie' | 'playlist' | 'torrent' }) {
  switch (type) {
    case 'movie': return <Film className="w-4 h-4" />;
    case 'playlist': return <List className="w-4 h-4" />;
    case 'torrent': return <Package className="w-4 h-4" />;
  }
}

interface Props {
  items: ReviewItem[];
  onView: (item: ReviewItem) => void;
  onApprove: (item: ReviewItem) => void;
  onReject: (item: ReviewItem) => void;
  onViewHistory: (item: ReviewItem) => void;
}

export function ReviewTable({ items, onView, onApprove, onReject, onViewHistory }: Props) {
  return (
    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-900/50 border-b border-neutral-700/50">
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
                  <Tag className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400">暂无符合条件的审核项目</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-neutral-700/30 hover:bg-neutral-700/20 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {item.type === 'movie' && item.image ? (
                        <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-16 bg-neutral-700/50 rounded flex items-center justify-center">
                          <TypeIcon type={item.type} />
                        </div>
                      )}
                      <span className="text-xs text-neutral-400">{getTypeLabel(item.type)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="max-w-[300px]">
                      <div className="text-neutral-200 mb-1 truncate">{item.title}</div>
                      {item.category && (
                        <div className="text-xs text-amber-400">{item.category}</div>
                      )}
                      {item.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-yellow-400">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-400" />
                      <div>
                        <div className="text-sm text-neutral-200">{item.submitter}</div>
                        <div className={`text-xs ${item.submitterReputation >= 90 ? 'text-green-400' : item.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                          信誉 {item.submitterReputation}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Calendar className="w-4 h-4" />
                      {item.submitDate}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-neutral-300">{getVisibilityLabel(item.visibility)}</span>
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {item.missingFields && item.missingFields.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-400">
                          <AlertTriangle className="w-3 h-3" />
                          缺失字段
                        </div>
                      )}
                      {item.sensitiveWords && item.sensitiveWords.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          敏感词
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onView(item)} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors" title="查看详情">
                        <Eye className="w-4 h-4 text-neutral-400" />
                      </button>
                      {item.status === 'pending' && (
                        <>
                          <button onClick={() => onApprove(item)} className="p-2 hover:bg-green-500/20 rounded-lg transition-colors" title="通过">
                            <Check className="w-4 h-4 text-green-400" />
                          </button>
                          <button onClick={() => onReject(item)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors" title="驳回">
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </>
                      )}
                      {(item.status === 'approved' || item.status === 'rejected') && (
                        <button onClick={() => onViewHistory(item)} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors" title="审核历史">
                          <History className="w-4 h-4 text-neutral-400" />
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

