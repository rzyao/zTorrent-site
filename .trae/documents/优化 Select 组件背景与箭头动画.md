## 目标
- 为 `SelectContent` 添加明确的下拉列表背景与边框，提升可读性。
- 为触发器中的 `ChevronDown` 添加展开/收起旋转动画，参考 `src/layouts/Header.tsx#L111` 的交互效果。

## 变更概览
- 在 `src/components/ui/select.tsx` 中：
  - 更新 `SelectContent`：在现有 `bg-popover` 的基础上增加深色主题的显式背景与边框（`bg-neutral-900/95 text-white border-neutral-700`），保留动画与位置逻辑。
  - 更新 `SelectTrigger`：加入 `group`，并将 `ChevronDown` 加入旋转动画（`transition-transform` + `group-data-[state=open]:rotate-180`）。

## 详细实现步骤
1. 更新 `SelectTrigger` 的 class：
   - 在现有 className 末尾加入 `group` 与图标旋转所需的过渡支持：
   - 代码：
   ```tsx
   function SelectTrigger({ className, size = "default", children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default"; }) {
     return (
       <SelectPrimitive.Trigger
         data-slot="select-trigger"
         data-size={size}
         className={cn(
           "... existing classes ...",
           "group",
           className,
         )}
         {...props}
       >
         {children}
         <SelectPrimitive.Icon asChild>
           <ChevronDown className="size-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
         </SelectPrimitive.Icon>
       </SelectPrimitive.Trigger>
     );
   }
   ```
   - 原理：Radix 在打开时会给 Trigger 设置 `data-state="open"`，利用 Tailwind 的 `group-data-[state=open]` 选择器为子元素（图标）添加旋转样式。

2. 更新 `SelectContent` 的样式：
   - 在现有类名里补充明确的深色背景与边框，保证在不依赖主题变量时也有良好显示：
   ```tsx
   function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
     return (
       <SelectPrimitive.Portal>
         <SelectPrimitive.Content
           data-slot="select-content"
           className={cn(
             "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
             position === "popper" &&
               "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
             // 明确背景与边框的回退样式（深色主题）
             "bg-neutral-900/95 text-white border-neutral-700 backdrop-blur-sm",
             className,
           )}
           position={position}
           {...props}
         >
           <SelectScrollUpButton />
           <SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1")}>{children}</SelectPrimitive.Viewport>
           <SelectScrollDownButton />
         </SelectPrimitive.Content>
       </SelectPrimitive.Portal>
     );
   }
   ```
   - 说明：保留现有动画与 popper 位置处理；新增 `bg-neutral-900/95` 等确保列表在当前站点深色风格下清晰可见。

## 验证方案
- 在 `ControlPage` 的“所在地”选择处打开 Select，下拉面板应有深色背景与白色文字；
- 点击触发器时，`ChevronDown` 180 度旋转；关闭时恢复；
- 在 `http://localhost:5175/` 验证多次打开/关闭及不同分辨率下的显示；

## 注释与说明
- 在上述变更的代码段添加中文注释，说明：
  - 为什么使用 `group-data-[state=open]` 来驱动子元素动画；
  - 为什么增加显式背景与边框作为回退样式，提升一致性与可读性。