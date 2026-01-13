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

  // 1. 查询工单相关路由
  const ticketRoutes = await client.query(
    "SELECT id, parent_id, name, path, component, sort_order FROM routes WHERE name LIKE '%工单%' OR path LIKE '%ticket%' ORDER BY id"
  );
  
  console.log('\n📋 现有工单相关路由：');
  for (const row of ticketRoutes.rows) {
    console.log(`  [${row.id}] ${row.name} | path: ${row.path} | component: ${row.component} | parent: ${row.parent_id}`);
  }

  // 2. 找到工单列表的路由 ID 作为父级
  const ticketListRoute = ticketRoutes.rows.find(r => r.component === 'AdminTicketsPage');
  
  if (!ticketListRoute) {
    console.log('\n❌ 未找到工单列表路由');
    await client.end();
    return;
  }

  console.log(`\n📌 工单列表路由: ID=${ticketListRoute.id}, parent_id=${ticketListRoute.parent_id}`);

  // 3. 检查是否已存在工单详情路由
  const existingDetail = await client.query(
    "SELECT id FROM routes WHERE component = 'TicketDetailPage'"
  );

  if (existingDetail.rows.length > 0) {
    console.log('\n⚠️ 工单详情路由已存在，跳过创建');
    await client.end();
    return;
  }

  // 4. 生成新的 route_key (使用时间戳)
  const routeKey = Date.now().toString();

  // 5. 插入工单详情路由
  const insertResult = await client.query(`
    INSERT INTO routes (
      route_key, path, component, layout, name, parent_id, redirect, 
      sort_order, is_visible, is_enabled, is_index, open_in_new_tab, icon,
      created_at, updated_at
    ) VALUES (
      $1, 'detail/:id', 'TicketDetailPage', 'admin', '工单详情', $2, '',
      2, false, true, false, false, NULL,
      NOW(), NOW()
    ) RETURNING id
  `, [routeKey, ticketListRoute.parent_id]);

  console.log(`\n✅ 已创建工单详情路由，ID: ${insertResult.rows[0].id}`);
  console.log('   - 路径: detail/:id');
  console.log('   - 组件: TicketDetailPage');
  console.log('   - is_visible: false (不在菜单中显示)');
  console.log(`   - parent_id: ${ticketListRoute.parent_id}`);

  await client.end();
  console.log('\n🔌 数据库连接已关闭');
}

main();
