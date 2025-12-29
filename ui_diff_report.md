# UI 差异与一致性报告 (UI Diff Report)

## 1. 概述 (Overview)

- **对比源 (Reference):** [Discourse Demo](https://try.discourse.org/t/recommend-a-great-youtube-video/287/2)
- **目标页 (Target Implementation):** `src/pages/Forums/pages/TopicDetail.tsx` (Rendered at `/forum/topic/287`)
- **状态 (Status):** 差异审计完成 (Audit Completed)

## 2. 关键差异发现 (Key Gap Analysis)

### 2.1 布局与结构 (Layout & Structure)

| 位置 (Location)   | 特性 (Feature) | 期望表现 (Expected - Discourse) | 当前表现 (Actual - Local) | 严重程度 (Severity) | 修复建议 (Action)                                    |
| :---------------- | :------------- | :------------------------------ | :------------------------ | :------------------ | :--------------------------------------------------- |
| **Right Sidebar** | Timeline Width | **112px**                       | **140px** (`w-[140px]`)   | Moderate            | 修改为 `w-[112px]`                                   |
| **Right Sidebar** | Timeline Gap   | **~16px**                       | **24px** (`ml-6`)         | Minor               | 修改为 `ml-4` (16px)                                 |
| **Post Stream**   | Post Padding   | **~12px (Top/Bottom)**          | **24px** (`py-6`)         | Visual              | 减少 `<Post>` 组件的垂直 Padding 为 `py-3` 或 `py-4` |

### 2.2 视觉组件 (Visual Components)

| 位置 (Location)  | 特性 (Feature)  | 期望表现 (Expected - Discourse) | 当前表现 (Actual - Local) | 严重程度 (Severity) | 修复建议 (Action)                                                                                                      |
| :--------------- | :-------------- | :------------------------------ | :------------------------ | :------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| **Post Avatar**  | Avatar Size     | **~34px**                       | **48px** (`h-12 w-12`)    | **Critical**        | 修改为 `h-[45px] w-[45px]` (首贴) 和 `h-[34px] w-[34px]` (后续) 以匹配规范，或统一调整为 45px (Discourse 首贴头像较大) |
| **Topic Header** | Title Font Size | **~24px** (1.5rem)              | **~27px** (1.7em)         | Visual              | 修改为 `text-2xl` 或 `text-[24px]`                                                                                     |
| **Topic Header** | Breadcrumbs     | **Category Badge**              | **Use Color Bar + Text**  | Visual              | 确保类别徽章样式与 Discourse 一致 (背景色块+文字)                                                                      |

### 2.3 排版与细微差别 (Typography & Micro-interactions)

| 位置 (Location)  | 特性 (Feature) | 期望表现 (Expected - Discourse) | 当前表现 (Actual - Local)     | 差异 (Gap)  | 修复建议 (Action)                                         |
| :--------------- | :------------- | :------------------------------ | :---------------------------- | :---------- | :-------------------------------------------------------- |
| **Post Content** | Font Size      | **18.38px** (approx)            | **18px**                      | -0.38px     | 忽略 (可视差异极小)                                       |
| **Post Content** | Line Height    | **27.57px** (1.5)               | **29.25px** (1.625)           | +1.68px     | `leading-relaxed` -> `leading-[1.5]` 或自定义 `leading-7` |
| **Post Content** | Color          | **#DDDDDD** (rgb 221,221,221)   | **#DADADA** (rgb 218,218,218) | Minor       | 忽略 (非常接近)                                           |
| **Suggested**    | Header Font    | **18.72px / 700(Bold)**         | **15px / 500(Medium)**        | **Big Gap** | `text-[15px] font-medium` -> `text-[19px] font-bold`      |
| **Suggested**    | Header Color   | **#DDDDDD** (rgb 221,221,221)   | **#919191** (rgb 145,145,145) | **Visible** | `text-[#919191]` -> `text-[#DDDDDD]`                      |
| **Suggested**    | Border         | **0px** (No Border)             | **1px Solid #E9E9E9**         | Removes     | Remove `border-b` from header                             |

### 2.4 组件深度审计 (Deep Component Audit)

#### A. Category Badge ('media')

- **Target**: Flex 布局, Text (`#919191`), Font `14px`.
- **Reference**: Square Color Block + Text (`#BABABA`), Font `13.9px`.
- **Gap**:
  - Target 缺少颜色方块指示器 (Color Square).
  - Target 文字颜色过深 (`#919191` vs `#BABABA`).

#### B. Action Buttons (Reply/Like)

- **Gap**:
  - **Padding**: Target `8px 12px` vs Reference `9.2px 11.9px`. (接近，可接受)
  - **Color**: Target `#646464` vs Reference `#A6A6A6`. Target 颜色过深，对比度不足。
  - **Suggestion**: 调整按钮文字/图标颜色为 `#A6A6A6` (text-neutral-400)。

## 3. Pixel-Perfect 修复计划 (Fix Plan)

1.  **Suggested Topics 重构**:
    - [ ] 字体增大至 `text-[19px]`，字重加粗 (`font-bold`).
    - [ ] 颜色提亮至 `#DDDDDD` (匹配暗色模式主标题).
    - [ ] 移除表头下方边框 (`border-b`).
2.  **帖子排版微调**:
    - [ ] 行高收紧: `leading-relaxed` (1.625) -> `leading-[1.5]` (27px).
3.  **按钮颜色修正**:
    - [ ] Reply/Like 按钮颜色由 `#646464` -> `#A6A6A6`.
4.  **Category Badge**:
    - [ ] 增加颜色方块 (如 Discourse 的蓝色小方块).
    - [ ] 调整文字颜色变浅.
