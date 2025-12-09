import React from 'react';
import { Shield, Edit3, Save, X } from 'lucide-react';

/**
 * 规则页顶部标题与编辑工具栏
 *
 * 说明：将编辑按钮与标题区域抽出，保持视图与逻辑分离；
 * 通过 props 控制编辑态与交互行为。
 */
export const RulesHeader: React.FC<{
  isAdmin: boolean;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ isAdmin, isEditMode, onToggleEdit, onSave, onCancel }) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl">站点规则</h1>
          <p className="text-neutral-400 text-sm mt-1">请仔细阅读并遵守以下规则，违规者将受到相应处罚</p>
        </div>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-green-500/30"
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-amber-500/30"
            >
              <Edit3 className="w-4 h-4" />
              编辑模式
            </button>
          )}
        </div>
      )}
    </div>
  );
};

