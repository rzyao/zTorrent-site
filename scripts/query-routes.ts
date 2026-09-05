/**
 * 查询数据库中的路由配置
 * 用于验证 import-routes.ts 是否正确存储了数据
 */
import axios from "axios";

async function main() {
  const BASE_URL = "http://localhost:48230";

  console.log("========================================");
  console.log("查询数据库中的路由配置...");
  console.log("========================================\n");

  try {
    // 1. 尝试从环境变量获取 token，或者使用登录
    let token = process.env.ACCESS_TOKEN || "";

    if (!token) {
      console.log("1. 尝试登录获取 token...");
      console.log("   提示: 可以设置环境变量 ACCESS_TOKEN 跳过登录");
      const loginResp = await axios.post(`${BASE_URL}/auth/login`, {
        username: process.env.ADMIN_USER || "admin",
        password: process.env.ADMIN_PASS || "admin123",
      });

      token = loginResp.data?.data?.accessToken || loginResp.data?.accessToken;
      if (!token) {
        console.log("登录响应:", JSON.stringify(loginResp.data, null, 2));
        console.error("无法获取 token，请设置环境变量 ACCESS_TOKEN 或 ADMIN_USER/ADMIN_PASS");
        return;
      }
      console.log("✅ 登录成功，获取到 token\n");
    } else {
      console.log("1. 使用环境变量中的 ACCESS_TOKEN\n");
    }

    // 2. 查询完整路由树（Admin API）
    console.log("2. 查询完整路由树 (POST /admin/routes/tree)...");
    const treeResp = await axios.post(
      `${BASE_URL}/admin/routes/tree`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    console.log("\n========== 完整路由树 ==========");
    console.log(JSON.stringify(treeResp.data, null, 2));

    // 3. 分析路由树结构
    const routes = treeResp.data?.data || [];
    const routeList = Array.isArray(routes) ? routes : [routes];

    console.log("\n========== 路由统计 ==========");
    console.log(`根节点数量: ${routeList.length}`);

    for (const route of routeList) {
      const layout = route.layout || "无";
      const path = route.path || "无";
      const childCount = route.children?.length || 0;
      console.log(`- [${layout}] ${path} (${childCount} 个子路由)`);
    }

    // 4. 检查是否存在 admin 布局的路由
    const adminRoute = routeList.find((r: any) => r.layout === "admin" || r.path === "admin");
    console.log("\n========== Admin 路由检查 ==========");
    if (adminRoute) {
      console.log("✅ 找到 Admin 路由:");
      console.log(`   - ID: ${adminRoute.id}`);
      console.log(`   - Path: ${adminRoute.path}`);
      console.log(`   - Layout: ${adminRoute.layout}`);
      console.log(`   - Component: ${adminRoute.component}`);
      console.log(`   - Children: ${adminRoute.children?.length || 0} 个`);
    } else {
      console.log("❌ 未找到 Admin 路由！");
      console.log("   这可能是导入脚本的问题，或者后端存储逻辑有问题。");
    }

    // 5. 查询用户路由（模拟前端请求）
    console.log("\n3. 查询用户路由 (POST /routes/user)...");
    const userRoutesResp = await axios.post(
      `${BASE_URL}/routes/user`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    console.log("\n========== 用户路由 ==========");
    console.log(JSON.stringify(userRoutesResp.data, null, 2));

    const userRoutes = userRoutesResp.data?.data?.routes || [];
    console.log(`\n用户可见路由数量: ${userRoutes.length}`);

    const userAdminRoute = userRoutes.find((r: any) => r.layout === "admin" || r.path === "admin");
    if (userAdminRoute) {
      console.log("✅ 用户路由中包含 Admin");
    } else {
      console.log("❌ 用户路由中不包含 Admin！");
      console.log("   可能是权限过滤问题或后端返回逻辑问题。");
    }
  } catch (error: any) {
    console.error("========================================");
    console.error("查询失败！");
    if (error.response) {
      console.error("状态码:", error.response.status);
      console.error("错误信息:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("错误:", error.message);
    }
    console.error("========================================");
  }
}

main();
