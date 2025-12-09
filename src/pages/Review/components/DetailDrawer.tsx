import { X, Image as ImageIcon, Shield, AlertTriangle, Check, User, Star } from 'lucide-react';
import { getTypeLabel, getVisibilityLabel } from '../utils';
import type { ReviewItem } from '../types';

interface Props {
  item: ReviewItem;
  onClose: () => void;
  onApprove: (item: ReviewItem) => void;
  onReject: (item: ReviewItem) => void;
}

export function DetailDrawer({ item, onClose, onApprove, onReject }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-end z-50">
      <div className="bg-neutral-900 border-l border-neutral-700 w-full md:w-[600px] h-full md:h-screen overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl text-neutral-100">审核详情</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {item.type === 'movie' && item.image && (
            <div>
              <h3 className="text-sm text-neutral-400 mb-3">封面预览</h3>
              <img src={item.image} alt={item.title} className="w-full max-w-[300px] rounded-lg" />
            </div>
          )}

          {item.screenshots && item.screenshots.length > 0 && (
            <div>
              <h3 className="text-sm text-neutral-400 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                截图预览
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {item.screenshots.map((screenshot, idx) => (
                  <img key={idx} src={screenshot} alt={`截图 ${idx + 1}`} className="w-full rounded-lg" />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm text-neutral-400 mb-3">基本信息</h3>
            <div className="space-y-3 bg-neutral-800/50 rounded-lg p-4">
              <div>
                <div className="text-xs text-neutral-500 mb-1">类型</div>
                <div className="text-neutral-200">{getTypeLabel(item.type)}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">标题</div>
                <div className="text-neutral-200">{item.title}</div>
              </div>
              {item.category && (
                <div>
                  <div className="text-xs text-neutral-500 mb-1">分类</div>
                  <div className="text-neutral-200">{item.category}</div>
                </div>
              )}
              {item.year && (
                <div>
                  <div className="text-xs text-neutral-500 mb-1">年份</div>
                  <div className="text-neutral-200">{item.year}</div>
                </div>
              )}
              {item.description && (
                <div>
                  <div className="text-xs text-neutral-500 mb-1">描述</div>
                  <div className="text-neutral-200">{item.description}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-neutral-500 mb-1">可见性</div>
                <div className="text-neutral-200">{getVisibilityLabel(item.visibility)}</div>
              </div>
              {item.rating && (
                <div>
                  <div className="text-xs text-neutral-500 mb-1">评分</div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-neutral-200">{item.rating}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-neutral-400 mb-3">提交人信息</h3>
            <div className="space-y-3 bg-neutral-800/50 rounded-lg p-4">
              <div>
                <div className="text-xs text-neutral-500 mb-1">用户名</div>
                <div className="text-neutral-200">{item.submitter}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">信誉分</div>
                <div className={`${item.submitterReputation >= 90 ? 'text-green-400' : item.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {item.submitterReputation} / 100
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">提交时间</div>
                <div className="text-neutral-200">{item.submitDate}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-neutral-400 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              审核建议
            </h3>
            <div className="space-y-3">
              {item.missingFields && item.missingFields.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-orange-400 mb-2">缺失以下必填字段</div>
                      <div className="flex flex-wrap gap-2">
                        {item.missingFields.map((field, idx) => (
                          <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">{field}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {item.sensitiveWords && item.sensitiveWords.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-red-400 mb-2">检测到敏感词汇</div>
                      <div className="flex flex-wrap gap-2">
                        {item.sensitiveWords.map((word, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">{word}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={`border rounded-lg p-4 ${item.submitterReputation >= 90 ? 'bg-green-500/10 border-green-500/30' : item.submitterReputation >= 70 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-start gap-3">
                  <User className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.submitterReputation >= 90 ? 'text-green-400' : item.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'}`} />
                  <div>
                    <div className={`text-sm mb-1 ${item.submitterReputation >= 90 ? 'text-green-400' : item.submitterReputation >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>提交人信誉评估</div>
                    <div className="text-xs text-neutral-400">
                      {item.submitterReputation >= 90 ? '高信誉用户，历史提交质量优秀，建议优先审核通过' : item.submitterReputation >= 70 ? '中等信誉用户，需要仔细审核内容质量' : '低信誉用户，建议严格审核并关注内容合规性'}
                    </div>
                  </div>
                </div>
              </div>

              {(!item.missingFields || item.missingFields.length === 0) && (!item.sensitiveWords || item.sensitiveWords.length === 0) && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-green-400 mb-1">内容质量良好</div>
                      <div className="text-xs text-neutral-400">所有必填字段完整，未检测到违规内容，建议通过审核</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {item.notes && (
            <div>
              <h3 className="text-sm text-neutral-400 mb-3">审核备注</h3>
              <div className="bg-neutral-800/50 rounded-lg p-4">
                <p className="text-neutral-300 text-sm">{item.notes}</p>
              </div>
            </div>
          )}
        </div>

        {item.status === 'pending' && (
          <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-700 p-6">
            <div className="flex gap-3">
              <button onClick={() => onApprove(item)} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                通过审核
              </button>
              <button onClick={() => onReject(item)} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2">
                <X className="w-5 h-5" />
                驳回申请
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

