import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { AccessControl } from '@/components/AccessControl';
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

export const SubmitBar = memo(function SubmitBar(props: SubmitBarProps) {
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
        {/* 发布种子按钮：需要上传权限 */}
        <AccessControl
          requiredPermissions={['torrent:create']}
          name="发布种子"
          fallback={
            <Button type="button" disabled className="bg-neutral-700 text-neutral-400 px-8">
              <Upload className="w-4 h-4 mr-2" />
              {submitting ? '发布中...' : '发布种子'}
            </Button>
          }
        >
          <Button type="submit" className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 shadow-lg shadow-amber-500/25" disabled={submitting}>
            <Upload className="w-4 h-4 mr-2" />
            {submitting ? '发布中...' : '发布种子'}
          </Button>
        </AccessControl>
      </div>
    </div>
  );
});

