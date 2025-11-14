# API 集成指南

本项目使用 OpenAPI 自动生成 API 客户端代码，基于 Swagger 文档 (http://localhost:8890/api-docs-json)。

## 📦 安装依赖

项目已经自动安装了以下依赖：
- `@hey-api/openapi-ts` - OpenAPI 代码生成器
- `openapi-typescript` - TypeScript 类型生成
- `axios` - HTTP 客户端

## 🔧 生成 API 代码

### 使用本地 OpenAPI 文件
```bash
npm run api:generate
```

### 使用实时 Swagger 文档
```bash
npm run api:generate:live
```

## 📁 生成的文件结构

```
src/api/
├── client/           # 客户端配置
├── core/             # 核心功能
├── client.gen.ts     # 客户端实例
├── sdk.gen.ts        # API SDK
├── types.gen.ts      # TypeScript 类型
└── index.ts          # 导出文件
```

## 🚀 使用方法

### 1. 基础导入
```typescript
import { AuthService, TorrentService } from './api/services';
import { useAuth, useTorrents } from './hooks/useApi';
```

### 2. 认证服务
```typescript
// 登录
const response = await AuthService.login('user@example.com', 'password');

// 检查认证状态
const isAuthenticated = AuthService.isAuthenticated();

// 登出
AuthService.logout();
```

### 3. 种子服务
```typescript
// 获取种子列表
const torrents = await TorrentService.getTorrents('电影', 1, 20);

// 获取种子详情
const torrent = await TorrentService.getTorrentById(123);
```

### 4. React Hook (推荐)
```typescript
// 在组件中使用 Hook
function MyComponent() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const { fetchTorrents, torrents, isLoading, error } = useTorrents();

  // 使用生成的函数...
}
```

## 🔧 配置

### 修改 API 基础地址
编辑 `src/api/client.ts` 文件：
```typescript
export const apiConfig: Config = createConfig({
  baseUrl: 'http://your-api-server.com', // 修改这里
  // ...
});
```

### 添加新的 API 端点
1. 更新 `openapi.json` 文件，添加新的路径定义
2. 运行 `npm run api:generate` 重新生成代码
3. 在 `src/api/services.ts` 中添加对应的服务方法
4. 在 `src/hooks/useApi.ts` 中添加对应的 Hook

## 📝 示例组件

查看 `src/components/ApiExamples.tsx` 获取完整的使用示例。

## 🔄 更新 API

当后端 API 发生变化时：
1. 确保 Swagger 文档已更新 (http://localhost:8890/api-docs-json)
2. 运行 `npm run api:generate:live`
3. 重新编译项目

## 🐛 常见问题

### Swagger 文档无法访问
如果 Swagger 服务未运行，可以使用本地的 `openapi.json` 文件：
```bash
npm run api:generate
```

### 类型错误
确保生成的类型与你的使用方式匹配，必要时可以：
1. 检查 `src/api/types.gen.ts` 中的类型定义
2. 更新 `openapi.json` 中的模式定义
3. 重新生成代码

### 认证失败
检查：
1. Token 是否正确保存到 localStorage
2. API 基础地址是否正确
3. 请求头是否包含 Authorization