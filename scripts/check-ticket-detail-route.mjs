import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: '192.168.50.2',
  port: 5432,
  user: 'ztorrent',
  password: 'TMYBKC47Jm8w4SB7',
  database: 'ztorrent',
});

async function main() {
  await client.connect();
  console.log('✅ 已连接到数据库');

  // 查询工单详情路由的完整信息
  const result = await client.query(
    "SELECT * FROM routes WHERE component = 'TicketDetailPage'"
  );
  
  if (result.rows.length > 0) {
    console.log('\n📋 工单详情路由配置：');
    console.log(JSON.stringify(result.rows[0], null, 2));
  } else {
    console.log('\n❌ 未找到工单详情路由');
  }

  // 查询父级路由
  if (result.rows.length > 0 && result.rows[0].parent_id) {
    const parent = await client.query(
      "SELECT id, name, path FROM routes WHERE id = $1",
      [result.rows[0].parent_id]
    );
    if (parent.rows.length > 0) {
      console.log('\n📌 父级路由：');
      console.log(JSON.stringify(parent.rows[0], null, 2));
    }
  }

  await client.end();
}

main();
