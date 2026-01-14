import { useEffect } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { composeTitle } from "@/utils/title";

export function useDynamicTitle(pageName?: string) {
  const cfg = useSiteConfig();
  useEffect(() => {
    const next = composeTitle({ title: cfg.title }, pageName);
    // 即使 next 为空，也应该有一个兜底，防止保持旧页面的标题
    document.title = next || cfg.title || "zTorrent";
  }, [cfg.title, pageName]);
}
