import * as React from "react";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Input, InputProps } from "./input";
import { Button } from "./button";

export interface SearchInputProps extends Omit<InputProps, "onSubmit"> {
  /** 点击搜索或由回车触发的回调 */
  onSearch?: (value: string) => void;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 搜索按钮的容器类名 */
  wrapperClassName?: string;
  /** 是否显示搜索按钮，或者自定义按钮内容 */
  enterButton?: boolean | React.ReactNode;
}

/**
 * SearchInput 搜索框组件
 * 模仿 Ant Design Input.Search 的设计
 */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, onSearch, loading, enterButton = true, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;

    const [focused, setFocused] = React.useState(false);

    const handleSearch = () => {
      onSearch?.(combinedRef.current?.value || "");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
      props.onKeyDown?.(e);
    };

    return (
      <div
        className={cn(
          "group relative flex w-full items-center transition-all duration-200",
          focused && enterButton && "z-10",
          wrapperClassName,
        )}
      >
        <Input
          {...props}
          ref={combinedRef}
          className={cn(
            "pr-10",
            enterButton && "rounded-r-none border-r-0",
            focused && "border-primary ring-2 ring-[rgba(5,145,255,0.1)] outline-none",
            className,
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          onKeyDown={handleKeyDown}
        />
        {enterButton ? (
          <Button
            type="button"
            variant="primary"
            className={cn(
              "h-8 rounded-l-none px-3 transition-all duration-200",
              focused && "ring-l-0 ring-2 ring-[rgba(5,145,255,0.1)]",
              loading && "pointer-events-none",
            )}
            onClick={handleSearch}
            loading={loading}
          >
            {typeof enterButton === "boolean" ? <SearchIcon className="h-4 w-4" /> : enterButton}
          </Button>
        ) : (
          <div
            className="absolute right-3 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            onClick={handleSearch}
          >
            <SearchIcon className="h-4 w-4" />
          </div>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
