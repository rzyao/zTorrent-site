import { Client } from "pg";

const client = new Client({
  host: "192.168.50.2",
  port: 5432,
  user: "ztorrent",
  database: "ztorrent",
  password: "TMYBKC47Jm8w4SB7",
});

// Simple Snowflake-like generator
function generateId() {
  const epoch = 1420070400000n; // 2015-01-01
  const timestamp = BigInt(Date.now()) - epoch;
  const workerId = 1n; // Assuming worker 1
  const sequence = 0n;

  return ((timestamp << 22n) | (workerId << 12n) | sequence).toString();
}

async function run() {
  try {
    await client.connect();

    const parentResult = await client.query(
      "SELECT id, name FROM routes WHERE path = '/forum' OR name = 'Forum' LIMIT 1",
    );
    let parentId = null;
    if (parentResult.rows.length > 0) {
      parentId = parentResult.rows[0].id;
      console.log(`Found parent: ${parentResult.rows[0].name} (${parentId})`);
    }

    const id = generateId();
    console.log(`Generated ID: ${id}`);

    const query = `
      INSERT INTO routes (
        id, route_key, name, path, component, layout, is_visible, is_enabled, parent_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
    `;

    // We pass id twice, once for id (bigint) and once for route_key (varchar)
    // The pg driver should handle the string 'id' for bigint conversion if the column is bigint.
    const values = [
      id,
      id,
      "标签组管理",
      "/forum/admin/tag-groups",
      "@/modules/forum/pages/TagGroupsPage",
      "forum",
      true,
      true,
      parentId,
    ];

    await client.query(query, values);
    console.log("Successfully inserted route.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
