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

  // 查询 playlist detail 和它的父级
  const detailRoute = await client.query(`
    SELECT id, route_key, path, component, layout, name, parent_id
    FROM routes 
    WHERE id = '797039193250467840'
  `);

  const detail = detailRoute.rows[0];
  console.log('\n📌 片单详情路由:');
  console.log(`  path: ${detail.path}`);
  console.log(`  parent_id: ${detail.parent_id}`);

  // 查询父级
  const parentRoute = await client.query(`
    SELECT id, route_key, path, component, layout, name, parent_id
    FROM routes 
    WHERE id = $1
  `, [detail.parent_id]);

  if (parentRoute.rows.length > 0) {
    const parent = parentRoute.rows[0];
    console.log('\n📌 父级路由:');
    console.log(`  path: ${parent.path}`);
    console.log(`  layout: ${parent.layout}`);
    console.log(`  parent_id: ${parent.parent_id}`);

    // 如果还有父级，继续查询
    if (parent.parent_id) {
      const grandParent = await client.query(`
        SELECT id, route_key, path, component, layout, name, parent_id
        FROM routes 
        WHERE id = $1
      `, [parent.parent_id]);

      if (grandParent.rows.length > 0) {
        const gp = grandParent.rows[0];
        console.log('\n📌 祖父级路由:');
        console.log(`  path: ${gp.path}`);
        console.log(`  layout: ${gp.layout}`);
      }
    }
  }

  // 根据层级拼接完整路径
  console.log('\n⚠️ 如果您访问的是 /playlist/xxx 但布局是 app，');
  console.log('   那么完整路径可能需要是 /app/playlist/xxx');

  await client.end();
}

main();
