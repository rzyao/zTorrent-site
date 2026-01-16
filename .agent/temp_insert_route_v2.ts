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
  const workerId = 1n;
  const sequence = BigInt(Math.floor(Math.random() * 1000));

  return ((timestamp << 22n) | (workerId << 12n) | sequence).toString();
}

async function run() {
  try {
    await client.connect();

    // Parent ID for 'forum' route from provided JSON
    const parentId = "797039193896390656";
    const routeKey = "ForumTagGroups";
    const routePath = "admin/tag-groups";
    const permissionKey = "forum:admin:tag:groups";

    // 1. Check if route exists
    const checkRes = await client.query("SELECT id FROM routes WHERE route_key = $1", [routeKey]);
    let routeId;

    if (checkRes.rows.length > 0) {
      console.log(`Route ${routeKey} already exists. Updating...`);
      routeId = checkRes.rows[0].id;

      await client.query(
        `
            UPDATE routes 
            SET path = $1, parent_id = $2, component = $3, layout = $4, is_enabled = true, is_visible = true, name = $5
            WHERE id = $6
        `,
        [
          routePath,
          parentId,
          "@/modules/forum/pages/TagGroupsPage",
          "forum",
          "标签组管理",
          routeId,
        ],
      );
    } else {
      routeId = generateId();
      console.log(`Creating new route with ID: ${routeId}`);

      await client.query(
        `
          INSERT INTO routes (
            id, route_key, name, path, component, layout, is_visible, is_enabled, parent_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9
          )
        `,
        [
          routeId,
          routeKey,
          "标签组管理",
          routePath,
          "@/modules/forum/pages/TagGroupsPage",
          "forum",
          true,
          true,
          parentId,
        ],
      );
    }

    // 2. Insert Permissions
    // Check if permission exists for this route
    const permCheck = await client.query(
      "SELECT id FROM route_permissions WHERE route_id = $1 AND permission_key = $2",
      [routeId, permissionKey],
    );
    if (permCheck.rows.length === 0) {
      const permId = generateId();
      console.log(`Adding permission ${permissionKey} with ID ${permId}`);
      await client.query(
        `
            INSERT INTO route_permissions (id, route_id, permission_key) VALUES ($1, $2, $3)
        `,
        [permId, routeId, permissionKey],
      );
    } else {
      console.log(`Permission ${permissionKey} already exists.`);
    }

    console.log("Operation completed successfully.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
