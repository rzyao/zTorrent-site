import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, Upload } from 'lucide-react';

/**
 * SubmitBar
 * 纯展示组件：负责渲染底部提示与取消/提交按钮。
 * - 提交按钮使用 `type="submit"`，由外层 `<form>` 捕获并处理；
 * - 取消通过回调触发路由跳转或其他处理。
 */
export interface SubmitBarProps {
  submitting: boolean;
  onCancel: () => void;
}

export function SubmitBar(props: SubmitBarProps) {
  const { submitting, onCancel } = props;
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <Info className="w-4 h-4 text-amber-400" />
        <span>发布前请仔细检查信息，确保准确无误</span>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 shadow-lg shadow-amber-500/25" disabled={submitting}>
          <Upload className="w-4 h-4 mr-2" />
          {submitting ? '发布中...' : '发布种子'}
        </Button>
      </div>
    </div>
  );
}

