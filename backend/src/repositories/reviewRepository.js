import pool from "../config/db.js";

// SUPABASE MIGRATION: lista avaliações por serviço.
export async function listReviewsByService(serviceId) {
  const result = await pool.query(
    `SELECT
       a.id_avaliacao,
       a.id_servico,
       a.id_cliente,
       a.nota,
       a.comentario,
       a.data,
       u.nome AS cliente
     FROM avaliacoes a
     JOIN utilizadores u ON u.id_utilizador = a.id_cliente
     WHERE a.id_servico = $1
     ORDER BY a.data DESC, a.id_avaliacao DESC`,
    [serviceId]
  );
  return result.rows;
}

// SUPABASE MIGRATION: lista avaliações do prestador/admin.
export async function listProviderReviews(user) {
  const params = [];
  let ownerClause = "";

  if (user.tipo !== "admin") {
    params.push(user.id);
    ownerClause = "WHERE s.id_prestador = $1";
  }

  const result = await pool.query(
    `SELECT
       a.id_avaliacao,
       a.id_servico,
       a.id_cliente,
       a.nota,
       a.comentario,
       a.data,
       s.titulo AS titulo_servico,
       c.nome AS cliente
     FROM avaliacoes a
     JOIN servicos s ON s.id_servico = a.id_servico
     JOIN utilizadores c ON c.id_utilizador = a.id_cliente
     ${ownerClause}
     ORDER BY a.data DESC, a.id_avaliacao DESC`,
    params
  );
  return result.rows;
}

// SUPABASE MIGRATION: procura serviço avaliado.
export async function findReviewService(serviceId) {
  const result = await pool.query(
    "SELECT id_servico, id_prestador FROM servicos WHERE id_servico = $1",
    [serviceId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: impede avaliação duplicada por cliente/serviço.
export async function findReviewByClient(serviceId, clientId) {
  const result = await pool.query(
    "SELECT id_avaliacao FROM avaliacoes WHERE id_servico = $1 AND id_cliente = $2",
    [serviceId, clientId]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: cria avaliação com RETURNING.
export async function createReview({ id_servico, id_cliente, nota, comentario }) {
  const result = await pool.query(
    `INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
     VALUES ($1, $2, $3, $4)
     RETURNING id_avaliacao`,
    [id_servico, id_cliente, nota, comentario]
  );
  return result.rows[0];
}

// SUPABASE MIGRATION: resumo de avaliações com rows.
export async function getReviewSummary(serviceId) {
  const result = await pool.query(
    "SELECT COALESCE(AVG(nota), 0) AS rating, COUNT(*) AS total_avaliacoes FROM avaliacoes WHERE id_servico = $1",
    [serviceId]
  );
  return result.rows[0];
}
