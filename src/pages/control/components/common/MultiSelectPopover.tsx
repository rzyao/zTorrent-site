import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface MultiSelectPopoverProps<T> {
  label: string;
  options: T[];
  isChecked: (opt: T) => boolean;
  onToggle: (opt: T, checked: boolean) => void;
  optionKey?: (opt: T) => string;
  optionLabel?: (opt: T) => string;
}

// 通用多选弹出组件
// 职责：用于“分类/影片类型”多选场景复用 Popover + Checkbox 结构
export function MultiSelectPopover<T>({ label, options, isChecked, onToggle, optionKey, optionLabel }: MultiSelectPopoverProps<T>) {
  const getKey = (opt: any) => (optionKey ? optionKey(opt) : String(opt));
  const getLabel = (opt: any) => (optionLabel ? optionLabel(opt) : String(opt));
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-neutral-300 border-neutral-700/50 hover:bg-neutral-800">
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-neutral-900 border border-neutral-700/50">
        <div className="space-y-2 max-h-64 overflow-auto pr-1">
          {options.map((opt) => {
            const key = getKey(opt);
            const checked = isChecked(opt);
            return (
              <label key={key} className="flex items-center gap-2 text-sm text-neutral-300">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => onToggle(opt, Boolean(v))}
                />
                <span>{getLabel(opt)}</span>
              </label>
            );
          })}
          {options.length === 0 && <div className="text-neutral-500 text-xs">暂无选项</div>}
        </div>
      </PopoverContent>
    </Popover>
  );
}

