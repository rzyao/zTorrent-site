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

  // 检查 movie 详情路由
  const movieRoute = await client.query(`
    SELECT id, path, component, parent_id, is_enabled, layout
    FROM routes 
    WHERE component = 'MovieDetailPage' OR path LIKE 'movie%'
  `);

  console.log('📋 Movie 相关路由:');
  movieRoute.rows.forEach(r => {
    console.log(`  path: ${r.path} | component: ${r.component} | layout: ${r.layout}`);
  });

  await client.end();
}

main();
