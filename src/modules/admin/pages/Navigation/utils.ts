/**
 * 导航设置页面工具函数
 */
import type { NavigationItem } from "@/types/navigation";

/**
 * 将扁平导航数据构建为树形结构
 * @param items 扁平导航项列表
 * @returns 树形结构的导航项列表
 */
export const buildTree = (items: NavigationItem[]): NavigationItem[] => {
  const map = new Map<string, NavigationItem>();
  const roots: NavigationItem[] = [];

  // 初始化：为每个项创建带空 children 的副本
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // 构建树：将子节点挂载到父节点
  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  // 递归排序函数
  const sortRecursive = (nodes: NavigationItem[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder);
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortRecursive(node.children);
      } else {
        delete node.children; // 移除空的 children 数组，保持 UI 整洁
      }
    });
  };

  sortRecursive(roots);
  return roots;
};

/**
 * 将树形结构展平为扁平列表，同时更新 sortOrder 和 parentId
 * @param nodes 树形结构的导航项列表
 * @param parentId 父节点 ID（递归用）
 * @returns 扁平化后的导航项列表
 */
export const flattenTree = (
  nodes: NavigationItem[],
  parentId: string | null = null
): NavigationItem[] => {
  let result: NavigationItem[] = [];
  nodes.forEach((node, index) => {
    // 根据当前索引更新 sortOrder，根据递归上下文更新 parentId
    const newNode = { ...node, sortOrder: index + 1, parentId };
    const { children, ...itemWithoutChildren } = newNode;
    result.push(itemWithoutChildren);

    if (children && children.length > 0) {
      result = result.concat(flattenTree(children, node.id));
    }
  });
  return result;
};

/**
 * 递归遍历树，找到指定 key 的节点并执行回调
 * @param data 树形数据
 * @param key 目标节点 ID
 * @param callback 找到节点后的回调函数
 */
export const loopTree = (
  data: NavigationItem[],
  key: string,
  callback: (item: NavigationItem, index: number, arr: NavigationItem[]) => void
): void => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === key) {
      return callback(data[i], i, data);
    }
    if (data[i].children) {
      loopTree(data[i].children!, key, callback);
    }
  }
};

/**
 * 递归更新树中指定节点的属性
 * @param nodes 树形数据
 * @param id 目标节点 ID
 * @param updates 要更新的属性
 */
export const updateTreeNode = (
  nodes: NavigationItem[],
  id: string,
  updates: Partial<NavigationItem>
): void => {
  nodes.forEach((node) => {
    if (node.id === id) {
      Object.assign(node, updates);
    }
    if (node.children) {
      updateTreeNode(node.children, id, updates);
    }
  });
};
