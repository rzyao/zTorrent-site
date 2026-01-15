import pg from "pg";
const { Client } = pg;

const config = {
  host: "192.168.50.2",
  port: 5432,
  user: "ztorrent",
  password: "TMYBKC47Jm8w4SB7",
  database: "ztorrent",
};

async function main() {
  const sql = process.argv[2];
  if (!sql) {
    console.error("请提供 SQL 语句作为参数。");
    process.exit(1);
  }

  const client = new Client(config);
  try {
    await client.connect();
    const res = await client.query(sql);

    if (res.command === "SELECT") {
      console.table(res.rows);
    } else {
      console.log(`执行成功: ${res.command}`);
      if (res.rowCount !== null) {
        console.log(`受影响行数: ${res.rowCount}`);
      }
    }
  } catch (err: any) {
    console.error("数据库错误:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
