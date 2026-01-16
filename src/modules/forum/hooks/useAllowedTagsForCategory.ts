import { useEffect, useMemo, useState } from "react";
import { ForumsCategoriesService } from "@/api";

export function useAllowedTagsForCategory(categoryId?: string) {
  const [allowedTagNames, setAllowedTagNames] = useState<Set<string> | null>(null);
  useEffect(() => {
    const load = async () => {
      if (!categoryId) {
        setAllowedTagNames(null);
        return;
      }
      try {
        const res = await ForumsCategoriesService.categoriesControllerFindCategoryTags({
          categoryId,
          grouped: true,
          page: 1,
          limit: 100000,
        } as any);
        const d: any = res.data || {};
        const names: string[] = [];
        if (Array.isArray(d?.groups)) {
          d.groups.forEach((g: any) => {
            if (Array.isArray(g?.tags)) {
              names.push(...g.tags.map((t: any) => String(t?.name)));
            }
          });
        }
        if (Array.isArray(d?.ungroupedTags)) {
          names.push(...d.ungroupedTags.map((t: any) => String(t?.name)));
        }
        setAllowedTagNames(new Set(names));
      } catch {
        setAllowedTagNames(null);
      }
    };
    load();
  }, [categoryId]);

  const hasRestrictions = useMemo(() => !!allowedTagNames && allowedTagNames.size > 0, [allowedTagNames]);
  const filterByAllowed = useMemo(
    () => (input: Array<{ name: string }>) =>
      hasRestrictions ? input.filter((t) => allowedTagNames!.has(t.name)) : input,
    [hasRestrictions, allowedTagNames],
  );

  return { allowedTagNames, filterByAllowed, hasRestrictions };
}

