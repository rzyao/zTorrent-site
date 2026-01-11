# BonusRulesPage 重构计划

## 1. 基础工作

- [ ] 创建 `implementation_plan.md` (已创建)
- [ ] 重命名目录 `Rules` -> `BonusRulesPage`
- [ ] 更新路由注册 (如果有的话)

## 2. 数据结构与常量

- [ ] 创建 `types.ts`: 定义配置对象、模拟参数和结算结果的类型
- [ ] 创建 `constants.ts`: 移动映射表、字段名称、数值范围限制等

## 3. 逻辑层拆分 (Hooks)

- [ ] 创建 `hooks/useBonusConfig.ts`: 使用 TanStack Query 处理 API 获取和保存
- [ ] 创建 `hooks/useBonusScenario.ts`: 处理用户模拟场景的状态管理
- [ ] 创建 `hooks/useBonusCalculation.ts`: 纯客户端计算逻辑或调用模拟接口

## 4. UI 组件标准化

- [ ] 重构 `ConfigForm.tsx`: 替换 antd/原生 input 为标准 UI 组件，优化布局
- [ ] 重构 `ScenarioPanel.tsx`: 优化网格布局，标准化输入框
- [ ] 重构 `ResultsPanel.tsx`: 增强卡片视觉效果，优化公式展示

## 5. 页面组装

- [ ] 更新 `index.tsx`: 整合新 Hooks 和组件
- [ ] 删除冗余文件 (.css 等)

## 6. 验证

- [ ] 检查编译错误
- [ ] 验证功能完整性
