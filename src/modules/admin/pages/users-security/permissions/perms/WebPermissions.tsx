/**
 * 网页权限管理页面
 * 管理用户端网页的权限配置
 */
import React from "react";
import PermissionsPage from "./PermissionsPage";

const WebPermissions: React.FC = () => {
  return <PermissionsPage scope="web" title="网页权限" />;
};

export default WebPermissions;
