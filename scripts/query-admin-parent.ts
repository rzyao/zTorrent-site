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

    // 查询 admin 路由的父节点
    const parentId = "796378453871038464";
    log("查询 ID = " + parentId + " 的路由...\n");

    const result = await client.query(
      `
      SELECT * FROM routes WHERE id = $1;
    `,
      [parentId],
    );

    if (result.rows.length > 0) {
      const row = result.rows[0];
      log("找到路由:");
      for (const [k, v] of Object.entries(row)) {
        log("  " + k + ": " + v);
      }
    } else {
      log("未找到该路由！这可能是一个孤儿引用。");
    }

    // 查询所有 layout = 'admin' 的路由
    log("\n查询所有 layout = 'admin' 的路由...");
    const adminLayouts = await client.query(`
      SELECT id, path, name, layout, parent_id FROM routes WHERE layout = 'admin';
    `);
    log("结果 (" + adminLayouts.rows.length + " 条):");
    for (const r of adminLayouts.rows) {
      log(
        "  " +
          r.id +
          " | " +
          r.path +
          " | " +
          r.name +
          " | layout: " +
          r.layout +
          " | parent: " +
          r.parent_id,
      );
    }

    // 写入文件
    fs.writeFileSync("scripts/admin-parent-result.txt", output.join("\n"), "utf-8");
    log("\n结果已写入 scripts/admin-parent-result.txt");
  } catch (error: any) {
    console.error("错误:", error.message);
  } finally {
    await client.end();
  }
}

main();
