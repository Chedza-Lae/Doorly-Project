import pg from "pg";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(backendRoot, "..");

dotenv.config({ path: path.join(backendRoot, ".env"), quiet: true });

const { Pool } = pg;

// SUPABASE MIGRATION: seed usa pg/DATABASE_URL em vez de mysql2.
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false }
      }
);

try {
  const seedPath = path.join(projectRoot, "database", "seed_servicos.sql");
  const sql = await fs.readFile(seedPath, "utf8");

  await pool.query(sql);

  const result = await pool.query(
    "SELECT COUNT(*)::int AS total FROM servicos WHERE ativo = true"
  );

  console.log(`Seed de serviços aplicado. Serviços ativos na base de dados: ${result.rows[0].total}`);
} finally {
  await pool.end();
}
