# Loading 提示方案对比

## 方案概览

| 方案                            | 适用场景             | 复杂度 | 灵活性     | 学习成本 |
| ------------------------------- | -------------------- | ------ | ---------- | -------- |
| 1. 自定义 Hook (useAsyncAction) | 按需使用，细粒度控制 | ⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐       |
| 2. React Query / TanStack Query | 数据获取、缓存、同步 | ⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐⭐   |
| 3. Axios 拦截器 + 配置          | 全局统一，可选退出   | ⭐⭐   | ⭐⭐⭐     | ⭐⭐     |
| 4. 手动管理状态                 | 完全自定义           | ⭐     | ⭐⭐⭐⭐⭐ | ⭐       |
| 5. Context + Provider           | 跨组件共享 loading   | ⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐     |

---

## 方案 1: 自定义 Hook (useAsyncAction) ⭐ 推荐

### 优点

✅ **按需使用** - 只在需要的地方使用，不影响其他请求  
✅ **零配置** - 开箱即用，无需全局配置  
✅ **灵活性高** - 每个操作可以自定义提示消息  
✅ **类型安全** - 完整的 TypeScript 支持  
✅ **易于理解** - 代码简单直观  
✅ **无依赖** - 不需要额外的库

### 缺点

❌ 需要在每个组件中单独使用  
❌ 不提供缓存、重试等高级功能

### 代码示例

```tsx
const { execute, loading } = useAsyncAction({
  successMessage: "保存成功",
  loadingMessage: "正在保存...",
});

const handleSave = async () => {
  await execute(async () => {
    await UsersService.save(data);
  });
};
```

### 适用场景

- ✅ 表单提交
- ✅ 删除操作
- ✅ 更新操作
- ✅ 需要自定义提示的场景
- ✅ 不需要缓存的一次性操作

---

## 方案 2: React Query (TanStack Query)

### 优点

✅ **自动缓存** - 智能缓存管理  
✅ **自动重试** - 失败自动重试  
✅ **自动刷新** - 窗口聚焦时自动刷新  
✅ **乐观更新** - 提升用户体验  
✅ **并发请求去重** - 自动合并相同请求  
✅ **分页支持** - 内置分页逻辑  
✅ **成熟稳定** - 社区活跃，文档完善

### 缺点

❌ 学习曲线较陡  
❌ 需要额外依赖  
❌ 配置相对复杂  
❌ 可能过度设计（对于简单场景）

### 代码示例

```tsx
// 数据查询
const { data, isLoading, error } = useQuery({
  queryKey: ["movies"],
  queryFn: () => MoviesService.list(),
});

// 数据变更
const mutation = useMutation({
  mutationFn: (data) => UsersService.save(data),
  onSuccess: () => {
    toast.success("保存成功");
    queryClient.invalidateQueries(["movies"]);
  },
  onError: () => {
    toast.error("保存失败");
  },
});

const handleSave = () => {
  mutation.mutate(formData);
};
```

### 适用场景

- ✅ 数据获取和展示
- ✅ 需要缓存的场景
- ✅ 需要自动刷新的数据
- ✅ 复杂的数据同步需求
- ✅ 列表、详情页等数据密集型页面

### 当前项目中的使用

你的项目已经在使用 React Query：

- `useMoviesPage.ts` - 电影列表查询
- `useSeriesPage.ts` - 剧集列表查询
- `useTorrentsList.ts` - 种子列表查询

---

## 方案 3: Axios 拦截器 + 配置

### 优点

✅ **全局统一** - 一次配置，全局生效  
✅ **可选退出** - 通过配置跳过某些请求  
✅ **集中管理** - 统一的错误处理逻辑

### 缺点

❌ 灵活性较低  
❌ 难以自定义单个请求的提示  
❌ 可能影响不需要提示的请求

### 代码示例

```tsx
// axios 配置
axios.interceptors.request.use((config) => {
  // 通过自定义配置跳过 loading
  if (!config.skipLoading) {
    const toastId = toast.loading("加载中...");
    config.metadata = { toastId };
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    const toastId = response.config.metadata?.toastId;
    if (toastId) {
      toast.dismiss(toastId);
      if (response.config.successMessage) {
        toast.success(response.config.successMessage);
      }
    }
    return response;
  },
  (error) => {
    const toastId = error.config?.metadata?.toastId;
    if (toastId) {
      toast.dismiss(toastId);
      toast.error(error.message || "请求失败");
    }
    return Promise.reject(error);
  }
);

// 使用时
await axios.post("/api/save", data, {
  successMessage: "保存成功",
  skipLoading: false, // 显示 loading
});

await axios.get("/api/data", {
  skipLoading: true, // 跳过 loading
});
```

