# App (User) UI 设计规范

## 1. 核心技术栈

- **框架**: Radix UI + Tailwind CSS (Shadcn UI 风格)。
- **图标**: `lucide-react`。
- **动画**: `framer-motion` (ScaleTransition 等)。

## 2. 视觉风格

- **圆角**: 默认使用 `rounded-lg` 或 `rounded-xl`，风格较 Admin 更加圆润。
- **阴影**: 容器通常使用 `shadow-sm` 或 `shadow-md` 以增强层次感。
- **间距**: 遵循 4px 步进系统 (`gap-4`, `p-6` 等)。

## 3. UI 组件库定位

- 所有基础 UI 组件位于 `@/modules/app/components/ui/`。
- **Button**: 提供 `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` 变体。
- **Card**: 用于信息区块封装，统一使用 `bg-card` 和 `border`。

## 4. 交互准则

- **响应式**: 必须优先考虑移动端 (`Mobile-First`)。
- **状态反馈**: 按钮点击需有缩放动画或状态改变。
- **加载态**: 使用 `Skeleton` (位于 `app/components/skeletons`) 进行占位。
