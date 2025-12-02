## 目标
- 优先使用后端配置 `site.logo.svg`（SVG 标签字符串）作为浏览器标签页图标（favicon）。
- 当存在 `site.logo.svg` 时，标签标题的“logo”部分不再拼接 URL，改为依靠 favicon 呈现品牌；否则按原规范 `{site.logo.url} {site.title} {页面名} {架构信息}` 组合。
- 所有变量依旧从系统配置接口（SettingsService，group: `site`）读取。

## 数据来源
- `site.logo.svg`: SVG 标签字符串（如 `<svg ...>...</svg>`）。
- `site.logo.url`: Logo 图片 URL（PNG/JPG 等）。
- `site.title`: 站点标题。
- `site.arch`/`site.architecture`: 架构信息。

## 技术实现
- 扩展 `SiteConfigContext`：新增 `logoSvg: string` 字段，从 `SettingsService.settingsControllerListSettingsByGroup({ group: 'site' })` 读取并提供给全局。
- 新增 Hook `useDynamicFavicon()`：
  - 若 `logoSvg` 存在：创建 `Blob`(type: `image/svg+xml`)，生成 `blob:` URL，注入/更新 `<link rel="icon" type="image/svg+xml" href="...">`。
  - 否则若 `logoUrl` 存在：注入/更新 `<link rel="icon" type="image/png" href="...">`（mime 按实际扩展名可选）。
  - 清理旧的 `blob:` URL 以避免内存泄漏。
- 调整标题组合：
  - 在 `composeTitle` 中加入逻辑：有 `logoSvg` 时忽略 `logoUrl` 字段；无 `logoSvg` 时保留现有组合。
- 注入位置：在 `AppLayout` 顶层调用一次 `useDynamicFavicon()`，使全站 favicon 动态生效；页面仍通过 `useDynamicTitle('页面名')` 设置标题。

## 验证方案
- 本地启动后：
  - 当后端返回有效 `site.logo.svg`：浏览器标签图标显示为 SVG；标题形如：`站点标题 页面名 架构信息`（无 URL）。
  - 当仅有 `site.logo.url`：图标显示为该图片；标题形如：`logoURL 站点标题 页面名 架构信息`。
  - 当两者皆空：保留 `index.html` 的静态 favicon 与标题。

## 风险与回退
- 后端 `logoSvg` 非法或包含外链资源时，注入失败则自动回退到 `logoUrl` 或静态 favicon。
- 频繁切换配置时，`blob:` URL 需释放；在 Hook 中统一销毁旧 URL。

## 后续可选增强
- 支持独立键 `site.favicon.url`，与 logo 解耦；根据扩展名动态设置 `type`。
- 为 `composeTitle` 支持分隔符定制（例如使用 `·` 或 `—`）。