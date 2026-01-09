import React, { memo } from 'react';
import { Label } from '@/modules/app/components/ui/label';
import { Switch } from '@/modules/app/components/ui/switch';

/**
 * PublishOptions
 * 纯展示组件：负责渲染“发布选项”（匿名发布开关）。
 */
export interface PublishOptionsProps {
  isAnonymous: boolean;
  onAnonymousChange: (checked: boolean) => void;
}

export const PublishOptions = memo(function PublishOptions(props: PublishOptionsProps) {
  const { isAnonymous, onAnonymousChange } = props;
  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Label htmlFor="anonymous-switch">匿名发布</Label>
          <Switch checked={isAnonymous} onCheckedChange={onAnonymousChange} />
        </div>
      </div>
    </div>
  );
});

