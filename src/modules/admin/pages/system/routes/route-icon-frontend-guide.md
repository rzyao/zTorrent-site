# 前端对接文档 - 动态路由图标功能

此文档旨在指导前端开发人员如何对接并渲染动态路由中的 `icon` 字段。

## 1. 数据结构变更

在 `RouteTreeNodeDto`（及 `POST /routes/user` 响应）中，新增了 `icon` 字段：

| 字段名   | 类型           | 说明           | 示例                                        |
| :------- | :------------- | :------------- | :------------------------------------------ |
| **icon** | string \| null | 图标组件标识符 | `"Lucide:Home"`, `"Antd:DashboardOutlined"` |

## 2. 图标格式规范

后端存储的图标名称遵循 `库名前缀:组件名` 的约定格式：

- **Lucide 图标**: 格式为 `Lucide:IconName`
- **Ant Design 图标**: 格式为 `Antd:IconName`

## 3. 前端渲染建议

建议在前端封装一个通用图标组件 `DynamicIcon` 来处理解析与渲染逻辑。

### React 示例 (Lucide + Antd)

```tsx
import React from "react";
import * as LucideIcons from "lucide-react";
import * as AntdIcons from "@ant-design/icons";

interface DynamicIconProps {
  iconName?: string | null;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName, className }) => {
  if (!iconName) return null;

  const [prefix, name] = iconName.split(":");

  if (prefix === "Lucide") {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent className={className} /> : null;
  }

  if (prefix === "Antd") {
    const IconComponent = (AntdIcons as any)[name];
    return IconComponent ? <IconComponent className={className} /> : null;
  }

  return null;
};

export default DynamicIcon;
```

## 4. 后台管理说明

- 在管理后台创建或编辑路由时，请严格按照上述格式输入。
- **校验建议**：前端管理页面建议提供图标选择器，自动根据选中的库生成 `Prefix:Name` 字符串。
