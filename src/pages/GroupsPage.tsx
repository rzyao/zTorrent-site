/**
 * 重导出入口文件（保持路由不变）
 *
 * 目的：
 * - 让路由和外部引用仍指向 `src/pages/GroupsPage.tsx`
 * - 实际实现已拆分至 `src/pages/GroupsPage/` 目录，形成组件/类型/工具/常量分层
 *
 * 说明：
 * - 此文件仅做命名导出，便于后续维护；不做旧代码兼容逻辑。
 */
// 注意：显式指向目录下的 index，避免模块解析将 './GroupsPage' 解析到本文件自身导致循环引用。
export { GroupsPage } from './GroupsPage/index';
