import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/modules/app/components/ui/badge";
import { Shield, Edit3, Save, X } from "lucide-react";
import { AccessControl } from "@/permissions/AccessControl";
/**
 * 顶部重要提示模块
 *
 * 说明：保持原有视觉样式与文案，作为可复用的纯展示组件。
 */
export const ImportantNotice: React.FC<{
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onToggleEdit: () => void;
}> = ({ isEditMode, onSave, onCancel, onToggleEdit }) => {
  return (
    <div className="mb-8 p-6 rounded-2xl bg-linear-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/30 flex items-center justify-between">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-amber-400 mb-2">重要提示</h3>
          <p className="text-neutral-300 text-sm leading-relaxed mb-3">
            注册并使用本站服务即表示您已阅读、理解并同意遵守所有站点规则。不了解规则不能成为违规的理由。
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              保持良好分享率
            </Badge>
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              遵守做种规则
            </Badge>
            <Badge className="bg-red-500/20 text-red-400">
              <XCircle className="w-3 h-3 mr-1" />
              禁止多开账号
            </Badge>
            <Badge className="bg-red-500/20 text-red-400">
              <XCircle className="w-3 h-3 mr-1" />
              禁止作弊刷流量
            </Badge>
          </div>
        </div>
      </div>

      <AccessControl requiredRoles={["admin"]}>
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-green-500/30"
              >
                <Save className="w-4 h-4" />
                保存更改
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white text-sm transition-all"
              >
                <X className="w-4 h-4" />
                取消
              </button>
            </>
          ) : (
            <button
              onClick={onToggleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-amber-500/30"
            >
              <Edit3 className="w-4 h-4" />
              编辑模式
            </button>
          )}
        </div>
      </AccessControl>
    </div>
  );
};
