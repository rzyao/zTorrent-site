import { Client } from "pg";

const client = new Client({
  host: "192.168.50.2",
  port: 5432,
  user: "ztorrent",
  database: "ztorrent",
  password: "TMYBKC47Jm8w4SB7",
});

async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      SELECT id, path, component, name, parent_id 
      FROM routes 
      WHERE path LIKE '%tag%' OR path LIKE '%Tag%'
      ORDER BY path
    `);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
