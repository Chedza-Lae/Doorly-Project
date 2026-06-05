import pool from "../config/db.js";

// SUPABASE MIGRATION: favoritos ativos usam boolean true.
export async function listFavorites(userId) {
  const result = await pool.query(
    `SELECT s.*, u.nome AS prestador, f.data_adicionado
     FROM favoritos f
     JOIN servicos s ON f.id_servico = s.id_servico
     JOIN utilizadores u ON s.id_prestador = u.id_utilizador
     WHERE f.id_cliente = $1 AND s.ativo = true
     ORDER BY f.data_adicionado DESC`,
    [userId]
  );
  return result.rows;
}

// SUPABASE MIGRATION: valida servico ativo.
export async function findActiveService(serviceId) {
  const result = await pool.query(
    "SELECT id_servico FROM servicos WHERE id_servico = $1 AND ativo = true",
    [serviceId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: evita duplicados mesmo sem depender de constraint unica.
export async function addFavorite(userId, serviceId) {
  const result = await pool.query(
    `INSERT INTO favoritos (id_cliente, id_servico)
     SELECT $1, $2
     WHERE NOT EXISTS (
       SELECT 1 FROM favoritos WHERE id_cliente = $3 AND id_servico = $4
     )
     RETURNING id_favorito`,
    [userId, serviceId, userId, serviceId]
  );
  return result.rowCount;
}

// SUPABASE MIGRATION: remove favorito com rowCount.
export async function removeFavorite(userId, serviceId) {
  const result = await pool.query(
    "DELETE FROM favoritos WHERE id_cliente = $1 AND id_servico = $2",
    [userId, serviceId]
  );
  return result.rowCount;
}