### 适用场景

- ✅ 需要全局统一处理的场景
- ✅ 大部分请求都需要 loading 提示
- ✅ 统一的错误处理策略

---

## 方案 4: 手动管理状态

### 优点

✅ **完全控制** - 100% 自定义  
✅ **无依赖** - 不需要任何库  
✅ **简单直接** - 容易理解

### 缺点

❌ 代码重复  
❌ 容易出错（忘记关闭 loading）  
❌ 维护成本高

### 代码示例

```tsx
const [loading, setLoading] = useState(false);

const handleSave = async () => {
  setLoading(true);
  const toastId = toast.loading("保存中...");

  try {
    await UsersService.save(data);
    toast.dismiss(toastId);
    toast.success("保存成功");
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("保存失败");
  } finally {
    setLoading(false);
  }
};
```

### 适用场景

- ✅ 非常简单的场景
- ✅ 一次性使用
- ❌ 不推荐用于生产环境

---

## 方案 5: Context + Provider

### 优点

✅ **跨组件共享** - 多个组件可以共享 loading 状态  
✅ **集中管理** - 统一的 loading 管理

### 缺点

❌ 配置复杂  
❌ 可能导致不必要的重渲染  
❌ 过度设计

### 代码示例

```tsx
// LoadingContext.tsx
const LoadingContext = createContext({
  showLoading: (message: string) => {},
  hideLoading: () => {},
  showSuccess: (message: string) => {},
  showError: (message: string) => {},
});

export function LoadingProvider({ children }) {
  const [toastId, setToastId] = useState(null);

  const showLoading = (message) => {
    const id = toast.loading(message);
    setToastId(id);
  };

  const hideLoading = () => {
    if (toastId) toast.dismiss(toastId);
  };

  const showSuccess = (message) => {
    hideLoading();
    toast.success(message);
  };

  const showError = (message) => {
    hideLoading();
    toast.error(message);
  };

  return (
    <LoadingContext.Provider
      value={{ showLoading, hideLoading, showSuccess, showError }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

// 使用
const { showLoading, showSuccess, showError } = useContext(LoadingContext);

const handleSave = async () => {
  showLoading("保存中...");
  try {
    await UsersService.save(data);
    showSuccess("保存成功");
  } catch (error) {
    showError("保存失败");
  }
};
```

### 适用场景

- ✅ 需要跨多个组件共享 loading 状态
- ✅ 复杂的嵌套组件结构
- ❌ 大多数场景不需要

---

## 综合对比表

| 特性       | useAsyncAction | React Query | Axios 拦截器 | 手动管理 | Context |
| ---------- | -------------- | ----------- | ------------ | -------- | ------- |
| 按需使用   | ✅             | ✅          | ❌           | ✅       | ✅      |
| 自动缓存   | ❌             | ✅          | ❌           | ❌       | ❌      |
| 自动重试   | ❌             | ✅          | ❌           | ❌       | ❌      |
| 自定义提示 | ✅             | ✅          | ⚠️           | ✅       | ✅      |
| 类型安全   | ✅             | ✅          | ⚠️           | ✅       | ✅      |
| 学习成本   | 低             | 高          | 中           | 低       | 中      |
| 代码量     | 少             | 中          | 少           | 多       | 中      |
| 维护成本   | 低             | 低          | 中           | 高       | 中      |

---

## 推荐方案

### 🎯 针对你的项目

**混合使用策略**：

1. **数据查询** → 使用 **React Query**（已在使用）

   - 电影列表、剧集列表、种子列表等

2. **数据变更** → 使用 **useAsyncAction**

   - 保存设置、删除操作、更新操作等

3. **特殊场景** → 手动管理
   - 需要特殊处理的场景

### 示例：控制面板保存设置

```tsx
// 使用 useAsyncAction
const { execute, loading } = useAsyncAction({
  successMessage: "设置已保存",
  loadingMessage: "正在保存设置...",
  onSuccess: async () => {
    // 刷新全局状态
    await usePreferenceCategoriesStore.getState().fetchCategories();
  },
});

const handleSave = async () => {
  await execute(async () => {
    const UsersService = await getUsersService();
    await UsersService.usersPreferencesControllerSave(body);
  });
};
```

---

## 总结

- **简单场景** → `useAsyncAction` ⭐
- **数据获取** → `React Query` ⭐
- **全局统一** → `Axios 拦截器`
- **完全自定义** → 手动管理
- **跨组件共享** → Context

**最佳实践**：在你的项目中，建议使用 `useAsyncAction` 处理表单提交、删除、更新等操作，继续使用 React Query 处理数据查询。
