
const { Client } = require('pg');

const client = new Client({
  host: '192.168.50.2',
  port: 5432,
  user: 'ztorrent',
  database: 'ztorrent',
  password: 'TMYBKC47Jm8w4SB7',
});

async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      DELETE FROM routes 
      WHERE id = '1461690883219918848';
    `);
    console.log("Deleted count:", res.rowCount);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
