// @ts-nocheck
import { useState } from 'react';
import { Plus, X, Send } from 'lucide-react';
import { Button } from '@/modules/app/components/ui/button';
import { AccessControl } from '@/permissions/AccessControl';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/modules/app/components/ui/select';
import { RichTextEditor } from '../RichTextEditor';

interface CreateThreadFormProps {
  categories: Array<{ id: string; name: string }>;
  initialCategoryId: string;
  onCancel: () => void;
  onSubmit: (data: { title: string; content: string; categoryId: string }) => Promise<void>;
}

export function CreateThreadForm({ categories, initialCategoryId, onCancel, onSubmit }: CreateThreadFormProps) {
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
      const catId = categoryId?.trim();
      const t = title.trim();
      const c = content.trim();

      if (!catId) { setError('请先选择板块'); return; }
      if (!t || !c) { setError('标题与内容不能为�?); return; }
      
      setError(null);
      setSubmitting(true);
      try {
        await onSubmit({ categoryId: catId, title: t, content: c });
      } catch (err: any) {
         setError(err.message || '发布失败');
      } finally {
        setSubmitting(false);
      }
  };

  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      <div className="bg-linear-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4 flex items-center justify-between">
        <h2 className="text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" />
          发布新帖
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-6 space-y-4">
        {error && (
            <div className="bg-red-500/15 border border-red-500/50 text-red-300 rounded-lg px-4 py-3">
              {error}
            </div>
        )}
        <div>
          <label className="text-neutral-300 text-sm mb-2 block">
            板块 <span className="text-red-400">*</span>
          </label>
          <Select
            value={categoryId}
            onValueChange={(v) => { const value = v === 'none' ? '' : v; setCategoryId(value); if (error) setError(null); }}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择板块" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">请选择板块</SelectItem>
              {categories.filter(c => c.id !== 'all').map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-neutral-300 text-sm mb-2 block">
            标题 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="输入帖子标题"
            className="w-full bg-neutral-900/60 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-neutral-300 text-sm mb-2 block">
            内容 <span className="text-red-400">*</span>
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="输入帖子内容，支持Markdown格式和图�?.."
            minHeight="300px"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            取消
          </Button>
          {/* 发布新帖按钮：需要论坛发帖权�?*/}
          <AccessControl
            requiredPermissions={['forum:thread.create']}
            name="发布新帖"
            fallback={
              <Button disabled className="bg-neutral-700 text-neutral-400">
                <Send className="w-4 h-4 mr-2" />
                {submitting ? '发布�?..' : '发布'}
              </Button>
            }
          >
            <Button
              className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              onClick={handleSubmit}
              disabled={submitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? '发布�?..' : '发布'}
            </Button>
          </AccessControl>
        </div>
      </div>
    </div>
  );
}

