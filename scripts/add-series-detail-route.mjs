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

  // 检查是否存在 series/:id 路由
  const detailRoute = await client.query(`
    SELECT id, path, component, parent_id, is_enabled, layout
    FROM routes 
    WHERE component = 'SeriesDetailPage'
  `);

  if (detailRoute.rows.length === 0) {
    console.log('❌ 未找到 SeriesDetailPage 路由，需要创建');
    
    // 查找 app 父级
    const appRoute = await client.query(`SELECT id FROM routes WHERE path = 'app' LIMIT 1`);
    const parentId = appRoute.rows[0]?.id;
    
    if (parentId) {
      const routeKey = `series_detail_${Date.now()}`;
      await client.query(`
        INSERT INTO routes (
          route_key, path, component, layout, name, parent_id,
          sort_order, is_visible, is_enabled, is_index, open_in_new_tab,
          created_at, updated_at
        ) VALUES (
          $1, 'series/:id', 'SeriesDetailPage', 'app', '剧集详情', $2,
          99, false, true, false, false,
          NOW(), NOW()
        ) RETURNING id
      `, [routeKey, parentId]);
      console.log('✅ 已创建 series/:id 路由');
    }
  } else {
    console.log('✅ SeriesDetailPage 路由已存在:');
    console.log(detailRoute.rows[0]);
  }

  await client.end();
}

main();
