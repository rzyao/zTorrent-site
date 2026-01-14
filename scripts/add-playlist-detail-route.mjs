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

  // 1. 查询片单相关路由
  const playlistRoutes = await client.query(
    "SELECT id, parent_id, name, path, component, layout, sort_order FROM routes WHERE name LIKE '%片单%' OR path LIKE '%playlist%' ORDER BY id"
  );
  
  console.log('\n📋 现有片单相关路由：');
  for (const row of playlistRoutes.rows) {
    console.log(`  [${row.id}] ${row.name} | path: ${row.path} | component: ${row.component} | layout: ${row.layout} | parent: ${row.parent_id}`);
  }

  // 2. 找到片单列表的路由或 app 布局的父级
  let parentRoute = playlistRoutes.rows.find(r => r.component === 'PlaylistsPage');
  
  // 如果没有找到片单列表，查找 app 布局的根路由
  if (!parentRoute) {
    const appRoute = await client.query(
      "SELECT id, parent_id, name, path FROM routes WHERE layout = 'app' AND (parent_id IS NULL OR path = 'app' OR path = '/app') LIMIT 1"
    );
    if (appRoute.rows.length > 0) {
      parentRoute = appRoute.rows[0];
      console.log(`\n📌 使用 app 布局根路由作为父级: ID=${parentRoute.id}, path=${parentRoute.path}`);
    }
  } else {
    console.log(`\n📌 片单列表路由: ID=${parentRoute.id}, parent_id=${parentRoute.parent_id}`);
  }

  if (!parentRoute) {
    console.log('\n❌ 未找到合适的父路由');
    await client.end();
    return;
  }

  // 3. 检查是否已存在片单详情路由
  const existingDetail = await client.query(
    "SELECT id FROM routes WHERE component = 'PlaylistDetailPage'"
  );

  if (existingDetail.rows.length > 0) {
    console.log('\n⚠️ 片单详情路由已存在，跳过创建');
    await client.end();
    return;
  }

  // 4. 生成新的 route_key (使用时间戳)
  const routeKey = `playlist_detail_${Date.now()}`;

  // 5. 使用正确的父级 ID（如果找到的是列表页，则使用其父级作为兄弟节点的父级）
  const targetParentId = parentRoute.parent_id || parentRoute.id;

  // 6. 插入片单详情路由
  const insertResult = await client.query(`
    INSERT INTO routes (
      route_key, path, component, layout, name, parent_id, redirect, 
      sort_order, is_visible, is_enabled, is_index, open_in_new_tab, icon,
      created_at, updated_at
    ) VALUES (
      $1, 'playlist/:id', 'PlaylistDetailPage', 'app', '片单详情', $2, '',
      99, false, true, false, false, NULL,
      NOW(), NOW()
    ) RETURNING id
  `, [routeKey, targetParentId]);

  console.log(`\n✅ 已创建片单详情路由，ID: ${insertResult.rows[0].id}`);
  console.log('   - 路径: playlist/:id');
  console.log('   - 组件: PlaylistDetailPage');
  console.log('   - 布局: app');
  console.log('   - is_visible: false (不在菜单中显示)');
  console.log(`   - parent_id: ${targetParentId}`);

  await client.end();
  console.log('\n🔌 数据库连接已关闭');
}

main();
