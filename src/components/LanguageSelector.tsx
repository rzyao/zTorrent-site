"use client";

import { Globe } from "lucide-react";
import { useLanguage, type SupportedLanguage } from "@/hooks/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/app/components/ui/select";
import { cn } from "@/utils/cn";

interface LanguageSelectorProps {
  /** 自定义类名 */
  className?: string;
  /** 是否显示国旗 */
  showFlag?: boolean;
  /** 是否显示语言名称 */
  showLabel?: boolean;
  /** 是否仅显示图标（紧凑模式） */
  iconOnly?: boolean;
  /** 触发器大小 */
  size?: "sm" | "default";
}

/**
 * 语言选择器组件
 * 用于切换界面语言
 */
export function LanguageSelector({
  className,
  showFlag = true,
  showLabel = true,
  iconOnly = false,
  size = "default",
}: LanguageSelectorProps) {
  const { currentLanguage, currentLanguageInfo, changeLanguage, supportedLanguages } =
    useLanguage();

  const handleLanguageChange = (value: string) => {
    changeLanguage(value as SupportedLanguage);
  };

  if (iconOnly) {
    return (
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger
          className={cn(
            "w-auto gap-1 border-transparent bg-transparent px-2 hover:bg-neutral-800/50",
            className
          )}
          size={size}
          hideChevron
        >
          <Globe className="size-4" />
          {showFlag && <span>{currentLanguageInfo.flag}</span>}
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className={cn("w-[140px]", className)} size={size}>
        <SelectValue>
          <span className="flex items-center gap-2">
            {showFlag && <span>{currentLanguageInfo.flag}</span>}
            {showLabel && <span>{currentLanguageInfo.label}</span>}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              {showFlag && <span>{lang.flag}</span>}
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
