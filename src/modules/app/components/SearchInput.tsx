import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/modules/app/components/ui/button";
import { Input } from "@/modules/app/components/ui/input";

export interface SearchInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 初始值或外部控制的值 */
  value?: string;
  /** 搜索触发回调 (回车或点击按钮) */
  onSearch?: (value: string) => void;
  /** 占位符 */
  placeholder?: string;
  /** 输入框的额外样式 */
  inputClassName?: string;
  /** 传递给 Input 组件的 props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * 搜索输入框组件
 *
 * 特性：
 * 1. 内部管理输入状态，输入时不触发搜索
 * 2. 仅在 "Enter" 键或点击搜索按钮时调用 onSearch
 * 3. 支持 value prop 同步（如 URL 变化时更新内部状态）
 */
const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  (
    {
      className,
      value: propValue = "",
      onSearch,
      placeholder = "搜索...",
      inputClassName,
      inputProps,
      ...props
    },
    ref,
  ) => {
    // 内部状态维护当前输入值
    const [keyword, setKeyword] = React.useState(propValue);

    // 当 propValue 变化时（如 URL 参数变了），同步更新内部状态
    React.useEffect(() => {
      setKeyword(propValue);
    }, [propValue]);

    const handleSearch = () => {
      onSearch?.(keyword.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
      inputProps?.onKeyDown?.(e);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative min-w-0 flex-1 md:max-w-[900px] md:min-w-[320px] lg:max-w-[1020px]",
          className,
        )}
        {...props}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleSearch}
          className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-amber-300"
          aria-label="搜索"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "input w-full rounded-full py-2 pr-11 pl-4 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-[#00A8E1] md:py-4",
            inputClassName,
          )}
          {...inputProps}
        />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
