import { NavigationItem } from "@/types/navigation";
import { canAccess } from "@/utils/access";

/**
 * 递归过滤导航菜单
 * 1. 过滤掉没有权限的节点
 * 2. 过滤掉不可见的节点 (isVisible=false)
 * 3. 过滤掉没有子节点的 Group 节点 (path='#')
 */
export function filterNavigationTree(items: NavigationItem[], access: any, loading: boolean): NavigationItem[] {
  if (!items) return [];

  return items.reduce((acc, item) => {
    // 1. Basic Visibility
    if (!item.isVisible) return acc;

    // 2. Permission Check
    // If permissions required but access is loading, skip (conservative)
    if (loading && item.permissions && item.permissions.length > 0) return acc;
    
    if (item.permissions && item.permissions.length > 0) {
        if (!canAccess(access, { requiredPermissions: item.permissions, combine: 'OR' })) {
            return acc;
        }
    }

    // 3. Filter Children Recursively
    let filteredChildren = item.children;
    if (item.children && item.children.length > 0) {
        filteredChildren = filterNavigationTree(item.children, access, loading);
    }

    // 4. Filter Empty Groups (Parent with path '#' and no visible children)
    if (item.path === '#' && (!filteredChildren || filteredChildren.length === 0)) {
        return acc;
    }

    // Push valid item (with updated children)
    acc.push({
        ...item,
        children: filteredChildren
    });
    return acc;
  }, [] as NavigationItem[]);
}
