import { CategoryForm } from "../components/CategoryForm";

/**
 * 新建类别页面
 * 路由: /forum/new-category
 * 权限: 仅管理员可访问
 */
export function NewCategoryPage() {
  return <CategoryForm mode="create" />;
}
