/**
 * 直接查询数据库中的路由配置，结果写入文件
 */
import { Client } from "pg";
import * as fs from "fs";

async function main() {
  const client = new Client({
    host: "192.168.50.2",
    port: 5432,
    user: "ztorrent",
    password: "TMYBKC47Jm8w4SB7",
    database: "ztorrent",
  });

  const output: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    output.push(msg);
  };

  try {
    await client.connect();
    log("数据库连接成功\n");

    // 1. 查询表结构
    const cols = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'routes' ORDER BY ordinal_position;
    `);
    log("routes 表字段:");
    for (const r of cols.rows) {
      log("  - " + r.column_name);
    }

    // 2. 查询所有根节点
    const roots = await client.query(`
      SELECT id, path, name, parent_id FROM routes WHERE parent_id IS NULL ORDER BY id;
    `);
    log("\n根节点 (" + roots.rows.length + " 条):");
    for (const r of roots.rows) {
      log("  " + r.id + " | " + r.path + " | " + r.name);
    }

    // 3. 查询 admin 相关路由
    const admins = await client.query(`
      SELECT id, path, name, parent_id FROM routes WHERE path LIKE '%admin%' ORDER BY id;
    `);
    log("\nadmin 相关路由 (" + admins.rows.length + " 条):");
    for (const r of admins.rows) {
      log("  " + r.id + " | " + r.path + " | " + r.name + " | parent: " + r.parent_id);
    }

    // 4. 查询所有路由数量
    const count = await client.query(`SELECT COUNT(*) as total FROM routes;`);
    log("\n总路由数量: " + count.rows[0].total);

    // 5. 查询所有路由的简要信息
    const all = await client.query(`
      SELECT id, path, name, parent_id, component, layout FROM routes ORDER BY id LIMIT 200;
    `);
    log("\n所有路由 (前 200 条):");
    for (const r of all.rows) {
      log(
        "  " +
          r.path.padEnd(20) +
          " | " +
          r.name.padEnd(15) +
          " | layout: " +
          (r.layout || "none").padEnd(8) +
          " | comp: " +
          (r.component || "null").padEnd(25) +
          " | parent: " +
          r.parent_id,
      );
    }
  } catch (error: any) {
    log("错误: " + error.message);
  } finally {
    await client.end();
    log("\n数据库连接已关闭");

    // 写入文件
    fs.writeFileSync("scripts/db-routes-result.txt", output.join("\n"), "utf-8");
    console.log("\n结果已写入 scripts/db-routes-result.txt");
  }
}

main();
