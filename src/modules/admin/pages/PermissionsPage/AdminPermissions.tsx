/**
 * 后台权限管理页面
 * 管理后台管理端的权限配置
 */
import React from "react";
import PermissionsPage from "./PermissionsPage";

const AdminPermissions: React.FC = () => {
  return <PermissionsPage scope="admin" title="后台权限" />;
};

export default AdminPermissions;
