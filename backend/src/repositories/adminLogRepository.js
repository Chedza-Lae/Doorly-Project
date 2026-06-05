import pool from "../config/db.js";

// NEW FEATURE: regista automaticamente acoes administrativas.
export async function createAdminLog({ admin_id, action, target_user_id = null, details = "" }, client = pool) {
  const result = await client.query(
    `INSERT INTO admin_logs (admin_id, action, target_user_id, details)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [admin_id, action, target_user_id, details]
  );
  return result.rows[0];
}

// SUPABASE MIGRATION: listagem de logs com rows.
export async function listAdminLogs() {
  const result = await pool.query(
    "SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 100"
  );
  return result.rows;
}
