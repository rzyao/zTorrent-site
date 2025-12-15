---
description: 根据后端接口对接文档开发用户端页面
---

# 用户端页面开发工作流

此工作流用于**用户端前端开发**，根据后端提供的接口对接文档 (`docs/api-handoff/*.md`)，生成符合现代 Web 标准的用户端页面。

## 技术栈

- **框架**: React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **组件库**: Radix UI Primitives
- **状态管理**: Zustand / React Context
- **数据请求**: TanStack Query (React Query)
- **路由**: React Router v6

---

## 执行步骤

### 1. 读取接口对接文档

// turbo
使用 `view_file` 读取 `docs/api-handoff/` 下的目标文档。

**关键信息提取**:

- 接口路径和请求方法
- 请求参数结构 (Request DTO)
- 响应数据结构 (Response Data)
- 错误码和异常处理

### 2. 查阅 OpenAPI 生成代码

**优先使用 OpenAPI 生成的代码**，而非手动定义类型。

- 确认前端项目中是否已通过 `openapi-generator` 或类似工具生成了 API 代码（通常在 `src/api` 或 `src/services`）。
- 查找对接文档中对应的 Service 类和 Model 接口。

**示例**:

```typescript
// src/api/models/RecommendationItem.ts (自动生成)
export type RecommendationItem = {
  id: number;
  title: string;
  // ...
};
```

### 3. 封装请求 Hooks

基于生成的 Service 封装 TanStack Query hooks。

**示例**:

```typescript
// src/hooks/useRecommendations.ts
import { useQuery } from "@tanstack/react-query";
import { RecommendationsService } from "@/api/services/RecommendationsService";
import type { GetRecommendationsRequest } from "@/api/models";

export function useRecommendations(params: GetRecommendationsRequest) {
  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () => RecommendationsService.postApiRecommendationsList(params),
  });
}
```

### 4. 设计页面布局

根据业务需求设计页面结构。

**用户端页面特点**:

- **响应式设计**: 使用 Tailwind 的响应式工具类 (`sm:`, `md:`, `lg:`)
- **视觉吸引力**: 使用渐变、阴影、动画效果
- **交互反馈**: Hover 状态、加载动画、骨架屏

**布局建议**:

```tsx
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-6">推荐内容</h1>

  {/* 加载状态 */}
  {isLoading && <SkeletonGrid />}

  {/* 数据展示 */}
  {data && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.list.map((item) => (
        <RecommendationCard key={item.id} item={item} />
      ))}
    </div>
  )}

  {/* 分页 */}
  <Pagination total={data?.total} />
</div>
```

### 5. 实现组件

使用 Radix UI Primitives 构建可访问性强的组件。

**示例 - 卡片组件**:

```tsx
// src/components/RecommendationCard.tsx
import * as HoverCard from "@radix-ui/react-hover-card";
import type { RecommendationItem } from "@/types/recommendation";

interface Props {
  item: RecommendationItem;
}

export function RecommendationCard({ item }: Props) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl">
          <img
            src={item.coverUrl}
            alt={item.title}
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.createdAt}</p>
          </div>
        </div>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content className="rounded-md bg-white p-4 shadow-lg">
          {/* 悬浮卡片内容 */}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
```

### 6. 错误处理和加载状态

**统一错误处理**:

```typescript
// src/lib/api-client.ts
import axios from "axios";
import { toast } from "sonner";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data;

    if (code !== 1000) {
      // 业务异常，展示 message
      toast.error(message);
      throw new Error(message);
    }

    return { ...response, data };
  },
  (error) => {
    // 系统异常
    const message = error.response?.data?.data?.message || "系统错误";
    toast.error(message);
    throw error;
  }
);
```

**加载状态组件**:

```tsx
// src/components/SkeletonGrid.tsx
export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

### 7. 性能优化

- **懒加载**: 使用 `React.lazy()` 和 `Suspense`
- **虚拟滚动**: 对于长列表使用 `@tanstack/react-virtual`
- **图片优化**: 使用 `loading="lazy"` 和适当的图片格式

---

## 使用示例

```
/frontend-user docs/api-handoff/2025-12-15_首页推荐功能.md
```

或者：

> "根据首页推荐功能的接口文档，帮我开发用户端页面"

---

## 关键检查点

- [ ] TypeScript 类型是否与接口文档一致？
- [ ] 是否使用了 TanStack Query 进行数据请求？
- [ ] 是否实现了加载状态和错误处理？
- [ ] 是否使用 Tailwind CSS 实现响应式布局？
- [ ] 是否使用 Radix UI 确保可访问性？
- [ ] 组件是否遵循 React 19 最佳实践？
