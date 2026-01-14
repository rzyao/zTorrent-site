import { useLocation, matchPath } from "react-router-dom";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";

/**
 * 自动根据当前路由同步浏览器标签标题
 */
export function TitleInjector() {
  const { pathname } = useLocation();
  const { routes } = useRouteConfig();

  // 根据路径查找路由名称
  const findRouteName = (
    nodes: any[],
    currentPath: string,
    parentPath = "",
  ): string | undefined => {
    for (const node of nodes) {
      // 拼接当前节点的完整路径
      let nodePath = node.path || "";
      let fullPath = "";

      if (nodePath.startsWith("/")) {
        fullPath = nodePath;
      } else {
        fullPath = parentPath === "/" ? `/${nodePath}` : `${parentPath}/${nodePath}`;
      }

      // 规范化路径
      fullPath = fullPath.replace(/\/+/g, "/");
      if (fullPath === "") fullPath = "/";

      // 1. 使用 matchPath 进行匹配
      const match = matchPath({ path: fullPath, end: true }, currentPath);
      if (match) {
        return node.name;
      }

      // 2. 递归查找子节点
      if (node.children && node.children.length > 0) {
        // 如果当前路径以此路径为前缀（由于支持动态参数，这里用简单的 startsWith 可能会有问题，
        // 但为了性能，只有当前路径确实匹配到此前缀时才深挖）
        // 这里的 fullPath 可能是 /movie/:id，所以 startsWith 并不总是可靠，
        // 但通常 parent 节点不带动态参数。

        // 即使父节点不完全匹配，只要它可能是前缀，就继续查找
        // 比如 parent 是 /app，current 是 /app/movies
        const isPotentialParent = currentPath.startsWith(
          fullPath.endsWith("/") ? fullPath : fullPath + "/",
        );
        if (fullPath === "/" || isPotentialParent) {
          const matchResult = findRouteName(node.children, currentPath, fullPath);
          if (matchResult) return matchResult;
        }
      }
    }
    return undefined;
  };

  const pageName = findRouteName(routes, pathname);
  useDynamicTitle(pageName);

  return null;
}
