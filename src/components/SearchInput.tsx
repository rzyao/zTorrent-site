import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string; // 容器样式
  inputClassName?: string; // 输入框额外样式
}

/**
 * 通用搜索框组件
 * 默认样式：右侧搜索按钮，圆角输入框
 * 支持通过 className 自定义覆盖
 */
export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "搜索...",
  className,
  inputClassName,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.();
    }
  };

  return (
    <div
      className={cn(
        "relative flex-1 min-w-0 md:min-w-[320px] md:max-w-[900px] lg:max-w-[1020px]",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-amber-300 hover:bg-transparent"
        aria-label="搜索"
      >
        <Search className="w-5 h-5" />
      </Button>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full input text-white pl-4 pr-11 py-2 md:py-4 rounded-full focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500",
          inputClassName
        )}
      />
    </div>
  );
}
