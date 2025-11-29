## 目标
- 全局查找所有原生 `select` 并统一替换为 `@/components/ui/select` 组件，风格与交互一致（深色背景、统一边框、触发器箭头旋转）。

## 影响范围（文件与位置）
- `src/pages/ControlPage.tsx`：语言、主题、每页数量、默认视图、会话超时等多处 `select`
- `src/pages/forum/ForumPage.tsx`：新主题创建时的板块选择（动态 `option`）
- `src/pages/ReviewPage.tsx`：时间范围、评分范围、信誉筛选
- `src/pages/edit/EditMoviePage.tsx`：影片分类、种子质量、来源、编码
- `src/pages/MessagesPage.tsx`：撰写消息与回复格式选择

## 统一替换规则
- 基本结构：
  - 原生：`<select value={val} onChange={(e)=>setVal(e.target.value)}>{options}</select>`
  - 自定义：
    ```tsx
    <Select value={val} onValueChange={(v)=>setVal(v)}>
      <SelectTrigger>
        <SelectValue placeholder="请选择" />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    ```
- 值类型：
  - 数值型（如每页数量、会话超时）保持显示为字符串，`onValueChange={(v)=>setVal(parseInt(v))}`。
  - 其他保持字符串；必要处保留原有 `as any`。
- 样式：
  - 使用组件内已统一的边框与焦点样式，无需额外 `className`；如需占位符/尺寸可在 `SelectTrigger` 添加补充。
- 禁用态/校验态：如存在 `disabled` 或 `aria-invalid`，透传到 `SelectTrigger`/`Select` 并保留逻辑。

## 文件级改动清单与示例
- `ControlPage.tsx`
  - 语言：`value={preferences.language}` → `Select`，`onValueChange={(v)=>setPreferences({...preferences, language:v})}`。
  - 主题：同上（字符串）。
  - 每页显示：`parseInt` 处理数值。
  - 默认视图：字符串。
  - 会话超时：`parseInt` 处理数值。
- `forum/ForumPage.tsx`
  - 板块选择：保留默认 "请选择板块" 为一个 `<SelectItem value="">`，动态 `serverCategories` 生成 `SelectItem`。
- `ReviewPage.tsx`
  - 时间范围、评分范围、信誉筛选：字符串替换，保留原来的枚举含义。
- `edit/EditMoviePage.tsx`
  - 影片分类、质量、来源、编码：字符串替换，使用 `SelectItem` 列出固定枚举。
- `MessagesPage.tsx`
  - 撰写/回复格式：字符串替换；若原有 `as any`，在 `onValueChange={(v)=>setComposeFormat(v as any)}` 保持兼容。

## 验证方案
- 打开上述页面，逐一测试：展开下拉、选择某项、状态更新；检查数值型字段是否正确转换。
- 视觉：下拉背景为深色、触发器箭头旋转、边框与焦点统一、禁用态与校验态正确显示。

## 注意事项
- 动态选项列表：确保 `key` 与 `value` 使用稳定的字符串值。
- 表单状态：不改动现有状态结构，仅修改选择控件的事件来源。
- 无障碍：保留标签与占位文本；如原有 `aria-invalid` 则透传到 `SelectTrigger`。

## 注释约定
- 在每处替换点添加中文注释：说明使用自定义 `Select` 的原因、数值转换（如有）、以及保留的校验/禁用逻辑。

请确认后，我将按照以上清单逐文件实施替换，并完成验证。