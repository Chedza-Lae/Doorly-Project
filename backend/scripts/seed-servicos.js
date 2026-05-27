import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(backendRoot, "..");

dotenv.config({ path: path.join(backendRoot, ".env"), quiet: true });

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "doorly",
  multipleStatements: true,
});

try {
  const seedPath = path.join(projectRoot, "database", "seed_servicos.sql");
  const sql = await fs.readFile(seedPath, "utf8");

  await connection.query(sql);

  const [rows] = await connection.query(
    "SELECT COUNT(*) AS total FROM servicos WHERE ativo = 1"
  );

  console.log(`Seed de servicos aplicado. Servicos ativos na base de dados: ${rows[0].total}`);
} finally {
  await connection.end();
}
