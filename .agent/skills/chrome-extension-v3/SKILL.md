---
name: chrome-extension-v3
description: Chrome 扩展程序 (Manifest V3) 开发专家指南，包含项目结构、核心概念与最佳实践。
---

# Chrome Extension Developer Guide (Manifest V3)

本技能旨在辅助开发者高效构建符合 Manifest V3 规范的 Chrome 扩展程序。

## 1. 核心规范与变更 (Manifest V3 vs V2)

### 1.1 Service Workers 替代 Background Pages

- **变更**: V3 使用 Service Workers 作为后台脚本。它们是**短生命周期**的，按需启动，空闲时终止。
- **影响**:
  - 无法依赖全局变量存储持久状态（使用 `chrome.storage`）。
  - 无法使用 DOM API（如 `window`、`document`）。
  - 所有的监听器必须同步注册。

### 1.2 网络请求 (Network Requests)

- **变更**: `webRequest` API 的阻塞能力受限，推荐使用 `declarativeNetRequest`。
- **用途**: 拦截、修改或阻止网络请求需预先定义规则。

### 1.3 远程代码执行 (Remote Code Execution)

- **变更**: 禁止执行远程托管的代码（如 CDN 上的 JS）。所有逻辑必须包含在扩展包内。

## 2. 标准项目结构 (Project Structure)

推荐采用以下目录结构以保持清晰和可维护性：

```text
/
├── manifest.json        # 核心配置文件
├── _locales/            # 多语言支持 (i18n)
│   ├── en/
│   │   └── messages.json
│   └── zh_CN/
│       └── messages.json
├── icons/               # 图标 (16, 32, 48, 128)
├── src/
│   ├── background/      # Service Worker 逻辑
│   │   └── service-worker.js
│   ├── content/         # 内容脚本 (注入页面)
│   │   ├── content.js
│   │   └── content.css
│   ├── popup/           # 点击图标弹出的页面
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   ├── options/         # 选项/设置页面
│   │   ├── options.html
│   │   ├── options.js
│   │   └── options.css
│   └── lib/             # 共享工具库
└── assets/              # 静态资源
```

## 3. Manifest.json 模板

这是 Manifest V3 的基本模板：

```json
{
  "manifest_version": 3,
  "name": "__MSG_appName__",
  "version": "1.0.0",
  "description": "__MSG_appDesc__",
  "default_locale": "zh_CN",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "src/popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png"
    }
  },
  "background": {
    "service_worker": "src/background/service-worker.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/content.js"],
      "css": ["src/content/content.css"],
      "run_at": "document_idle"
    }
  ],
  "permissions": ["storage", "tabs", "scripting"],
  "host_permissions": ["*://*.example.com/*"]
}
```

## 4. 关键开发模式 (Patterns)

### 4.1 消息通信 (Messaging)

#### 4.1.1 发送单次消息 (Popup/Content -> Background)

**发送端**:

```javascript
chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }
  console.log("收到回复:", response);
});
```

**接收端 (Background)**:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    // 异步操作需返回 true
    someAsyncOperation().then((data) => sendResponse({ data }));
    return true;
  }
});
```

#### 4.1.2 发送消息到 Content Script (Background -> Tab)

```javascript
// 获取当前标签页
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]?.id) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" });
  }
});
```

### 4.2 数据存储 (Storage)

使用 `chrome.storage.local` 或 `chrome.storage.sync`。

```javascript
// 保存
chrome.storage.local.set({ key: "value" }).then(() => {
  console.log("Value is set");
});

// 读取
chrome.storage.local.get(["key"]).then((result) => {
  console.log("Value is " + result.key);
});
```

### 4.3 脚本注入 (Scripting)

动态注入代码到页面（需 `scripting` 权限）。

```javascript
chrome.scripting.executeScript({
  target: { tabId: tabId },
  function: () => {
    document.body.style.backgroundColor = "red";
  },
});
```

## 5. 常见问题排查 checklist

- [ ] **Service Worker 停止工作**: 检查是否使用了全局变量保存状态。改用 `storage`。
- [ ] **DOM 访问报错**: Service Worker 中无法访问 window/document。需通过消息传递委托 Content Script 处理。
- [ ] **Content Security Policy (CSP)**: V3 对内联脚本限制严格，检查控制台报错。
- [ ] **跨域请求**: Background Service Worker 默认不带 Cookie，若需凭证需配置 fetch 选项或 `host_permissions`。

## 6. 发布前检查

1. 移除 `console.log` 等调试代码。
2. 确保 `manifest.json` 中仅申请了必要的权限 (Permissions)，否则审核会变慢。
3. 准备好详细的隐私政策。
