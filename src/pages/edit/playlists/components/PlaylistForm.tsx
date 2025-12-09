import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, X, Image as ImageIcon, Globe, Users, Lock, Save } from 'lucide-react';
import type { Visibility } from '@/pages/Edit/playlists/types';

interface EditFormState {
  title: string;
  description: string;
  cover: string;
  visibility: Visibility;
}

interface PlaylistFormProps {
  /** 是否为创建模式 */
  isCreating: boolean;
  /** 是否为编辑模式 */
  isEditing: boolean;
  /** 受控表单状态 */
  editForm: EditFormState;
  /** 表单变更回调（简化：直接回传新表单对象） */
  onChange: (next: EditFormState) => void;
  /** 触发保存 */
  onSave: () => void;
  /** 取消创建/编辑 */
  onCancel: () => void;
  /** 上传相关：隐藏文件输入引用 */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** 触发文件选择 */
  onUploadClick: () => void;
  /** 选择文件后回调 */
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 片单创建/编辑表单组件：纯展示与交互，逻辑委托给父层。
 */
export function PlaylistForm({ isCreating, isEditing, editForm, onChange, onSave, onCancel, fileInputRef, onUploadClick, onUploadFile }: PlaylistFormProps) {
  if (!isCreating && !isEditing) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Edit className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-white text-xl">{isCreating ? '创建片单' : '编辑片单'}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-neutral-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* 片单标题 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">片单标题</label>
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => onChange({ ...editForm, title: e.target.value })}
          placeholder="输入片单标题..."
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      {/* 片单描述 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">片单描述</label>
        <textarea
          value={editForm.description}
          onChange={(e) => onChange({ ...editForm, description: e.target.value })}
          rows={4}
          placeholder="描述一下这个片单..."
          className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
        />
      </div>

      {/* 封面图片 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">封面图片</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={editForm.cover}
            onChange={(e) => onChange({ ...editForm, cover: e.target.value })}
            placeholder="输入图片URL..."
            className="flex-1 bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadFile} />
          <Button variant="outline" onClick={onUploadClick} className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
            <ImageIcon className="w-4 h-4 mr-2" />
            上传
          </Button>
        </div>
        {editForm.cover && (
          <img src={editForm.cover} alt="预览" className="w-full h-48 object-cover rounded-lg mt-2" />
        )}
      </div>

      {/* 可见性 */}
      <div className="space-y-2">
        <label className="text-neutral-300 text-sm">可见性</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onChange({ ...editForm, visibility: 'public' })}
            className={`p-4 rounded-xl border transition-all ${editForm.visibility === 'public'
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : 'bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600'
              }`}
          >
            <Globe className="w-5 h-5 mx-auto mb-2" />
            <p className="text-sm">公开</p>
          </button>
          <button
            onClick={() => onChange({ ...editForm, visibility: 'friends' })}
            className={`p-4 rounded-xl border transition-all ${editForm.visibility === 'friends'
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
              : 'bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600'
              }`}
          >
            <Users className="w-5 h-5 mx-auto mb-2" />
            <p className="text-sm">好友可见</p>
          </button>
          <button
            onClick={() => onChange({ ...editForm, visibility: 'private' })}
            className={`p-4 rounded-xl border transition-all ${editForm.visibility === 'private'
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'bg-neutral-900/30 border-neutral-700 text-neutral-400 hover:border-neutral-600'
              }`}
          >
            <Lock className="w-5 h-5 mx-auto mb-2" />
            <p className="text-sm">私密</p>
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onSave} disabled={!editForm.title} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25">
          <Save className="w-4 h-4 mr-2" />
          保存片单
        </Button>
        <Button onClick={onCancel} variant="outline" className="border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700/30">取消</Button>
      </div>
    </div>
  );
}

