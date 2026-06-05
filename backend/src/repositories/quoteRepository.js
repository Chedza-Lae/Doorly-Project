import pool from "../config/db.js";

// SUPABASE MIGRATION: procura servico ativo para pedido de orcamento.
export async function findActiveQuoteService(serviceId) {
  const result = await pool.query(
    `SELECT s.id_servico, s.id_prestador, s.titulo, u.email AS prestador_email
     FROM servicos s
     JOIN utilizadores u ON u.id_utilizador = s.id_prestador
     WHERE s.id_servico = $1 AND s.ativo = true`,
    [serviceId]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: cria pedido com RETURNING.
export async function createQuote(payload, client = pool) {
  const result = await client.query(
    `INSERT INTO pedidos_orcamento
       (id_servico, id_cliente, id_prestador, detalhes, localizacao, data_preferida, periodo, urgencia, orcamento_estimado, contacto, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'novo')
     RETURNING id_orcamento`,
    [
      payload.id_servico,
      payload.id_cliente,
      payload.id_prestador,
      payload.detalhes,
      payload.localizacao,
      payload.data_preferida,
      payload.periodo,
      payload.urgencia,
      payload.orcamento_estimado,
      payload.contacto
    ]
  );
  return result.rows[0];
}

// SUPABASE MIGRATION: liga mensagem ao pedido.
export async function linkQuoteMessage(quoteId, messageId, client = pool) {
  await client.query(
    "UPDATE pedidos_orcamento SET id_mensagem = $1 WHERE id_orcamento = $2",
    [messageId, quoteId]
  );
}

// NEW FEATURE: CRUD - lista pedidos do cliente.
export async function listClientQuotes(userId) {
  const result = await pool.query(
    `SELECT p.*, s.titulo AS titulo_servico, pr.nome AS nome_prestador, pr.email AS email_prestador
     FROM pedidos_orcamento p
     JOIN servicos s ON s.id_servico = p.id_servico
     JOIN utilizadores pr ON pr.id_utilizador = p.id_prestador
     WHERE p.id_cliente = $1
     ORDER BY p.data_pedido DESC, p.id_orcamento DESC`,
    [userId]
  );
  return result.rows;
}

// SUPABASE MIGRATION: lista pedidos do prestador/admin.
export async function listProviderQuotes(user) {
  const params = [];
  let ownerClause = "";

  if (user.tipo !== "admin") {
    ownerClause = "WHERE p.id_prestador = $1";
    params.push(user.id);
  }

  const result = await pool.query(
    `SELECT
       p.*,
       s.titulo AS titulo_servico,
       c.nome AS nome_cliente,
       c.email AS email_cliente
     FROM pedidos_orcamento p
     JOIN servicos s ON s.id_servico = p.id_servico
     JOIN utilizadores c ON c.id_utilizador = p.id_cliente
     ${ownerClause}
     ORDER BY p.data_pedido DESC, p.id_orcamento DESC`,
    params
  );
  return result.rows;
}

// NEW FEATURE: CRUD - detalhe de pedido.
export async function findQuoteById(quoteId) {
  const result = await pool.query(
    `SELECT p.*, s.titulo AS titulo_servico, c.nome AS nome_cliente, pr.nome AS nome_prestador
     FROM pedidos_orcamento p
     JOIN servicos s ON s.id_servico = p.id_servico
     JOIN utilizadores c ON c.id_utilizador = p.id_cliente
     JOIN utilizadores pr ON pr.id_utilizador = p.id_prestador
     WHERE p.id_orcamento = $1`,
    [quoteId]
  );
  return result.rows[0] || null;
}

// NEW FEATURE: CRUD - edita pedido.
export async function updateQuote(quoteId, payload) {
  const result = await pool.query(
    `UPDATE pedidos_orcamento
     SET detalhes = $1,
         localizacao = $2,
         data_preferida = $3,
         periodo = $4,
         urgencia = $5,
         orcamento_estimado = $6,
         contacto = $7
     WHERE id_orcamento = $8
     RETURNING *`,
    [
      payload.detalhes,
      payload.localizacao,
      payload.data_preferida,
      payload.periodo,
      payload.urgencia,
      payload.orcamento_estimado,
      payload.contacto,
      quoteId
    ]
  );
  return result.rows[0] || null;
}

// SUPABASE MIGRATION: atualiza estado com rowCount.
export async function updateQuoteStatus(quoteId, estado, user) {
  const result = await pool.query(
    `UPDATE pedidos_orcamento
     SET estado = $1
     WHERE id_orcamento = $2
       AND (id_prestador = $3 OR id_cliente = $4 OR $5 = 'admin')`,
    [estado, quoteId, user.id, user.id, user.tipo]
  );
  return result.rowCount;
}

// NEW FEATURE: CRUD - elimina pedido.
export async function deleteQuote(quoteId, user) {
  const result = await pool.query(
    `DELETE FROM pedidos_orcamento
     WHERE id_orcamento = $1
       AND (id_cliente = $2 OR id_prestador = $3 OR $4 = 'admin')`,
    [quoteId, user.id, user.id, user.tipo]
  );
  return result.rowCount;
}
