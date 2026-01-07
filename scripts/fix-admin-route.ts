/**
 * 修复 Admin 路由的 parent_id
 * 将 Admin 根路由的 parent_id 设为 null，使其成为真正的根节点
 */
import { Client } from "pg";

async function main() {
  const client = new Client({
    host: "192.168.50.2",
    port: 5432,
    user: "ztorrent",
    password: "TMYBKC47Jm8w4SB7",
    database: "ztorrent",
  });

  try {
    await client.connect();
    console.log("数据库连接成功\n");

    // 1. 查询当前 Admin 路由状态
    console.log("1. 查询当前 Admin 路由状态...");
    const before = await client.query(`
      SELECT id, path, name, layout, parent_id 
      FROM routes 
      WHERE path = 'admin' AND layout = 'admin';
    `);

    if (before.rows.length === 0) {
      console.log("未找到 Admin 路由！");
      return;
    }

    const adminRoute = before.rows[0];
    console.log("当前 Admin 路由:");
    console.log("  ID:", adminRoute.id);
    console.log("  Path:", adminRoute.path);
    console.log("  Layout:", adminRoute.layout);
    console.log("  Parent ID:", adminRoute.parent_id);

    if (adminRoute.parent_id === null) {
      console.log("\n✅ Admin 路由的 parent_id 已经是 null，无需修复。");
      return;
    }

    // 2. 修复：将 parent_id 设为 null
    console.log("\n2. 修复：将 Admin 路由的 parent_id 设为 null...");
    await client.query(
      `
      UPDATE routes 
      SET parent_id = NULL, updated_at = NOW() 
      WHERE id = $1;
    `,
      [adminRoute.id],
    );
    console.log("✅ 已更新 Admin 路由的 parent_id 为 null");

    // 3. 验证修复结果
    console.log("\n3. 验证修复结果...");
    const after = await client.query(
      `
      SELECT id, path, name, layout, parent_id 
      FROM routes 
      WHERE id = $1;
    `,
      [adminRoute.id],
    );

    console.log("修复后 Admin 路由:");
    console.log("  Parent ID:", after.rows[0].parent_id);

    // 4. 显示所有根节点
    console.log("\n4. 当前所有根节点:");
    const roots = await client.query(`
      SELECT id, path, name, layout 
      FROM routes 
      WHERE parent_id IS NULL 
      ORDER BY id;
    `);
    for (const r of roots.rows) {
      console.log("  - [" + r.layout + "] " + r.path + " | " + r.name);
    }

    console.log("\n✅ 修复完成！请刷新前端页面验证 Admin 导航是否正常显示。");
  } catch (error: any) {
    console.error("错误:", error.message);
  } finally {
    await client.end();
    console.log("\n数据库连接已关闭");
  }
}

main();
