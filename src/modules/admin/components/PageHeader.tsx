import { useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const map: Record<string, string> = {
  "/": "首页",
  "/system": "系统设置",
  "/site": "网站设置",
  "/categories": "分类设置",
  "/torrents": "种子管理",
  "/forum": "论坛管理",
  "/users": "用户管理",
  "/roles": "角色管理",
  "/permissions": "权限管理",
};

export default function PageHeader() {
  const { pathname } = useLocation();
  const key = Object.keys(map).find((k) => pathname.startsWith(k)) || "/";

  return (
    <nav className="mb-4 flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <span className="inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            <Home className="mr-2 h-4 w-4" />
            管理后台
          </span>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 text-neutral-300" />
            <span className="ml-1 text-sm font-medium text-neutral-900 md:ml-2">{map[key]}</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}
