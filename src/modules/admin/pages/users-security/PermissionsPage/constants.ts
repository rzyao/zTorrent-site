import { PermissionType } from "./types";

export const PERMISSION_TYPE_OPTIONS = [
  { label: "页面", value: "page", description: "路由页面访问控制" },
  { label: "按钮", value: "button", description: "页面内操作按钮控制" },
  { label: "接口", value: "api", description: "后端接口权限校验" },
] as const;

export const getTypeTagColor = (type: PermissionType) => {
  switch (type) {
    case "page":
      return "blue";
    case "button":
      return "green";
    case "api":
      return "purple";
    default:
      return "default";
  }
};

export const getTypeLabel = (type: PermissionType) => {
  const option = PERMISSION_TYPE_OPTIONS.find((opt) => opt.value === type);
  return option ? option.label : type;
};
