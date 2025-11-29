## 目标
- 在 `src/layouts/Header.tsx` 中复制并集成 `src/routes/Header.tsx` 的“点击头像显示下拉菜单”功能。
- 保持现有导航（`NavLink`/`useNavigate`）与布局样式不变，新增用户头像与下拉菜单交互。

## 变更概览
- 新增导入：`useState`/`useRef`/`useEffect`、`UserAvatar`、下拉菜单所需图标（`ChevronDown`、`UserCircle`、`Settings`、`LogOut`）。
- 在组件内新增：`showUserMenu` 状态、`userMenuRef` 引用、点击外部与 Esc 关闭的副作用。
- 替换现有的用户图标按钮（`src/layouts/Header.tsx:77-83`）为“头像 + 向下箭头 + 下拉菜单”结构。
- 下拉菜单内容与样式对齐 `routes/Header.tsx`：顶部用户信息卡片、统计格子、菜单项（个人信息、控制台）、退出登录分区。
- 导航适配：使用 `useNavigate` 跳转到对应路由（如 `/profile`、`/control`、`/login`）。用户名显示用 `useAccess().access?.username`，无则回退到占位名。

## 详细实现步骤
1. 在 `src/layouts/Header.tsx` 顶部：
   - 增加 `import { useState, useRef, useEffect } from 'react'`；
   - 增加 `import { ChevronDown, Settings, LogOut, UserCircle } from 'lucide-react'`；
   - 增加 `import { UserAvatar } from '@/components/UserAvatar'`；保留现有 `ChartSpline` 用于顶部统计，统计格子内可继续使用。
2. 在 `Header` 组件体内：
   - 新增 `const [showUserMenu, setShowUserMenu] = useState(false)`；
   - 新增 `const userMenuRef = useRef<HTMLDivElement>(null)`；
   - 新增 `useEffect` 监听：当 `showUserMenu` 为真时绑定 `mousedown`（点击外部）与 `keydown`（Escape）事件，关闭菜单；并在清理阶段移除监听。
3. 在 `src/layouts/Header.tsx:77-83` 处：
   - 用一个 `div` 包裹并设置 `ref={userMenuRef}`；
   - 将原来的 `User` 图标按钮替换为：
     - 一个 `button`，点击切换 `showUserMenu`；内容为 `<UserAvatar username={access?.username ?? '用户'} size="sm" />` 与 `ChevronDown` 图标（带旋转动效）。
     - 条件渲染的下拉菜单 `<div className="dropdown-menu ...">`，结构与 `src/routes/Header.tsx` 保持一致：
       - 顶部信息区域：头像（`size="lg"`）、用户名、会员身份占位、三列统计（上传、下载、分享率）；
       - 菜单项：
         - 个人信息：`onClick` 先 `setShowUserMenu(false)`，再 `navigate('/profile')`；
         - 控制台：`onClick` 先 `setShowUserMenu(false)`，再 `navigate('/control')`；
       - 退出登录分区：`onClick` 先 `setShowUserMenu(false)`，如 `useAccess` 暴露 `logout()` 则调用并 `navigate('/login')`，否则直接跳转到 `/login`。
4. 样式与交互：
   - 复用 `routes/Header.tsx` 的类名（渐变背景、圆角、阴影等），以保持视觉一致；
   - 保留布局头部的 `sticky` 与 `top: -64px` 行为不变；
   - 移动端与桌面端下拉层级使用 `z-50`，避免被其他元素覆盖。

## 验证方案
- 运行开发服务后，点击头像：下拉出现；点击空白处或按 `Esc`：下拉关闭。
- 点击“个人信息”、“控制台”正确导航；点击“退出登录”返回登录页并清理会话（如提供）。
- 检查在不同分辨率下的布局与遮挡；检查键盘无障碍（Tab 聚焦、Enter 触发）。

## 兼容性与注意事项
- 使用路径别名 `@` 引入 `UserAvatar`，与现有 `ui/button` 引入方式一致。
- 事件监听仅在菜单打开时绑定，关闭或组件卸载时清理，避免内存泄漏。
- 若后续需要更多菜单项（如“工单”、“消息”），可按同一模式扩展。

## 注释与说明
- 实施时将在新增的状态、引用、`useEffect`、按钮与菜单项点击处添加逐行注释，解释交互与关闭逻辑、导航原因及样式选择，满足您的注释与解释需求。