import pg from 'pg';

const config = {
  host: '192.168.50.2',
  port: 5432,
  user: 'ztorrent',
  password: 'TMYBKC47Jm8w4SB7',
  database: 'ztorrent',
};

async function main() {
  const sql = process.argv[2];
  if (!sql) {
    console.error('错误: 请提供 SQL 语句作为参数。');
    process.exit(1);
  }

  const client = new pg.Client(config);
  try {
    await client.connect();
    const res = await client.query(sql);
    
    if (res.command === 'SELECT') {
      console.log(JSON.stringify(res.rows, null, 2));
    } else {
      console.log(JSON.stringify({ 
        success: true, 
        command: res.command, 
        rowCount: res.rowCount 
      }, null, 2));
    }
  } catch (err) {
    console.error('数据库错误:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
