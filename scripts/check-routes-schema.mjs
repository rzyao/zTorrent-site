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

  // 查看 routes 表结构
  const columns = await client.query(`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'routes' 
    ORDER BY ordinal_position
  `);
  
  console.log('\n📋 routes 表结构：');
  for (const col of columns.rows) {
    console.log(`  ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
  }

  // 查询一条示例数据
  const sample = await client.query("SELECT * FROM routes LIMIT 1");
  console.log('\n📋 示例数据：');
  console.log(JSON.stringify(sample.rows[0], null, 2));

  await client.end();
}

main();
