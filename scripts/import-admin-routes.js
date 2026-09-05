/**
 * Admin 路由批量导入脚本
 * 使用方式: 
 *   $env:ACCESS_TOKEN = "your-token"
 *   node scripts/import-admin-routes.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// 配置
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:48230";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";

// 读取路由配置
const routesPath = path.join(__dirname, "../docs/admin-routes-import.json");
const routesData = JSON.parse(fs.readFileSync(routesPath, "utf8"));

/**
 * 发送 HTTP 请求
 */
function request(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, API_BASE_URL);
    const isHttps = url.protocol === "https:";
    const lib = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * 主函数
 */
async function main() {
  console.log("=".repeat(50));
  console.log("Admin 路由批量导入脚本");
  console.log("=".repeat(50));
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Token: ${ACCESS_TOKEN ? "已设置" : "未设置"}`);
  console.log("");

  if (!ACCESS_TOKEN) {
    console.error("❌ 错误: 请设置 ACCESS_TOKEN 环境变量");
    console.log("示例: $env:ACCESS_TOKEN='your-token'; node scripts/import-admin-routes.js");
    process.exit(1);
  }

  // 使用批量导入 API: POST /routes/import
  console.log("正在调用批量导入接口 /routes/import ...\n");

  try {
    const res = await request("POST", "/routes/import", routesData);
    
    if (res.status >= 400) {
      console.error(`❌ 导入失败: ${res.data?.message || res.status}`);
      console.error("响应:", JSON.stringify(res.data, null, 2));
      process.exit(1);
    }
    
    console.log("✅ 导入成功!");
    console.log("响应:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(`❌ 请求失败: ${err.message}`);
    process.exit(1);
  }

  console.log("\n" + "=".repeat(50));
  console.log("完成!");
  console.log("=".repeat(50));
}

main().catch(console.error);
