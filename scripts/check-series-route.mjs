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

  // 查询 series 相关路由（app 布局）
  const result = await client.query(`
    SELECT id, path, component, layout, parent_id, is_enabled
    FROM routes 
    WHERE (path LIKE '%series%' OR component LIKE '%Series%') AND layout = 'app'
    ORDER BY id
  `);

  console.log('\n📋 Series 相关 App 路由：');
  for (const row of result.rows) {
    console.log(`  [${row.id}] path: ${row.path} | component: ${row.component} | parent: ${row.parent_id} | enabled: ${row.is_enabled}`);
  }

  // 检查是否存在 series/:id 路由
  const detailRoute = await client.query(`
    SELECT id, path, component, parent_id, is_enabled
    FROM routes 
    WHERE component = 'SeriesDetailPage' OR path = 'series/:id'
  `);

  console.log('\n📋 SeriesDetail 路由：');
  for (const row of detailRoute.rows) {
    console.log(`  [${row.id}] path: ${row.path} | component: ${row.component} | parent: ${row.parent_id} | enabled: ${row.is_enabled}`);
  }

  await client.end();
}

main();
